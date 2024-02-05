type FieldType = {
  required: boolean;
  type: React.HTMLInputTypeAttribute;
  label: string;
  value: string;
}

type Style = {
  pageColor?: string;
  formColor?: string;
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