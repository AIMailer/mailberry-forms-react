import { createContext, useContext, useEffect, useState } from 'react';
import { FieldType, FormPopupOptions, FormatOptions, MailberryFormCSSProps, formFormat } from '../types';
import { css } from '../utils/css-generator';
import MailberryFormFieldComponents from "./MailberryFormField";
import MailberryFormPopup from './MailberryPopupOption';
import MailberryFormSnippet from './MailberrySnippetOption';

type ContextProps = {
  fields: FieldType[];
  setFields: React.Dispatch<React.SetStateAction<FieldType[]>>;
  emptyFields: boolean;
  invalidEmail: boolean;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitted: boolean;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  showErrorMessage: boolean;
  showThanksMessage: boolean;
}

export const FormContext = createContext({} as ContextProps);

const API_FORM_URL = 'https://backend.mailberry.ai/public'

type MailberryFormProps = {
  formId: string;
  formStyle?: MailberryFormCSSProps;
  signature?: boolean;
  thanksMessage: string;
  format: FormatOptions;
  showAt?: FormPopupOptions;
  children: React.ReactNode | React.ReactNode[];
};

interface MailberryFormComponents {
  EmailInput: typeof MailberryFormFieldComponents.MailberryEmailInput;
  TextInput: typeof MailberryFormFieldComponents.MailberryTextInput;
  NumberInput: typeof MailberryFormFieldComponents.MailberryNumberInput;
  DateInput: typeof MailberryFormFieldComponents.MailberryDateInput;
  Description: typeof MailberryDescription;
  FieldError: typeof MailberryFieldError;
  Submit: typeof MailberrySubmit;
  ThanksMessage: typeof MailberryThanksMessage;
}

const MailberryForm: React.FC<MailberryFormProps> & MailberryFormComponents = ({ formId, formStyle, signature = true, thanksMessage, format, showAt = 'IMMEDIATELY', children }): React.ReactNode => {
  const href = `${API_FORM_URL}/${formId}`;

  const [fields, setFields] = useState<FieldType[]>([]);
  const [emptyFields, setEmptyFields] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showThanksMessage, setShowThanksMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    if(!formStyle) return

    if(document.getElementById('mailberry-form-styles')) return
    console.log({formStyle})

    var styleTag = document.createElement('style');
    styleTag.innerHTML = css(JSON.parse(JSON.stringify(formStyle)));
    styleTag.setAttribute('id', 'mailberry-form-styles');
    document.getElementsByTagName('head')[0].appendChild(styleTag);
  }, [])


  const validateField = (field: FieldType, value: string): boolean => {
    if (field.required && !value) {
      setEmptyFields(true);
      return false
    }
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setInvalidEmail(true);
      return false
    }

    setEmptyFields(false);
    setInvalidEmail(false);
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setInvalidEmail(false);
    setEmptyFields(false);

    let allFieldsFilled = true;
    for (const field of fields) {
      const value = field.value;
      if (!validateField(field, value)) {
        allFieldsFilled = false;
        break;
      }
    }

    if(allFieldsFilled){
      setIsSubmitting(true);

      // get the fields in this format { label: value }
      const formData: Record<string, string> = {};
      fields.forEach(field => {
        formData[field.label.toLowerCase()] = field.value;
      });

      try {
        const response = await fetch(href, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        setIsSubmitted(true);

        if (response.ok) {
          setShowThanksMessage(true);
          localStorage.removeItem(`closed_${formId}`);
          localStorage.setItem(`subscribed_${formId}`, Date.now().toString());
        } else {
          setShowErrorMessage(true);
        }
      } catch (error) {
        setIsSubmitted(true);
        setShowErrorMessage(true); 
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <FormContext.Provider value={{ fields, setFields, emptyFields, invalidEmail, isSubmitted, isSubmitting, setIsSubmitted, setIsSubmitting, showErrorMessage, showThanksMessage }}>
      {
        format === formFormat.POPUP ?  <MailberryFormPopup href={href} signature={signature} thanksMessage={thanksMessage} handleSubmit={handleSubmit} formId={formId} children={children} showAt={showAt} /> : <MailberryFormSnippet href={href} signature={signature} thanksMessage={thanksMessage} handleSubmit={handleSubmit} children={children} />
      }
    </FormContext.Provider>
  );
};

type MailberryNode = {
  children: React.ReactNode;
}

const MailberryDescription: React.FC<MailberryNode> = ({ children }): React.ReactNode => (<>{children}</>);

type MailberrySubmitProps = {
  text: string;
  buttonWrapperStyles?: React.CSSProperties;
  buttonStyles?: React.CSSProperties;
}

const MailberrySubmit: React.FC<MailberrySubmitProps> = ({ text, buttonStyles = {}, buttonWrapperStyles = {} }) => {
  const { isSubmitting } = useContext(FormContext);

  return (
    <div className='MBbtn-wrapper' style={buttonWrapperStyles}>
      <button className='MBbtn' type="submit" disabled={isSubmitting} style={buttonStyles}>{text}</button>
    </div>
  )
};

const MailberryThanksMessage = ({ children }: MailberryNode): React.ReactNode => (<>{children}</>);

type MailberryFieldErrorProps = {
  listWrapperStyles?: React.CSSProperties;
  listStyles?: React.CSSProperties;
}

const MailberryFieldError: React.FC <MailberryFieldErrorProps> = ({ listWrapperStyles, listStyles }): React.ReactNode => {
  const { invalidEmail, emptyFields } = useContext(FormContext);

  return (
    <ul style={listWrapperStyles ?? { color: 'red', display: 'none', fontSize: 14, fontFamily: 'Arial', paddingLeft: 0, listStyle: 'none' }}>
      {invalidEmail && <li style={listStyles} >Please enter a valid email address</li>}
      {emptyFields && <li style={listStyles} >Please fill in all required fields</li>}
    </ul>
  )
};

MailberryForm.EmailInput = MailberryFormFieldComponents.MailberryEmailInput;
MailberryForm.TextInput = MailberryFormFieldComponents.MailberryTextInput;
MailberryForm.NumberInput = MailberryFormFieldComponents.MailberryNumberInput;
MailberryForm.DateInput = MailberryFormFieldComponents.MailberryDateInput;
MailberryForm.Description = MailberryDescription;
MailberryForm.FieldError = MailberryFieldError;
MailberryForm.Submit = MailberrySubmit;
MailberryForm.ThanksMessage = MailberryThanksMessage;

export default MailberryForm;