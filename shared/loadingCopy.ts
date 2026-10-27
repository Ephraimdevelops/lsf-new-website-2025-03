/** Loading messages describe real pending work, never simulated progress. */
export const loadingCopy = {
  app: { sw: ['Tunafungua Haki Yangu', 'Tunaandaa ukurasa wako.'], en: ['Opening Haki Yangu', 'Preparing your page.'] },
  account: { sw: ['Tunaunganisha akaunti yako', 'Tunasubiri taarifa za akaunti yako.'], en: ['Connecting your account', 'Waiting for your account details.'] },
  access: { sw: ['Tunaangalia akaunti yako', 'Tunaangalia sehemu unazoweza kufungua.'], en: ['Checking your account', 'Checking which areas you can open.'] },
  cases: { sw: ['Tunafungua kesi zako', 'Tunasubiri taarifa za kesi.'], en: ['Opening your cases', 'Waiting for case details.'] },
  documents: { sw: ['Tunafungua nyaraka', 'Tunasubiri nyaraka.'], en: ['Opening documents', 'Waiting for documents.'] },
  messages: { sw: ['Tunafungua ujumbe', 'Tunasubiri mazungumzo yako.'], en: ['Opening messages', 'Waiting for your conversations.'] },
  services: { sw: ['Tunatafuta huduma', 'Tunasubiri orodha ya huduma.'], en: ['Finding services', 'Waiting for the service list.'] },
  work: { sw: ['Tunafungua kazi zako', 'Tunasubiri kazi na taarifa mpya.'], en: ['Opening your work', 'Waiting for tasks and updates.'] },
  content: { sw: ['Tunaleta taarifa', 'Tunasubiri taarifa za ukurasa huu.'], en: ['Loading information', 'Waiting for this page’s information.'] },
  search: { sw: ['Tunatafuta', 'Tunasubiri matokeo ya utafutaji.'], en: ['Searching', 'Waiting for search results.'] },
  save: { sw: ['Tunahifadhi mabadiliko', 'Tunasubiri uthibitisho kuwa yamehifadhiwa.'], en: ['Saving changes', 'Waiting for confirmation that your changes were saved.'] },
  upload: { sw: ['Tunapakia faili yako', 'Subiri upakiaji ukamilike kabla ya kufunga ukurasa.'], en: ['Uploading your file', 'Wait for the upload to finish before closing this page.'] },
} as const;
export type LoadingTask = keyof typeof loadingCopy;
export function getLoadingCopy(task: LoadingTask = 'content', locale: 'sw' | 'en' = 'sw') { const [title, detail] = loadingCopy[task][locale]; return { title, detail }; }
export function loadingTaskForText(text: string): LoadingTask {
 if (/account|akaunti|secure|sign.in|kuingia/i.test(text)) return 'account';
 if (/access|permission|ruhusa|verifying/i.test(text)) return 'access';
 if (/case|kesi/i.test(text)) return 'cases';
 if (/document|nyaraka|hati/i.test(text)) return 'documents';
 if (/message|conversation|ujumbe|mazungumzo/i.test(text)) return 'messages';
 if (/search|tafuta/i.test(text)) return 'search';
 if (/service|huduma|paralegal|wasaidizi/i.test(text)) return 'services';
 if (/work|task|kazi/i.test(text)) return 'work';
 return 'content';
}
export const isGenericLoading = (text?: string) => !text || /^(loading|inapakia|loading information|tunaleta taarifa)[. …!]*$/i.test(text.trim());

/** Localize legacy English-only loading labels while retaining their real subject. */
export function loadingLabel(text: string | undefined, task: LoadingTask, locale: 'sw' | 'en') {
 const copy = getLoadingCopy(task, locale);
 if (isGenericLoading(text)) return copy.title;
 if (locale === 'en' || !/^(loading|verifying|connecting|preparing|searching)\b/i.test(text!)) return text!;
 const subjects: [RegExp,string][] = [
  [/invitations/i,'mialiko'], [/partner activity/i,'shughuli za taasisi'], [/publication/i,'chapisho'], [/opportunity/i,'nafasi'],
  [/tasks|work/i,'kazi zako'], [/requests/i,'maombi'], [/progress/i,'hatua ulizofikia'], [/paralegal/i,'wasaidizi wa kisheria'],
  [/risk events/i,'matukio yanayohitaji uangalizi'], [/journey counts|response measures|metrics|statistics|report/i,'takwimu'],
  [/research/i,'taarifa za utafiti'], [/official websites/i,'tovuti rasmi'], [/settings/i,'mipangilio'],
  [/appointment/i,'miadi'], [/referral/i,'maombi ya huduma nyingine'], [/notification|updates/i,'taarifa mpya'],
  [/guide/i,'miongozo'], [/people|users|members/i,'orodha ya watu'], [/history|audit/i,'historia'],
 ];
 const subject=subjects.find(([pattern])=>pattern.test(text!));
 return subject ? `Tunaleta ${subject[1]}…` : copy.title;
}

export function isLoadingLabel(text: unknown): text is string { return typeof text === 'string' && /^(loading\b|inapakia\b|tunapakia\b|tunapakua\b|verifying access|connecting your account|preparing your account|tunasubiri akaunti|tunaunganisha|akaunti inaandaliwa|tunafungua|tunaandaa)/i.test(text.trim()); }
