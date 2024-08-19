import React, { useContext, useEffect } from "react";
import { FormContext } from "./MailberryForm";

type MailberrySnippetProps = {
  href: string;
  signature: boolean;
  thanksMessage: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formStyles: {
    container?: React.CSSProperties;
    wrapper?: React.CSSProperties;
    form?: React.CSSProperties;
    statusMessage?: React.CSSProperties;
  };
  children: React.ReactNode;
}

const defaultFormContainerStyles: React.CSSProperties = {
  width: 400,
  borderRadius: 12,
  animation: 'MBopacity-in 0.4s linear',
}

const MailberryFormSnippet = ({ href, signature, thanksMessage, handleSubmit, formStyles, children }: MailberrySnippetProps) => {
  const { isSubmitted, isSubmitting, showErrorMessage, showThanksMessage } = useContext(FormContext);
  const { container: containerStyle, wrapper: wrapperStyle, form: formStyle, statusMessage: statusMessageStyle } = formStyles;
  // Every time this component is rendered, we send a request to register that the form was viewed
  useEffect(() => {
    fetch(href)
  }, []);

  return (
    <div style={{ ...defaultFormContainerStyles, ...containerStyle }}>
      {/* Spinner */}
      {
        isSubmitting && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: '4px solid #ccc', borderTopColor: '#999999', animation: 'MBspin-animation 1s linear infinite' }}></div>
          </div>
        ) 
      }

      {/* Form */}
      {
        isSubmitting || !isSubmitted && (
          <div style={wrapperStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
              {Array.isArray(children) ? children.slice(0,-1) : children}
            </form>
              <div style={{ width: '100%' }}>
                {Array.isArray(children) && children[children.length-1]}
              </div>
              {
                signature && (
                  <div style={{ display: 'flex', marginTop: 20, justifyContent: 'center' }}>
                    <p style={{ fontSize: 8, fontFamily: 'Arial, Helvetica, sans-serif' }}>Powered by</p>
                    <a href={href} target='_blank' rel='noopener noreferrer'><p style={{ fontSize: 8, fontFamily: 'Arial, Helvetica, sans-serif', marginLeft: 2 }}>MailBerry</p></a>
                  </div>
                )
              }
          </div>
        )
      }

      {/* Thank you message */}
      {
        showThanksMessage && 
          <div style={statusMessageStyle}>
            <p style={{ margin: 10, textAlign: 'center' }}>{thanksMessage}</p>
          </div>
      }

      {/* Error message */}
      {
        showErrorMessage && (
          <div style={statusMessageStyle}>
            <p style={{ margin: 10, textAlign: 'center' }}>Something went wrong.</p>
          </div>
        )
      }
    </div>
  )
}

export default MailberryFormSnippet;
