import React, { useContext } from "react";
import { FormContext } from "./MailberryForm";

type MailberrySubmitProps = {
  text: string;
  buttonWrapperStyles?: React.CSSProperties;
  buttonStyles?: React.CSSProperties;
}

const defaultWrapperStyles: React.CSSProperties = {
  marginTop: 20,
  display: 'flex',
  justifyContent: 'flex-end',
  width: '100%',
}

const defaultButtonStyles: React.CSSProperties = {
  padding: 8,
  borderRadius: 5,
  border: 'none',
  cursor: 'pointer'
}

const MailberrySubmit: React.FC<MailberrySubmitProps> = ({ text, buttonStyles = {}, buttonWrapperStyles = {} }) => {
  const { isSubmitting } = useContext(FormContext);

  // TODO: Pasar las prps font size, font family, color y bg color desde el front como styles con la prop de buttonStyles
  return (
    <div  style={{...defaultWrapperStyles, ...buttonWrapperStyles}}>
      <button type="submit" disabled={isSubmitting} style={{...defaultButtonStyles, ...buttonStyles}}>{text}</button>
    </div>
  )
};

export default MailberrySubmit