import { useContext, useEffect } from "react";
import { FormContext } from "./";

type MailberrySnippetProps = {
  href: string;
  signature: boolean;
  thanksMessage: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
}

export const MailberryFormSnippet: React.FC<MailberrySnippetProps> = ({ href, signature, thanksMessage, handleSubmit, children }) => {
  const { isSubmitted, isSubmitting, emptyFields, invalidEmail, showErrorMessage, showThanksMessage } = useContext(FormContext);

  // Every time this component is rendered, we send a request to register that the form was viewed
  useEffect(() => {
    fetch(href)
  }, []);

  return (
    <div className='MBform-container'>
      {/* Spinner */}
      {
        isSubmitting && (
          <div className='MBform-wrapper MBspinner-wrapper' style={{ display: 'flex', justifyContent: 'center' }}>
            <div className='MBspinner'></div>
          </div>
        ) 
      }

      {/* Form */}
      {
        isSubmitting || !isSubmitted && (
          <form onSubmit={handleSubmit} className='MBform-wrapper'>
            {
              (invalidEmail || emptyFields) && (
                <ul style={{color: "red", fontSize: "14px", fontFamily: "Arial", "paddingLeft": 0}}>
                  {invalidEmail && <li style={{ listStyle: 'none' }}>Please enter a valid email address</li>}
                  {emptyFields && <li style={{ listStyle: 'none' }}>Please fill in all required fields</li>}
                </ul>
              )
            }

            {children}
            {
              signature && (
                <div className='MBsignature-wrapper'>
                  <p className='MBpowered-by'>Powered by</p>
                  <a href={href} target='_blank' rel='noopener noreferrer'><p className='MBsignature'>MailBerry</p></a>
                </div>
              )
            }
          </form>
        )
      }

      {/* Thank you message */}
      {
        showThanksMessage && 
          <div className='MBform-wrapper MBthank-you-wrapper' style={{ display: 'block', paddingBottom: 30 }}>
            <p className='MBthank-you-message'>{thanksMessage}</p>
          </div>
      }

      {/* Error message */}
      {
        showErrorMessage && (
          <div className='MBform-wrapper MBerror-wrapper' style={{ display: 'block' }}>
            <p className='MBerror-message'>Something went wrong.</p>
          </div>
        )
      }
    </div>
  )
}