import React, { useContext, useEffect } from "react";
import { FormContext } from "./MailberryForm";

type MailberrySnippetProps = {
  href: string;
  signature: boolean;
  thanksMessage: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formContainerStyles: React.CSSProperties;
  children: React.ReactNode;
}

const defaultFormContainerStyles: React.CSSProperties = {
  width: 400,
  borderRadius: 12,
  animation: 'MBopacity-in 0.4s linear',
  padding: 30,
  paddingBottom: 10
}

const MailberryFormSnippet = ({ href, signature, thanksMessage, handleSubmit, formContainerStyles, children }: MailberrySnippetProps) => {
  const { isSubmitted, isSubmitting, showErrorMessage, showThanksMessage } = useContext(FormContext);

  // Every time this component is rendered, we send a request to register that the form was viewed
  useEffect(() => {
    fetch(href)
  }, []);

  return (
    <div style={{ ...defaultFormContainerStyles, ...formContainerStyles }}>
      {/* Spinner */}
      {
        isSubmitting && (
          <div style={{ padding: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: '4px solid #ccc', borderTopColor: '#999999', animation: 'MBspin-animation 1s linear infinite' }}></div>
          </div>
        ) 
      }

      {/* Form */}
      {
        isSubmitting || !isSubmitted && (
          <form onSubmit={handleSubmit}>
            {children}
            {
              signature && (
                <div style={{ display: 'flex', marginTop: 20, justifyContent: 'center' }}>
                  <p style={{ fontSize: 8, fontFamily: 'Arial, Helvetica, sans-serif' }}>Powered by</p>
                  <a href={href} target='_blank' rel='noopener noreferrer'><p style={{ fontSize: 8, fontFamily: 'Arial, Helvetica, sans-serif', marginLeft: 2 }}>MailBerry</p></a>
                </div>
              )
            }
          </form>
        )
      }

      {/* Thank you message */}
      {
        showThanksMessage && 
          <div style={{ padding: 30 }}>
            <p style={{ margin: 10, textAlign: 'center' }}>{thanksMessage}</p>
          </div>
      }

      {/* Error message */}
      {
        showErrorMessage && (
          <div style={{ padding: 30 }}>
            <p style={{ margin: 10, textAlign: 'center' }}>Something went wrong.</p>
          </div>
        )
      }
    </div>
  )
}

export default MailberryFormSnippet;