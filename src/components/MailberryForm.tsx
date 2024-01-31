import React, { useState, useEffect } from 'react';

interface Field {
  label: string;
  type: 'text' | 'email' | 'number'; // Add more types as needed
  required: boolean;
}

interface Text {
  header?: string;
  description?: string;
  thanksMessage: string;
  button: string;
}

type Style = {
  pageColor?: string;
  formColor?: string;
}

interface MailberryFormProps {
  formId: string;
  fields: Field[];
  text: Text;
  href: string;
  style: CSSProps;
  signature?: boolean;
  format: 'snippet' | 'popup';
  showAt?: 'immediately' | 'after-10-seconds' | 'after-30-seconds' | 'at-30-percent-of-pageview';
}

type CSSProps = {
  headStyle: {
    fontSize: number;
    fontFamily: string;
    color: string;
  };
  labelStyle: {
    fontSize: number;
    fontFamily: string;
    color: string;
  };
  btnStyle: {
    fontSize: number;
    fontFamily: string;
    color: string;
    backgroundColor: string;
  };
  mainStyle: Style;
  descriptionThanksMessageAndSignStyle: {
    fontSize: number;
    fontFamily: string;
    color: string;
  };
}

const css = function({ headStyle, labelStyle, btnStyle, mainStyle, descriptionThanksMessageAndSignStyle }: CSSProps){
  return `
.MBheading {
  margin-top: 20px;
  margin-bottom: 20px;
  max-width: 400px;
  line-break: auto;
  text-align: center;
  font-size: ${headStyle.fontSize}px;
  font-family: ${headStyle.fontFamily};
  color: ${headStyle.color};
}

.MBdescription {
  line-height: 1.5;
  margin: 0;
  font-size: ${descriptionThanksMessageAndSignStyle.fontSize}px;
  font-family: ${descriptionThanksMessageAndSignStyle.fontFamily};
  color: ${descriptionThanksMessageAndSignStyle.color};
}

.MBdivider {
  padding: 1px 1px;
  border: none;
  margin: 1em 0;
  background-color: #ccc;
  cursor: auto;
}

.MBform-container {
  width: 400px;
  border-radius: 12px;
  background-color: ${mainStyle.formColor};
}

.MBform-builder-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  box-sizing: border-box;
  border-radius: 5px;
}

.MBform-builder-format-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
}

.MBform-builder-format-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}

.MBform-wrapper {
  width: 400px;
  padding-top: 30px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 10px;
  box-sizing: border-box;
}

.MBthank-you-wrapper {
  display: none;
  padding-bottom: 20px;
}

.MBthank-you-message {
  margin: 10px;
  text-align: center;
  font-size: ${descriptionThanksMessageAndSignStyle.fontSize}px;
  font-family: ${descriptionThanksMessageAndSignStyle.fontFamily};
  color: ${descriptionThanksMessageAndSignStyle.color};
}

.MBerror-wrapper {
  display: none;
  padding-bottom: 20px;
}

.MBerror-message {
  margin: 10px;
  text-align: center;
  font-size: ${descriptionThanksMessageAndSignStyle.fontSize}px;
  font-family: ${descriptionThanksMessageAndSignStyle.fontFamily};
  color: ${descriptionThanksMessageAndSignStyle.color};
}

.MBinput-wrapper {
  display: flex;
  flex-direction: column;
}

.MBinput {
  padding: 11px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 5px;
}

.MBbtn-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.MBbtn {
  padding: 8px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: ${btnStyle.fontSize}px;
  font-family: ${btnStyle.fontFamily};
  color: ${btnStyle.color};
  background-color: ${btnStyle.backgroundColor};
}

.MBsignature-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.MBpowered-by {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 8px;
  color: ${descriptionThanksMessageAndSignStyle.color || 'black'};
}

.MBsignature {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 8px;
  margin-left: 2px;
  text-decoration-color: ${descriptionThanksMessageAndSignStyle.color};
  color: ${descriptionThanksMessageAndSignStyle.color || 'black'};
}

.MBclose-btn {
  margin: 20px 0;
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 20px;
  font-family: Arial, Helvetica, sans-serif;
  cursor: pointer;
  color: ${descriptionThanksMessageAndSignStyle.color || 'black'};
}

.MBspinner-wrapper {
  display: none;
  justify-content: center;
  items-content: center;
  padding-bottom: 30px;
}

.MBspinner {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 4px solid #cccccc;
  border-top-color: #999999;
  animation: MBspin-animation 1s linear infinite;
}

.MBoverlay {
  width: 100% !important;
  height: 100% !important;
  min-width: 100%;
  min-height: 100%;
  position: fixed !important;
  left: 0 !important;
  top: 0 !important;
  background-color: rgba(0, 1, 5, 0.8);
}

.MBlabel {
  font-size: ${labelStyle.fontSize}px;
  font-family: ${labelStyle.fontFamily};
  color: ${labelStyle.color};
}

@keyframes MBspin-animation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes MBopacity-in {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
}

@keyframes MBopacity-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.2;
  }
}
`}

const MailberryForm: React.FC<MailberryFormProps> = ({ formId, fields, text, href, style, signature = true, format, showAt }) => {
  const formContainerRef = React.useRef<HTMLDivElement>(null);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showThanksMessage, setShowThanksMessage] = useState<boolean>(false);
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
  const [emptyFields, setEmptyFields] = useState<boolean>(false);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

  // Show overlay when scroll position is at 30% of the pageview
  function checkScrollPosition() {
    const percent = 0.3;
    const scrollY = window.scrollY;
    const fullHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const thirtyPercentOfPageview = fullHeight * percent;

    if (scrollY + windowHeight >= thirtyPercentOfPageview) {
      !showOverlay && setShowOverlay(true)
    }

    window.removeEventListener('scroll', checkScrollPosition);
    return
  }

  // Dismiss overlay when click outside the form, only usefull for popup format
  const handleDismissOverlayWhenClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (formContainerRef.current && !formContainerRef.current.contains(target)) {
      setShowOverlay(false);
    }
  };

  // Dismiss overlay when is displayed, only usefull for popup format
  const handleDismissOverlay = () => {
    setShowOverlay(false);

    const alreadySubscribed=localStorage.getItem(`subscribed_${formId}`);
    if(!alreadySubscribed){
      localStorage.setItem(`closed_${formId}`, Date.now().toString());
    }
  }

  // Inject CSS
  useEffect(() => {
    if(document.getElementById('mailberry-form-styles')) return

    var styleTag = document.createElement('style');
    styleTag.innerHTML = css(style);
    styleTag.setAttribute('id', 'mailberry-form-styles');
    document.getElementsByTagName('head')[0].appendChild(styleTag);
  }, [])

  // Snippet logic
  useEffect(() => {
    if(format === 'snippet'){
      fetch(href);
    }
  }, [])

  // Popup logic
  useEffect(() => {
    const alreadySubscribed=localStorage.getItem(`subscribed_${formId}`)
    if(alreadySubscribed) return

    // should add localstorage to check if user has already seen the popup
    if(format === 'popup' && !showOverlay) {
      const lastClosed = localStorage.getItem(`subscribed_${formId}`)

      //30 days in miliseconds 2592000000
      if(!lastClosed|| Date.now()>parseInt(lastClosed) +2592000000 ){

        if(showAt === 'at-30-percent-of-pageview'){
          window.addEventListener('scroll', checkScrollPosition);

          return
        } else {
          let timer = 0;
  
          if(showAt === 'immediately') timer = 0;
          if(showAt === 'after-10-seconds') timer = 10;
          if(showAt === 'after-30-seconds') timer = 30;
  
          setTimeout(() => {
            setShowOverlay(true);  

            // Register a visit to the form
            fetch(href);
          }, timer * 1000);
  
          return
        }
      }

      setShowOverlay(true)
    }
  }, [])

  // Popup logic
  useEffect(() => {
    if(!(format === 'popup')) return

    document.addEventListener("mousedown", handleDismissOverlayWhenClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleDismissOverlayWhenClickOutside);
    };
  }, []);
  
  const handleInputChange = (label: string, value: string) => {
    setFormData(prev => ({ ...prev, [label.toLowerCase()]: value }));
  };

  const validateField = (field: Field, value: string): boolean => {
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

    let isValid = true;
    for (const field of fields) {
      const value = formData[field.label.toLowerCase()];
      if (!validateField(field, value) || emptyFields || invalidEmail) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      setIsSubmitting(true);

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
      }
    }

    setIsSubmitting(false);
  };

  return format === 'snippet' ? (
    <div className='MBform-container'>
      <div className='MBform-wrapper MBspinner-wrapper' style={{ display: isSubmitting ? 'flex' : 'none' }}>
        <div className='MBspinner'></div>
      </div>
      <div className='MBform-wrapper' style={{ display: isSubmitted || isSubmitting ? 'none' : 'block' }}>
        {/* Header */}
        {text.header && <p className='MBheading'>{text.header}</p>}

        {/* Description */}
        {text.description && <p className='MBdescription'>{text.description}</p>}
        {text.description && <hr className='MBdivider' />}

        {
          (invalidEmail || emptyFields) && (
            <ul style={{color: "red", fontSize: "14px", fontFamily: "Arial", "paddingLeft": 0}}>
              {invalidEmail && <li style={{ listStyle: 'none' }}>Please enter a valid email address</li>}
              {emptyFields && <li style={{ listStyle: 'none' }}>Please fill in all required fields</li>}
            </ul>
          )
        }
        {/* Form */}
        <form onSubmit={handleSubmit}>
          {
            fields.map((field, index) => (
              <div key={index} className="MBinput-wrapper">
                <label htmlFor={`mailberry-${field.label}-${index}`} className="MBlabel">
                  {field.label}{field.required && '*'}
                </label>
                <input
                  id={`mailberry-${field.label}-${index}`}
                  type={field.type}
                  name={field.label}
                  required={field.required}
                  className="MBinput"
                  value={formData[field.label.toLowerCase()] || ''}
                  onChange={(e) => handleInputChange(field.label, e.target.value)}
                  autoComplete='off'
                />
              </div>
            ))
          }
          {/* Submit Button */}
          <div className="MBbtn-wrapper">
            <button type="submit" className="MBbtn" disabled={isSubmitting}>
              {text.button}
            </button>
          </div>
        </form>

        {/* Signature */}
        {
          signature && (
            <div className='MBsignature-wrapper'>
              <p className='MBpowered-by'>Powered by</p>
              <a href={href} target='_blank' rel='noopener noreferrer'><p className='MBsignature'>MailBerry</p></a>
            </div>
          )
        }
      </div>
      <div className='MBform-wrapper MBthank-you-wrapper' style={{ display: showThanksMessage ? 'block' : 'none' }}>
        <p className='MBthank-you-message'>{text.thanksMessage}</p>
      </div>
      <div className='MBform-wrapper MBerror-wrapper' style={{ display: showErrorMessage ? 'block' : 'none' }}>
        <p className='MBerror-message'>Something went wrong.</p>
      </div>
    </div>
  ) : (
    (format === 'popup' && showOverlay ? <div className='MBoverlay' style={{ zIndex: 99999, cursor: 'pointer' }}>
      <div ref={formContainerRef} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', cursor: 'auto' }}>
        <div className='MBform-container' style={{ animation: 'MBopacity-in 0.4s linear' }}>
          <div className='MBform-wrapper MBspinner-wrapper' style={{ display: isSubmitting ? 'flex' : 'none' }}>
            <div className='MBspinner'></div>
          </div>
          <p className='MBclose-btn' onClick={() => handleDismissOverlay()}>X</p>
          <div className='MBform-wrapper' style={{ display: isSubmitted || isSubmitting ? 'none' : 'block' }}>
            {/* Header */}
            {text.header && <p className='MBheading'>{text.header}</p>}

            {/* Description */}
            {text.description && <p className='MBdescription'>{text.description}</p>}
            {text.description && <hr className='MBdivider' />}

            {
              (invalidEmail || emptyFields) && (
                <ul style={{color: "red", fontSize: "14px", fontFamily: "Arial", "paddingLeft": 0}}>
                  {invalidEmail && <li style={{ listStyle: 'none' }}>Please enter a valid email address</li>}
                  {emptyFields && <li style={{ listStyle: 'none' }}>Please fill in all required fields</li>}
                </ul>
              )
            }
            {/* Form */}
            <form onSubmit={handleSubmit}>
              {
                fields.map((field, index) => (
                  <div key={index} className="MBinput-wrapper">
                    <label htmlFor={`mailberry-${field.label}-${index}`} className="MBlabel">
                      {field.label}{field.required && '*'}
                    </label>
                    <input
                      id={`mailberry-${field.label}-${index}`}
                      type={field.type}
                      name={field.label}
                      required={field.required}
                      className="MBinput"
                      value={formData[field.label.toLowerCase()] || ''}
                      onChange={(e) => handleInputChange(field.label, e.target.value)}
                      autoComplete='off'
                    />
                  </div>
                ))
              }
              {/* Submit Button */}
              <div className="MBbtn-wrapper">
                <button type="submit" className="MBbtn" disabled={isSubmitting}>
                  {text.button}
                </button>
              </div>
            </form>

            {/* Signature */}
            {
              signature && (
                <div className='MBsignature-wrapper'>
                  <p className='MBpowered-by'>Powered by</p>
                  <a href={href} target='_blank' rel='noopener noreferrer'><p className='MBsignature'>MailBerry</p></a>
                </div>
              )
            }
          </div>
          <div className='MBform-wrapper MBthank-you-wrapper' style={{ display: showThanksMessage ? 'block' : 'none' }}>
            <p className='MBthank-you-message'>{text.thanksMessage}</p>
          </div>
          <div className='MBform-wrapper MBerror-wrapper' style={{ display: showErrorMessage ? 'block' : 'none' }}>
            <p className='MBerror-message'>Something went wrong.</p>
          </div>
        </div>
      </div>
    </div> : null)
  )
};

export default MailberryForm;