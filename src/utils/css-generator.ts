import { CSSProps } from "../types"

export const css = function({ headStyle, labelStyle, btnStyle, mainStyle, descriptionThanksMessageAndSignStyle }: CSSProps){
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