export const requestLabels: Record<string, { sw: string; en: string }> = {
  draft: { sw: 'Ombi halijatumwa', en: 'Draft' }, submitted: { sw: 'Ombi limepokelewa', en: 'Request received' }, under_review: { sw: 'LSF inasoma ombi lako', en: 'Under review' }, waiting_for_information: { sw: 'LSF inasubiri jibu lako', en: 'More information needed' }, converted_to_case: { sw: 'Kesi imefunguliwa', en: 'Case opened' }, information_only: { sw: 'Taarifa zimetolewa', en: 'Information provided' }, referred: { sw: 'Limeelekezwa', en: 'Referred' }, withdrawn: { sw: 'Umeondoa ombi', en: 'Withdrawn' }, closed: { sw: 'Limefungwa', en: 'Closed' },
};
export function requestNextStep(status: string, locale: 'sw' | 'en') {
  const sw = locale === 'sw';
  const messages: Record<string, string> = {
    draft: sw ? 'Ombi halijatumwa. Endelea kulijaza na ulitume ukiwa tayari.' : 'Not sent. Finish the request and send it when ready.',
    submitted: sw ? 'LSF itaanza kukagua ombi lako. Taarifa mpya zitaonekana hapa.' : 'LSF will begin reviewing your request. Updates will appear here.',
    under_review: sw ? 'LSF inakagua ombi lako. Unaweza kutuma maelezo zaidi hapa chini yakihitajika.' : 'LSF is reviewing your request. Add details below if needed.',
    waiting_for_information: sw ? 'LSF imekuuliza swali. Lisome hapa chini, kisha tuma jibu lako.' : 'LSF has asked a question. Read it below, then send your reply.',
    converted_to_case: sw ? 'Kesi imefunguliwa. Ifungue kuona ujumbe na hatua inayofuata.' : 'Your case is open. View its messages and next step.',
    information_only: sw ? 'Taarifa zimetolewa. Wasiliana na LSF ukihitaji ufafanuzi au uanze ombi jipya.' : 'Information has been provided. Contact LSF for clarification or start a new request.',
    referred: sw ? 'Ombi limeelekezwa kwa huduma nyingine. Angalia ujumbe wa LSF kwa hatua inayofuata.' : 'Your request was referred to another service. Check the LSF messages for the next step.',
    withdrawn: sw ? 'Umeondoa ombi hili. LSF haitalishughulikia zaidi.' : 'You withdrew this request. LSF will no longer process it.',
    closed: sw ? 'Ombi hili limefungwa. Unaweza kuomba msaada tena ukiuhitaji.' : 'This request is closed. You can ask for help again if needed.',
  };
  return messages[status] ?? (sw ? 'Angalia taarifa mpya hapa au wasiliana na LSF.' : 'Check for updates here or contact LSF.');
}
// Show reached stages, not a promised assignment journey. Waiting for information is optional.
export function requestReachedStages(status: string): string[] {
  if (status === 'draft') return ['draft'];
  if (status === 'submitted') return ['submitted'];
  if (status === 'under_review') return ['submitted', 'under_review'];
  if (status === 'waiting_for_information') return ['submitted', 'under_review', 'waiting_for_information'];
  if (['converted_to_case', 'information_only', 'referred', 'closed'].includes(status)) return ['submitted', 'under_review', status];
  if (status === 'withdrawn') return ['submitted', 'withdrawn'];
  return [];
}
