
export const getSubscriptionFromLocalStorage = (formId: string) => {
  const subscription = window.localStorage.getItem(`subscribed_${formId}`);

  if (subscription) return subscription;

  return null;
}