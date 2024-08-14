import React, { createContext, useContext, useState } from 'react';
import { FieldType, FormatOptions, PopUpFormShowAt, formFormat } from '../types';
import { removeClosedFormFromLocalStorage, setSubscriptionToLocalStorage } from '../utils/localStorage';
import MailberryFormFieldComponents from "./MailberryFormField";
import MailberryFormPopup from './MailberryPopupOption';
import MailberryFormSnippet from './MailberrySnippetOption';
import MailberrySubmit from './MailberrySubmit';

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

const getBaseApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://backend.mailberry.ai/public';
  }else if (process.env.NODE_ENV === 'staging') {
    return 'https://y4xtgbmdcf.execute-api.us-west-1.amazonaws.com/public';
  }

  return 'http://localhost:8000/public';
}

type MailberryFormProps = {
  formId: string;
  signature?: boolean;
  thanksMessage: string;
  format: FormatOptions;
  formContainerStyles?: React.CSSProperties;
  showAt?: PopUpFormShowAt;
  children: React.ReactNode | React.ReactNode[];
};

interface MailberryFormComponents {
  EmailInput: typeof MailberryFormFieldComponents.MailberryEmailInput;
  TextInput: typeof MailberryFormFieldComponents.MailberryTextInput;
  NumberInput: typeof MailberryFormFieldComponents.MailberryNumberInput;
  DateInput: typeof MailberryFormFieldComponents.MailberryDateInput;
  CheckboxInput: typeof MailberryFormFieldComponents.MailberryCheckboxInput;
  Description: typeof MailberryDescription;
  FieldError: typeof MailberryFieldError;
  Submit: typeof MailberrySubmit;
  ThanksMessage: typeof MailberryThanksMessage;
}

const MailberryForm: React.FC<MailberryFormProps> & MailberryFormComponents = ({ formId, signature = true, thanksMessage, format, showAt, formContainerStyles = {}, children }): React.ReactNode => {
  const href = `${getBaseApiUrl()}/${formId}`;

  const [fields, setFields] = useState<FieldType[]>([]);
  const [emptyFields, setEmptyFields] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showThanksMessage, setShowThanksMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

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

    const allFieldsFilled = fields.every(field => validateField(field, field.value));

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

          removeClosedFormFromLocalStorage(formId);
          setSubscriptionToLocalStorage(formId)
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
        format === formFormat.POPUP ?  <MailberryFormPopup href={href} signature={signature} thanksMessage={thanksMessage} handleSubmit={handleSubmit} formId={formId} children={children} formContainerStyles={formContainerStyles} showAt={showAt} /> : <MailberryFormSnippet href={href} signature={signature} thanksMessage={thanksMessage} formContainerStyles={formContainerStyles} handleSubmit={handleSubmit} children={children} />
      }
    </FormContext.Provider>
  );
};

type MailberryNode = {
  children: React.ReactNode;
}

const MailberryDescription: React.FC<MailberryNode> = ({ children }): React.ReactNode => (<>{children}</>);

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
MailberryForm.CheckboxInput = MailberryFormFieldComponents.MailberryCheckboxInput;
MailberryForm.Description = MailberryDescription;
MailberryForm.FieldError = MailberryFieldError;
MailberryForm.Submit = MailberrySubmit;
MailberryForm.ThanksMessage = MailberryThanksMessage;

export default MailberryForm;