import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { CSSProps, FieldType, FormPopupOptions, FormatOptions, formFormat } from '../types';
import { css } from '../utils/css-generator';
import { MailberryFormPopup, MailberryFormSnippet } from './';

export type ContextProps = {
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

const API_FORM_URL = 'https://y4xtgbmdcf.execute-api.us-west-1.amazonaws.com/production/public'

type MailberryFormProps = {
  formId: string;
  style: CSSProps;
  signature?: boolean;
  thanksMessage: string;
  format: FormatOptions;
  showAt?: FormPopupOptions;
  children: React.ReactNode;
};

const MailberryFormRoot: React.FC<MailberryFormProps> = ({ formId, style, signature = true, thanksMessage, format, showAt = 'IMMEDIATELY', children }) => {
  const href = `${API_FORM_URL}/${formId}`;

  const [fields, setFields] = useState<FieldType[]>([]);
  const [emptyFields, setEmptyFields] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showThanksMessage, setShowThanksMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    if(document.getElementById('mailberry-form-styles')) return

    var styleTag = document.createElement('style');
    styleTag.innerHTML = css(style);
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

const useFormField = (label: string, type: React.HTMLInputTypeAttribute, required: boolean = false): React.ReactNode => {
  const { fields, setFields } = useContext(FormContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields(fields.map(field => field.label.toLowerCase() === label.toLowerCase() ? { ...field, value: e.target.value } : field));
  };
  const labelIdentifier = label.toLowerCase().replace(' ', '-');

  // When they are mounted, add the field to the form so we are adding a new field to the form for each input
  useEffect(() => {
    if (fields?.find(field => field.label === label)) return;

    fields.push({ label, type, required, value: '' });
  }, []);

  return (
    <div className='MBinput-wrapper'>
      <label htmlFor={`mailberry-${labelIdentifier}-${type}`} className='MBlabel'>
        {label}{required && '*'}
      </label>
      <input 
        ref={inputRef}
        id={`mailberry-${labelIdentifier}-${type}`} 
        className='MBinput'
        type={type}
        name={label} 
        onChange={handleChange} 
        autoComplete='off'
        required={required}
      />
    </div>
  );
};

export type MailberryInputProps = {
  label: string;
  required?: boolean;
}

const MailberryEmailInput: React.FC<MailberryInputProps> = ({ label, required }: MailberryInputProps) => useFormField(label, 'email', required);
const MailberryTextInput: React.FC<MailberryInputProps> = ({ label, required }: MailberryInputProps) => useFormField(label, 'text', required);
const MailberryNumberInput: React.FC<MailberryInputProps> = ({ label, required }: MailberryInputProps) => useFormField(label, 'number', required);
const MailberryDateInput: React.FC<MailberryInputProps> = ({ label, required }: MailberryInputProps) => useFormField(label, 'date', required);

type MailberryNode = {
  children: React.ReactNode;
}

const MailberryHeader: React.FC<MailberryNode> = ({ children }) => (<>{children}</>);
const MailberryDescription: React.FC<MailberryNode> = ({ children }) => (
  <div className='MBdescription'>
    {children}
    <hr className='MBdivider' />
  </div>
);

const MailberrySubmit: React.FC<{ text: string }> = ({ text }) => {
  const { isSubmitting } = useContext(FormContext);

  return (
    <div className='MBbtn-wrapper'>
      <button className='MBbtn' type="submit" disabled={isSubmitting}>{text}</button>
    </div>
  )
};

const MailberryThanksMessage: React.FC<MailberryNode> = ({ children }) => (<>{children}</>);

export const MailberryForm = {
  Root: MailberryFormRoot,
  Header: MailberryHeader,
  Description: MailberryDescription,
  EmailInput: MailberryEmailInput,
  TextInput: MailberryTextInput,
  NumberInput: MailberryNumberInput,
  DateInput: MailberryDateInput,
  Submit: MailberrySubmit,
  ThanksMessage: MailberryThanksMessage,
};