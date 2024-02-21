const MAILBERRY_SUBSCRIBED_KEY = 'mailberry_subscribed';
const MAILBERRY_CLOSED_KEY = 'mailberry_closed';

const generateMailberrySubscribedKey = (formId: string) => {
  return `${MAILBERRY_SUBSCRIBED_KEY}_${formId}`;
}

const generateMailberryClosedKey = (formId: string) => {
  return `${MAILBERRY_CLOSED_KEY}_${formId}`;
}

export const getSubscriptionFromLocalStorage = (formId: string) => {
  return window.localStorage.getItem(generateMailberrySubscribedKey(formId));
}

export const setSubscriptionToLocalStorage = (formId: string) => {
  window.localStorage.setItem(generateMailberrySubscribedKey(formId), Date.now().toString());
  return;
}

export const removeSubscriptionFromLocalStorage = (formId: string) => {
  window.localStorage.removeItem(generateMailberrySubscribedKey(formId));
  return;
}

export const getClosedFormFromLocalStorage = (formId: string) => {
  return window.localStorage.getItem(generateMailberryClosedKey(formId));
}

export const setClosedFormToLocalStorage = (formId: string) => {
  window.localStorage.setItem(generateMailberryClosedKey(formId), Date.now().toString());
  return;
}

export const removeClosedFormFromLocalStorage = (formId: string) => {
  window.localStorage.removeItem(generateMailberryClosedKey(formId));
  return;
}