import React, { useContext, useEffect, useRef, useState } from "react";
import { PopUpFormShowAt, popUpFormOptions } from "../types";
import { getClosedFormFromLocalStorage, getSubscriptionFromLocalStorage, setClosedFormToLocalStorage } from "../utils/localStorage";
import { FormContext } from "./MailberryForm";

type MailberryFormPopupProps = {
  href: string;
  signature: boolean;
  thanksMessage: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formId: string;
  formStyles: {
    container?: React.CSSProperties;
    wrapper?: React.CSSProperties;
    form?: React.CSSProperties;
  };
  children: React.ReactNode;
  showAt?: PopUpFormShowAt;
}

const defaultShowAt: PopUpFormShowAt = { type: popUpFormOptions.TIME, value: 0 };

const defaultCloseButtonStyle: React.CSSProperties = { 
  margin: '20px 0',
  position: 'absolute',
  top: 0,
  right: 25,
  fontSize: 20,
  cursor: 'pointer'
}

const defaultFormContainerStyles: React.CSSProperties = {
  width: 400,
  borderRadius: 12,
  animation: 'MBopacity-in 0.4s linear',
  padding: 30,
  paddingBottom: 10
}

const MailberryFormPopup = ({ href, signature, thanksMessage, formStyles, handleSubmit, formId, showAt = defaultShowAt, children }: MailberryFormPopupProps) => {
  const { isSubmitted, isSubmitting, showErrorMessage, showThanksMessage } = useContext(FormContext);
  const [showOverlay, setShowOverlay] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);

  const checkScrollPosition = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const totalHeight = document.body.scrollHeight;
    const percentage = (scrollPosition / totalHeight) * 100;

    if (percentage >= showAt.value) {
      !showOverlay && setShowOverlay(true)
    }
    return;
  };

  // Dismiss overlay when click outside the form, only usefull for popup format
  const handleDismissOverlayWhenClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (formContainerRef.current && !formContainerRef.current.contains(target)) {
      handleDismissOverlay();
    }
  };

  // Dismiss overlay when is displayed, only usefull for popup format
  const handleDismissOverlay = () => {
    setShowOverlay(false);

    const alreadySubscribed = getSubscriptionFromLocalStorage(formId);
    if(!alreadySubscribed){
      setClosedFormToLocalStorage(formId);
    }
  };

  // Dismiss overlay when click outside the form
  useEffect(() => {
    document.addEventListener("mousedown", handleDismissOverlayWhenClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleDismissOverlayWhenClickOutside);
    };
  }, [handleDismissOverlayWhenClickOutside]);

  // Timer to display the popup
  useEffect(() => {
    if(showAt.type !== popUpFormOptions.TIME || showAt.value < 0) return

    const timer = showAt.value;
    let timeOut: NodeJS.Timeout | null = null;

    const alreadySubscribed = getSubscriptionFromLocalStorage(formId);
    if(alreadySubscribed) return;

    const lastClosed = getClosedFormFromLocalStorage(formId);

    if(!lastClosed || Date.now() > parseInt(lastClosed) + 2592000000){
      timeOut = setTimeout(() => {
        setShowOverlay(true);
        fetch(href);
      }, timer * 1000);
    };
  
    return () => {
      !!timeOut && clearTimeout(timeOut);
    }
  }, [showAt, formId, href])

  // Scroll to display the popup
  useEffect(() => {
    if(showAt.type !== popUpFormOptions.SCROLL || showAt.value < 0) return

    window.addEventListener('scroll', checkScrollPosition);
    
    return () => {
      window.removeEventListener('scroll', checkScrollPosition);  
    }
  }, [showAt, checkScrollPosition])
  
  return (
    <div style={{ display: showOverlay ? 'block' : 'none', cursor: 'pointer', width: '100%', height: '100%', minWidth: '100%', minHeight: '100%', position: 'fixed', left: 0, top: 0, backgroundColor: 'rgba(0, 1, 5, 0.8)' }}>
      <div ref={formContainerRef} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', cursor: 'auto' }}>
        <div style={{ ...defaultFormContainerStyles, ...formStyles.container }}>
          {/* Spinner */}
          {
            isSubmitting && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: '4px solid #ccc', borderTopColor: '#999999', animation: 'MBspin-animation 1s linear infinite' }} />
              </div>
            )
          }
          {/* Form */}
          {
            isSubmitting || !isSubmitted && (
              <form onSubmit={handleSubmit}>
                {/* Revisar descriptionThanksMessageAndSignStyle color */}
                <p onClick={() => handleDismissOverlay()} style={{ ...defaultCloseButtonStyle }}>X</p>
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
              <div style={{ paddingBottom: 20 }}>
                <p style={{ margin: 10, textAlign: 'center' }}>{thanksMessage}</p>
              </div>
          }
          {/* Error message */}
          {
            showErrorMessage && (
              <div style={{ paddingBottom: 20 }}>
                <p style={{ margin: 10, textAlign: 'center' }}>Something went wrong.</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default MailberryFormPopup;
