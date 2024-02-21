import React, { useContext, useEffect, useRef } from 'react';
import { FormContext } from "./MailberryForm";

type MailberryFormFieldProps = {
  label: string;
  type: React.HTMLInputTypeAttribute;
  required?: boolean;

  fieldStyles?: {
    label?: React.CSSProperties;
    input?: React.CSSProperties;
    wrapper?: React.CSSProperties;
  }
}

const generateDefaultStyles = (type: React.HTMLInputTypeAttribute) => {
  if (type === 'checkbox') {
    const wrapperStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'start',
      gap: 4
    }
    const inputStyle: React.CSSProperties = {
      width: 16,
      height: 16,
      margin: 0
    }
    
    return { wrapperStyle, inputStyle };
  }

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  }
  const inputStyle: React.CSSProperties = {
    padding: 11,
    border: '1px solid #ccc',
    borderRadius: 5,
    marginBottom: 5,
  }
  
  return { wrapperStyle, inputStyle };
}

const FormField = ({ label, type, required = false, fieldStyles = {} }: MailberryFormFieldProps): JSX.Element => {
  const { input: inputStyle = {}, label: labelStyle = {}, wrapper: wrapperStyle = {} } = fieldStyles;
  const { fields, setFields } = useContext(FormContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields(fields.map(field => field.label.toLowerCase() === label.toLowerCase() ? { ...field, value: e.target.value } : field));
  };
  const labelIdentifier = label.toLowerCase().replace(' ', '-');
  const defaultStyles = generateDefaultStyles(type);

  // When they are mounted, add the field to the form so we are adding a new field to the form for each input
  useEffect(() => {
    if (fields?.find(field => field.label === label)) return;

    fields.push({ label, type, required, value: '' });
  }, []);

  return (
    <div style={{ ...defaultStyles.wrapperStyle, ...wrapperStyle }}>
      <label htmlFor={`mailberry-${labelIdentifier}-${type}`} className='MBlabel' style={labelStyle}>
        {label}{required && '*'}
      </label>
      <input
        ref={inputRef}
        id={`mailberry-${labelIdentifier}-${type}`} 
        type={type}
        name={label}
        onChange={handleChange} 
        autoComplete='off'
        required={required}
        style={{...defaultStyles.inputStyle, ...inputStyle}}
      />
    </div>
  );
};

export type MailberryInputProps = {
  label: string;
  required?: boolean;

  fieldStyles?: {
    label?: React.CSSProperties;
    input?: React.CSSProperties;
    wrapper?: React.CSSProperties;
  } 
}

const MailberryEmailInput = ({ label, required, fieldStyles = {} }: MailberryInputProps) => FormField({ label, type: 'email', required, fieldStyles});
const MailberryTextInput = ({ label, required, fieldStyles = {} }: MailberryInputProps) => FormField({label, type: 'text', required, fieldStyles});
const MailberryNumberInput = ({ label, required, fieldStyles = {} }: MailberryInputProps) => FormField({label, type: 'number', required, fieldStyles});
const MailberryDateInput = ({ label, required, fieldStyles = {} }: MailberryInputProps) => FormField({label, type: 'date', required, fieldStyles});
const MailberryCheckboxInput = ({ label, required, fieldStyles = {} }: MailberryInputProps) => FormField({label, type: 'checkbox', required, fieldStyles});

const MailberryFormFieldComponents = {
  MailberryEmailInput,
  MailberryTextInput,
  MailberryNumberInput,
  MailberryDateInput,
  MailberryCheckboxInput
}

export default MailberryFormFieldComponents;