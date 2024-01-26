import React, { useState, useEffect } from 'react';

// Enums for FORMAT and FORM_POPUP_OPTIONS
enum FORMAT {
  Snippet = "snippet",
  Popup = "popup",
  Page = "page",
}

enum FORM_POPUP_OPTIONS {
  Immediately = "immediately",
  After10Seconds = "after-10-seconds",
  After30Seconds = "after-30-seconds",
  At30PercentOfPageview = "at-30-percent-of-pageview",
}

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

interface Style {
  mainStyle: {
    pageColor?: string; // Add other style properties as needed
  };
}

interface MailberryFormProps {
  formId: string;
  fields: Field[];
  text: Text;
  href: string;
  style: Style;
  signature?: boolean;
  format: FORMAT;
  showAt?: FORM_POPUP_OPTIONS;
}

const MailberryForm: React.FC<MailberryFormProps> = ({ formId, fields, text, href, style, signature, format, showAt }) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showThanksMessage, setShowThanksMessage] = useState<boolean>(false);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

  useEffect(() => {
    // Logic to determine when to show the form based on `format` and `showAt`
    // Similar to the existing JavaScript logic
  }, [format, showAt]);

  const handleInputChange = (label: string, value: string) => {
    setFormData(prev => ({ ...prev, [label.toLowerCase()]: value }));
  };

  const validateField = (field: Field, value: string): boolean => {
    if (field.required && !value) return false;
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    let isValid = true;
    for (const field of fields) {
      const value = formData[field.label.toLowerCase()];
      if (!validateField(field, value)) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      try {
        const response = await fetch(href, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          setShowThanksMessage(true);
        } else {
          setShowErrorMessage(true);
        }
      } catch (error) {
        setShowErrorMessage(true);
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className={`mailberry-form mailberry-${format}`} style={{ display: showForm ? 'block' : 'none' }}>
      <form onSubmit={handleSubmit}>
        {
        fields.map((field, index) => (
          <div key={index} className="MBinput-wrapper">
            <label className="MBlabel">
              {field.label}{field.required && '*'}
            </label>
            <input
              type={field.type}
              name={field.label}
              required={field.required}
              className="MBinput"
              value={formData[field.label.toLowerCase()] || ''}
              onChange={(e) => handleInputChange(field.label, e.target.value)}
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

      {/* Optional: Loader while submitting */}
      {isSubmitting && (
        <div className="MBspinner-wrapper">
          <div className="MBspinner"></div>
          {/* You can add a spinner icon or animation here */}
        </div>
      )}

      {/* Optional: Success and Error Messages */}
      {showThanksMessage && (
        <div className="MBthank-you-wrapper">
          <p className="MBthank-you-message">{text.thanksMessage}</p>
        </div>
      )}
      {showErrorMessage && (
        <div className="MBerror-wrapper">
          <p className="MBerror-message">
            Something went wrong.
          </p>
        </div>
      )}
      </form>
    </div>
  );
};

export default MailberryForm;