import { publicHelpResourcesForIssue } from "./publicHelpResources";
import { explicitResponseLocale, withoutLanguageRequest } from "./saadaLanguage";
export { responseLocale } from "./saadaLanguage";

// Only complete, general app-help questions qualify; legal questions still use evidence retrieval.
export function isAppHelpQuestion(message: string) {
  const question = withoutLanguageRequest(message).toLowerCase();
  return /^(?:what can you (?:help me do(?: in (?:this|the) app)?|do)|how (?:can|do) i use (?:this|the) app|what (?:can|does) (?:this|the) app (?:do|help with)|unaweza kunisaidia nini|nawezaje kutumia (?:app|programu) hii)$/.test(question);
}

export function appHelpText(locale?: "en" | "sw") {
  return locale === "en"
    ? "I can help you talk through your situation, look for reviewed guidance or support contacts, and put together a draft request for human help. What would you like help with?"
    : "Naweza kukusaidia kueleza kilichotokea, kutafuta mwongozo uliopitiwa au mawasiliano ya msaada, na kuandaa rasimu ya ombi. Ungependa tuanze na nini?";
}

export function conversationalReply(message: string, locale: "en" | "sw", previousUserTexts: string[] = []): string | undefined {
  const text = withoutLanguageRequest(message).toLowerCase();
  const en = locale === "en";
  // A whole short identity question can tolerate one mistyped character. This
  // cannot consume an appended legal question or other substantive request.
  const identities = ["unaitwa nani", "wewe ni nani", "jina lako ni nani", "what is your name", "who are you"];
  const nearIdentity = identities.some(phrase => {
    if (Math.abs(phrase.length - text.length) > 1) return false;
    let i = 0, j = 0, edits = 0;
    while (i < phrase.length && j < text.length) {
      if (phrase[i] === text[j]) { i++; j++; continue; }
      if (++edits > 1) return false;
      if (phrase.length >= text.length) i++;
      if (text.length >= phrase.length) j++;
    }
    return edits + (phrase.length - i) + (text.length - j) <= 1;
  });
  if (nearIdentity) return conversationalIntentReply("identity", locale, previousUserTexts);
  if (/^(?:what (?:did i (?:say|tell you)|have i told you|were we (?:talking|speaking) about)|do you remember (?:what i said|my (?:question|issue))|nilisema nini|nimekwambia nini|tulikuwa tunaongelea nini|unakumbuka (?:nilichosema|swali langu))$/.test(text)) {
    const recent = previousUserTexts.filter(value => value.trim()).slice(-3);
    return recent.length ? (en ? "You told me:" : "Uliniambia:") + "\n\n" + recent.map(value => "> " + value.slice(0, 700).replace(/\n/g, "\n> ")).join("\n\n") : (en ? "We haven't discussed a situation in this conversation yet. What's on your mind?" : "Bado hatujazungumzia hali yako kwenye mazungumzo haya. Ungependa tuanze na nini?");
  }
  if (/^(?:hello|hi|hey|good morning|good afternoon|good evening|habari(?: yako| za leo| za asubuhi| za mchana| za jioni)?|hujambo|mambo|shikamoo)$/.test(text))
    return en ? "Hello! What would you like help with today?" : "Habari! Ungependa nikusaidie nini leo?";
  if (/^(?:how are you|habari gani|ukoje)$/.test(text))
    return en ? "I'm here and ready to help. What's on your mind?" : "Niko hapa kukusaidia. Ungependa tuzungumzie nini?";
  if (/^(?:thanks|thank you(?: very much| for your help)?|asante(?: sana)?|ahsante(?: sana)?)$/.test(text))
    return en ? "You're welcome. If anything else comes up, just let me know." : "Karibu. Ukihitaji msaada mwingine, niambie.";
  if (/^(?:bye|goodbye|kwaheri|tutaonana)$/.test(text))
    return en ? "Take care. You can come back whenever you need help." : "Kwaheri. Unaweza kurudi wakati wowote ukihitaji msaada.";
  if (/^(?:are you (?:a human|human|a real person)|who are you|what(?:'s| is) your name|tell me about yourself|introduce yourself|wewe ni (?:nani|binadamu)|unaitwa nani|jina lako(?: ni)? nani|jitambulishe|nijulishe kuhusu wewe)$/.test(text))
    return en ? "I'm Haki Yangu AI, LSF's AI assistant. I can explain rights and possible next steps." : "Naitwa Haki Yangu AI, msaidizi wa LSF anayetumia AI. Ninaweza kueleza haki na hatua za kufuata.";
  if (explicitResponseLocale(message) && (!text || /^(?:english|kiswahili|swahili|kiingereza)$/.test(text)))
    return en ? "Of course, we can continue in English. What would you like to talk about?" : "Sawa, tutaendelea kwa Kiswahili. Ungependa tuzungumzie nini?";
  return undefined;
}

export function conversationalIntentReply(kind: string, locale: "en" | "sw", previousUserTexts: string[] = []): string {
  const canonical: Record<string, string> = { identity: "introduce yourself", greeting: "hello", thanks: "thank you", recall: "what did i say", availability: "how are you" };
  if (kind === "capabilities") return appHelpText(locale);
  const message = canonical[kind];
  if (!message) throw new Error("Unsupported conversation intent.");
  return conversationalReply(message, locale, previousUserTexts)!;
}
export const CLARIFICATION_FIELDS = [
  "jurisdiction",
  "location",
  "issue",
  "dates",
  "desired_help",
] as const;
export function clarificationQuestion(field: string, locale?: "en" | "sw", conversationText = "") {
  const en = locale === "en";
  const knownJurisdiction = /mainland|tanzania bara|zanzibar|unguja|pemba|kinondoni|dar es salaam|dodoma|arusha|mwanza/i.test(conversationText);
  const knownIssue = /tenant|tenancy|rent|landlord|evict|mpangaji|kodi|mshahara|sijalipwa|salary|paid|pay|employer|mwajiri|land|ardhi|inherit|urithi|ndoa|divorce|talaka|violence|ukatili|assault/i.test(conversationText);
  const knownDates = /yesterday|today|last (?:week|month|year)|days? ago|weeks? ago|months? ago|jana|leo|juzi|wiki|mwezi|miezi|\b20\d{2}\b/i.test(conversationText);
  if (field === "jurisdiction" && knownJurisdiction) field = "issue";
  if (field === "issue" && knownIssue) field = knownDates ? "desired_help" : "dates";
  if (field === "dates" && knownDates) field = "desired_help";
  const tenancy = /tenant|tenancy|rent|landlord|mpangaji|upangaji|kodi ya nyumba/i.test(conversationText);
  const questions: Record<string, [string, string]> = {
    jurisdiction: [
      "I can help you work through this. Is this about Mainland Tanzania or Zanzibar?",
      "Naweza kukusaidia kulielewa hili. Suala lako linahusu Tanzania Bara au Zanzibar?",
    ],
    location: [
      "Which district or region are you in? You do not need to share your home address.",
      "Upo wilaya au mkoa gani? Huhitaji kutaja anwani ya nyumbani.",
    ],
    issue: [
      tenancy ? "What's the main problem with your tenancy: rent, repairs, a deposit, or being asked to leave?" : "Tell me a little more about what happened.",
      tenancy ? "Kwa suala la upangaji, tatizo ni kodi, matengenezo, amana au kutakiwa kuondoka?" : "Nieleze kidogo kilichotokea.",
    ],
    dates: [
      "When did this happen?",
      "Hili limetokea lini?",
    ],
    desired_help: [
      "Would you like help understanding the issue, finding published support contacts, or preparing a help-request draft?",
      "Unahitaji kuelewa suala lako, kupata mawasiliano ya msaada yaliyochapishwa, au kuandaa rasimu ya ombi la msaada?",
    ],
  };
  if (!questions[field]) throw new Error("Unsupported clarification.");
  return questions[field][en ? 0 : 1];
}
export function publishedSupportText(
  locale?: "en" | "sw",
  issue?: string,
  district?: string,
  search?: string,
) {
  const en = locale === "en";
  const normalized = district?.trim().toLowerCase();
  const term = search?.trim().toLowerCase();
  let resources = publicHelpResourcesForIssue(issue)
    .filter(resource => !term || [resource.name, resource.titleEn, resource.titleSw].some(value => value.toLowerCase().includes(term)))
    .filter(resource => issue || term || resource.issues.length === 0)
    .sort(
      (a, b) =>
        Number(
          b.contactPoints.some((p) => p.district.toLowerCase() === normalized),
        ) -
        Number(
          a.contactPoints.some((p) => p.district.toLowerCase() === normalized),
        ),
    )
    .slice(0, 3);
  if (resources.some(resource => resource.contactPoints.some(point => point.district.toLowerCase() === normalized))) resources = resources.slice(0, 1);
  if (!resources.length) return en
    ? "I haven't found published contact details for that organisation in the checked list. Would you like to try another name?"
    : "Sijapata mawasiliano yaliyochapishwa ya shirika hilo kwenye orodha iliyokaguliwa. Ungependa tujaribu jina lingine?";
  const heading = en
    ? "Here's published support information you can check directly."
    : "Haya ni mawasiliano ya msaada yaliyochapishwa unayoweza kuthibitisha moja kwa moja.";
  return (
    heading +
    "\n\n" +
    resources
      .map((resource) => {
        const contacts = resource.contactPoints.filter(
          (p) => normalized && p.district.toLowerCase() === normalized,
        );
        return `**${en ? resource.titleEn : resource.titleSw}**\n${en ? resource.descriptionEn : resource.descriptionSw}\n${contacts.map((p) => `${p.name} — ${p.address}; ${p.district}, ${p.region}. ${en ? "Published phone" : "Simu iliyochapishwa"}: ${p.phone}.`).join("\n")}\n[${en ? "Publisher source" : "Chanzo cha mchapishaji"}](${resource.url})`;
      })
      .join("\n\n") +
    "\n\n" +
    (en
      ? "Please contact the organisation to confirm availability directly and check whether they can help before travelling. This is a published contact, not a matched individual paralegal. No referral has been sent."
      : "Wasiliana na shirika kuthibitisha kama wanaweza kukusaidia kabla ya kusafiri. Haya ni mawasiliano yaliyochapishwa, si msaidizi binafsi aliyepatikana kwa ajili yako. Hakuna rufaa iliyotumwa.")
  );
}

// Guaranteed useful, non-legal next step even if a model declines to call tools.
export function assistanceFallback(message: string, locale?: 'en'|'sw', previousUserText='') {
  const context = previousUserText + " " + message;
  const asksForSupport = /paral[a-z]{2,10}|legal support|msaidizi wa kisheria|msaada wa kisheria/i.test(context);
  if (asksForSupport) {
    const districts = publicHelpResourcesForIssue().flatMap(row => row.contactPoints.map(point => point.district));
    const district = districts.find(value => context.toLowerCase().includes(value.toLowerCase()));
    return district ? publishedSupportText(locale, undefined, district) : clarificationQuestion('location', locale);
  }
  const knownJurisdiction = /mainland|tanzania bara|zanzibar|unguja|pemba|kinondoni|dar es salaam|dodoma|arusha|mwanza/i.test(context);
  return clarificationQuestion(knownJurisdiction ? 'issue' : 'jurisdiction', locale, context);
}
