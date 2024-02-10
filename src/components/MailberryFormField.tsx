import React from 'react';
import { useContext, useEffect, useRef } from "react";
import { FormContext } from "./MailberryForm";

type MailberryFormFieldProps = {
  label: string;
  type: React.HTMLInputTypeAttribute;
  required?: boolean;

  labelStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
}

const FormField = ({ label, type, required = false, labelStyle, inputStyle, wrapperStyle }: MailberryFormFieldProps): JSX.Element => {
  const { fields, setFields, invalidEmail, emptyFields } = useContext(FormContext);
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
    <div style={wrapperStyle}>
      <label htmlFor={`mailberry-${labelIdentifier}-${type}`} className='MBlabel' style={labelStyle}>
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
        style={inputStyle}
      />
      { invalidEmail && type === 'email' && <p style={{color: "red", fontSize: "14px", fontFamily: "Arial", paddingLeft: 0, marginTop: 0, marginBottom: 4}}>Please enter a valid email address</p> }
      { emptyFields && required && <p style={{color: "red", fontSize: "14px", fontFamily: "Arial", paddingLeft: 0, marginTop: 0, marginBottom: 4}}>Please fill in all required fields</p> }
    </div>
  );
};

export type MailberryInputProps = {
  label: string;
  required?: boolean;
  labelStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
}

const MailberryEmailInput = ({ label, required, inputStyle = {}, labelStyle = {}, wrapperStyle = {} }: MailberryInputProps) => FormField({ label, type: 'email', required, labelStyle, inputStyle, wrapperStyle});
const MailberryTextInput = ({ label, required, inputStyle = {}, labelStyle = {}, wrapperStyle = {} }: MailberryInputProps) => FormField({label, type: 'text', required, labelStyle, inputStyle, wrapperStyle});
const MailberryNumberInput = ({ label, required, inputStyle = {}, labelStyle = {}, wrapperStyle = {} }: MailberryInputProps) => FormField({label, type: 'number', required, labelStyle, inputStyle, wrapperStyle});
const MailberryDateInput = ({ label, required, inputStyle = {}, labelStyle = {}, wrapperStyle = {} }: MailberryInputProps) => FormField({label, type: 'date', required, labelStyle, inputStyle, wrapperStyle});

const MailberryFormFieldComponents = {
  MailberryEmailInput,
  MailberryTextInput,
  MailberryNumberInput,
  MailberryDateInput
}

export default MailberryFormFieldComponents;