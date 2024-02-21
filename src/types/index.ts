export type FieldType = {
  required: boolean;
  type: React.HTMLInputTypeAttribute;
  label: string;
  value: string;
}

export type MailberryStyle = {
  pageColor?: string;
  formColor?: string;
}

export type MailberryFormCSSProps = {
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
  mainStyle: MailberryStyle;
  descriptionThanksMessageAndSignStyle: {
    fontSize: number;
    fontFamily: string;
    color: string;
  };
}

export const formFormat = {
  SNIPPET: 'SNIPPET' as const,
  POPUP: 'POPUP' as const,
}

export const popUpFormOptions = {
  SCROLL: 'SCROLL' as const,
  TIME: 'TIME' as const,
}

type PopupFormType = keyof typeof popUpFormOptions;

export type PopUpFormShowAt = {
  type: PopupFormType;
  value: number;
}


export type FormatOptions = keyof typeof formFormat;