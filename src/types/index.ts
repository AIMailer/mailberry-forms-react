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
  IMMEDIATELY: "IMMEDIATELY",
  AFTER_10_SECONDS: "AFTER_10_SECONDS",
  AFTER_30_SECONDS: "AFTER_30_SECONDS",
  AT_30_PERCENT_OF_PAGEVIEW: "AT_30_PERCENT_OF_PAGEVIEW"
}

export const formFormat = {
  SNIPPET: 'SNIPPET',
  POPUP: 'POPUP',
}

export type FormatOptions = keyof typeof formFormat;
export type FormPopupOptions = keyof typeof formPopupOptions;
