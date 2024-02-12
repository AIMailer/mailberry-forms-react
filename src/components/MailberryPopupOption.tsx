import React, { useContext, useEffect, useRef, useState } from "react";
import { FormPopupOptions, formPopupOptions } from "../types";
import { getSubscriptionFromLocalStorage } from "../utils/localStorage";
import { FormContext } from "./MailberryForm";

type MailberryFormPopupProps = {
  href: string;
  signature: boolean;
  thanksMessage: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  showAt: FormPopupOptions;
  formId: string;
  formContainerStyles: React.CSSProperties;
  children: React.ReactNode;
}

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
  animation: 'MBopacity-in 0.4s linear'
}

const MailberryFormPopup = ({ href, signature, thanksMessage, formContainerStyles, handleSubmit, showAt, formId, children }: MailberryFormPopupProps) => {
  const { isSubmitted, isSubmitting, showErrorMessage, showThanksMessage } = useContext(FormContext);
  const [showOverlay, setShowOverlay] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);

  const checkScrollPosition = () => {
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
  };

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
  };

  // Dismiss overlay when click outside the form
  useEffect(() => {
    document.addEventListener("mousedown", handleDismissOverlayWhenClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleDismissOverlayWhenClickOutside);
    };
  }, []);

  // Set popup option
  useEffect(() => {
    if(showAt === formPopupOptions.AT_30_PERCENT_OF_PAGEVIEW){
      window.addEventListener('scroll', checkScrollPosition);

      return
    }else {
      let timer = 0;
      
      if(showAt === formPopupOptions.IMMEDIATELY) timer = 0;
      if(showAt === formPopupOptions.AFTER_10_SECONDS) timer = 10;
      if(showAt === formPopupOptions.AFTER_30_SECONDS) timer = 30;

      const alreadySubscribed = getSubscriptionFromLocalStorage(formId);
      if(alreadySubscribed) return;

      const lastClosed = localStorage.getItem(`closed_${formId}`);

      if(!lastClosed|| Date.now() > parseInt(lastClosed) + 2592000000 ){

        setTimeout(() => {
          setShowOverlay(true);
  
          // Send a request to register that the form was viewed
          fetch(href)
        }, timer * 1000);
      };
    };
  }, []);

  return (
    <div className="MBoverlay" style={{ display: showOverlay ? 'block' : 'none', cursor: 'pointer', width: '100%', height: '100%', minWidth: '100%', minHeight: '100%', position: 'fixed', left: 0, top: 0, backgroundColor: 'rgba(0, 1, 5, 0.8)' }}>
      <div ref={formContainerRef} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', cursor: 'auto' }}>
        <div className='MBform-container' style={{ ...defaultFormContainerStyles, ...formContainerStyles }}>
          {/* Spinner */}
          {
            isSubmitting && (
              <div style={{ width: 400, padding: '30px 30px 10px 30px', boxSizing: 'border-box', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: 30 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: '4px solid #ccc', borderTopColor: '#999999', animation: 'MBspin-animation 1s linear infinite' }} />
              </div>
            )
          }
          {/* Form */}
          {
            isSubmitting || !isSubmitted && (
              <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
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
              <div style={{ paddingBottom: 30 }}>
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