export type ReplyLanguage = "auto" | "en" | "sw";
type Locale = "en" | "sw";

const requestPattern = /\b(?:answer|reply|respond|speak|talk|continue|write|explain|switch|use)(?:\s+to\s+me)?\s+(?:(?:in|to|using)\s+)?(english|kiswahili|swahili|kiingereza)\b|\b(?:jibu|nijibu|unijibu|tuongee|ongea|tumia|eleza|nielezee|endelea|badili|badilisha)\s+(?:kwa\s+)?(english|kiswahili|swahili|kiingereza)\b|\b(english|kiswahili|swahili|kiingereza)\s+(?:please|tafadhali)\b/gi;
const languageCode = (name: string): Locale => /^(english|kiingereza)$/i.test(name) ? "en" : "sw";

export function explicitResponseLocale(message: string): Locale | undefined {
  const short = message.trim().replace(/[.!?]+$/g, "");
  if (/^(?:english|kiswahili|swahili|kiingereza)$/i.test(short)) return languageCode(short);
  const matches = [...message.matchAll(new RegExp(requestPattern))];
  const last = matches.at(-1);
  return last ? languageCode(last[1] ?? last[2] ?? last[3]) : undefined;
}

export function withoutLanguageRequest(message: string) {
  return message.replace(new RegExp(requestPattern), "").replace(/\b(?:please|tafadhali)\b/gi, "")
    .replace(/[.!?,;]+/g, " ").trim().replace(/\s+/g, " ");
}

export function detectMessageLocale(message: string): Locale | undefined {
  const text = message.toLowerCase().trim();
  if (/^(?:yes|no|ok|okay|sawa|ndiyo|hapana|thanks|thank you|asante)[.!?\s]*$/.test(text)) return undefined;
  const words = text.match(/[a-z]+/g) ?? [];
  const sw = new Set("habari hujambo mambo shikamoo mimi sisi yangu zangu haki nini wapi lini vipi msaada kisheria nahitaji naomba nisaidie tafadhali kwa lugha kiswahili niko nipo wilaya mkoa mpangaji kodi mshahara sijalipwa mwajiri kazi nimefukuzwa mwenye nyumba sijui nifanye nawezaje kuanza hapa nataka kuelewa nijibu tuongee".split(" "));
  const en = new Set("hello hi hey i my me we our the am in with for and to of a an is are was were have has help please need want what how where when can could tenant landlord rent salary wages employer eviction fired unpaid understand rights legal find support near live work english".split(" "));
  let swScore = 0, enScore = 0;
  for (const word of words) {
    if (sw.has(word) || /^(?:nime|sija|nili|nina|ame|ana|hatu|tume|tuna)[a-z]{3,}/.test(word)) swScore++;
    if (/^(?:niko|nipo|nisaidie|naomba|nahitaji|sijalipwa)$/.test(word)) swScore++;
    if (en.has(word)) enScore++;
  }
  if (/^(?:habari|hujambo|mambo|shikamoo)\b/.test(text)) swScore += 2;
  if (/^(?:hello|hi|hey|help)\b/.test(text)) enScore += 2;
  return swScore >= 2 && swScore > enScore ? "sw" : enScore >= 2 && enScore > swScore ? "en" : undefined;
}

export function responseLocale(
  message: string,
  interfaceLocale?: Locale,
  previousUserTexts: string[] = [],
  preference: ReplyLanguage = "auto",
): Locale {
  const requested = explicitResponseLocale(message);
  if (requested) return requested;
  if (preference !== "auto") return preference;
  for (const previous of [...previousUserTexts].reverse()) {
    const remembered = explicitResponseLocale(previous);
    if (remembered) return remembered;
  }
  const detected = detectMessageLocale(message);
  if (detected) return detected;
  for (const previous of [...previousUserTexts].reverse()) {
    const prior = detectMessageLocale(previous);
    if (prior) return prior;
  }
  return interfaceLocale ?? "sw";
}
