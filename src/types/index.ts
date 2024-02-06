export type FieldType = {
  required: boolean;
  type: React.HTMLInputTypeAttribute;
  label: string;
  value: string;
}

export type Style = {
  pageColor?: string;
  formColor?: string;
}

export type CSSProps = {
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

export const formPopupOptions = {
  IMMEDIATELY: "immediately",
  AFTER_10_SECONDS: "after-10-seconds",
  AFTER_30_SECONDS: "after-30-seconds",
  AT_30_PERCENT_OF_PAGEVIEW: "at-30-percent-of-pageview"
}

export const formFormat = {
  SNIPPET: 'snippet',
  POPUP: 'popup',
}

export type FormatOptions = keyof typeof formFormat;
export type FormPopupOptions = keyof typeof formPopupOptions;
