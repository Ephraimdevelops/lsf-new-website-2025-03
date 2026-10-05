export function allowsCasePushToBeneficiary(method: string | undefined) {
  // A general push preference is not permission to reveal a legal-aid matter
  // outside the app when the beneficiary chose a private contact route.
  return method === "phone" || method === "sms" || method === "email";
}
