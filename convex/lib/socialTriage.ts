import {formatHakiReply} from "./saadaVoice";
export function socialTriage(text:string):'human_request'|'urgent_safety'|'not_helped'|'sensitive_case'|null {
 const t=text.toLowerCase().trim();
 // A general rights/definition question about a topic is not a disclosure that
 // the sender is currently in danger. Direct danger/disclosure cues still win.
 const informationQuestion=/^(what (?:is|are|does)|how (?:does|do)|explain|define|tell me about|ni nini|nini maana|eleza|nieleze|naomba (?:maelezo|kujua))\b/.test(t);
 const personalDisclosure=/\b(i am|i was|i have|my child|my partner|my husband|my wife|my daughter|my son|being attacked|being beaten|nime|nina|mimi|mtoto wangu|mume wangu|mke wangu|ananipiga|ananibaka)\b/.test(t)||/\b(?:nime|nili|ana)[a-z]*(?:pig|bak|nyanyas)[a-z]*/.test(t);
 const informationalOnly=informationQuestion&&!personalDisclosure;
 const wantsAI=/\b(?:do not|don.t|dont|not) (?:want|need) (?:a )?(?:human|person)|\b(?:sitaki|sihitaji) (?:mtu|mhudumu|binadamu)\b/.test(t);
 if(/^(human(?: agent)?|real person|mtu|mhudumu|binadamu)[.!]?$/.test(t))return 'human_request';
 if(!wantsAI&&/\b(stop ai|no ai|sitaki ai|(?:want|need|prefer|request|connect me with|transfer me to|speak with|talk with) (?:a |an |the )?(?:human(?: agent)?|real person|lsf staff|staff member)|talk to (a |someone |an )?(person|human|agent)|speak to (a |someone |an )?(person|human|agent)|ongea na mtu|kuongea na mtu|kuzungumza na mtu|nataka (?:mtu|mhudumu|binadamu)|(?:talk|speak|connect me) to (?:lsf|an? lsf|a staff)|(?:ongea|kuongea|kuzungumza) na (?:mhudumu|binadamu))\b/.test(t))return 'human_request';
 if(!informationalOnly&&/\b(suicid\w*|kill myself|self.harm|immediate danger|being attacked|being beaten|raped?|kujiua|nataka kufa|hatari ya sasa|anani(piga|baka)|ubakaji|mtoto.*(ukatili|unyanyasaji))\b/.test(t))return 'urgent_safety';
 if(/\b(not helpful|not helping|didn.t help|hasn.t helped|still not helped|you (are wrong|don.t understand)|stop repeating|no help|haisaidii|hujanisaidia|hamjanisaidia|hunisaidii|sijasaidiwa|sio msaada|si msaada)\b/.test(t))return 'not_helped';
 if(!informationalOnly&&/\b(domestic violence|sexual abuse|child abuse|unyanyasaji wa kijinsia|ukatili wa nyumbani)\b/.test(t))return 'sensitive_case';
 if(/\b(passport|bank account)\s*(number|no\.?)?\s*[:=]\s*[a-z0-9]{6,}/i.test(t))return 'sensitive_case';
 return null;
}
export function socialLocale(text:string){return /\b(habari|msaada|nataka|nina|sheria|ndiyo|mtu|haki|sijasaidiwa|nini|nani|wapi|ofisi|historia|ilianzishwa|inafanya|kazi|mawasiliano)\b/i.test(text)?'sw':'en';}
export function handoffReply(locale:string){return locale==='sw'?'Ujumbe wako uko kwenye kikasha cha timu ya LSF. Watakujibu wakipatikana.':'Your message is in LSF’s support inbox. The team will reply when available.';}
function legacyConsentReply(locale:string){return locale==='sw'?'Mimi ni Haki Yangu AI, msaidizi wa LSF. Naweza kusaidia kwa taarifa na kutafuta huduma. Kwa majibu ya AI, ujumbe wa mazungumzo haya utachakatwa na OpenAI. Usiweke taarifa binafsi zisizohitajika. Ukiidhinisha, jibu AI YES; ukiitaka timu ya LSF, andika MTU.':'I’m Haki Yangu AI, LSF’s automated assistant. I can help with information and finding support. For AI answers, this conversation’s messages will be processed by OpenAI. Avoid unnecessary personal details. Reply AI YES to agree, or HUMAN for the LSF team.';}
function previousConsentReply(locale:string){return formatHakiReply(legacyConsentReply(locale).replace('Ukiidhinisha, jibu AI YES;', 'Ukiidhinisha, jibu NDIYO au AI YES;').replace('Reply AI YES to agree', 'Reply YES or AI YES to agree'));}
export function consentReply(locale:string){return formatHakiReply(locale==='sw'
 ? 'Karibu, mimi ni Haki Yangu AI, msaidizi wa LSF. Naweza kukusaidia kuelewa haki zako na kupata msaada. Ujumbe wako utachakatwa na huduma ya AI ili nikujibu. Usitume taarifa binafsi zisizohitajika. Ukiidhinisha, jibu NDIYO. Kwa msaada wa timu ya LSF, andika MTU.'
 : 'I’m Haki Yangu AI, LSF’s AI assistant. I can help you understand your rights and find support. Your messages will be processed by an AI service to answer you. Avoid sharing unnecessary personal details. Reply YES to continue. For the LSF team, type HUMAN.');}
export function isSocialConsentNotice(text:string){const normalized=text.replace(/\s+/g,' ').trim();return ['en','sw'].some(locale=>[consentReply(locale),previousConsentReply(locale),legacyConsentReply(locale)].some(notice=>normalized.endsWith(notice.replace(/\s+/g,' ').trim())));}
export function acceptsSocialConsent(text:string,latest?:{approvedText?:string;outboundId?:string;sentAt:number},now=Date.now()){
 if(/^ai yes[.!]?$/i.test(text.trim()))return true;
 return /^(yes|ndiyo|nakubali|i agree)[.!]?$/i.test(text.trim())&&!!latest?.outboundId&&now-latest.sentAt>=0&&now-latest.sentAt<24*60*60*1000&&isSocialConsentNotice(latest.approvedText??'');
}
export function replyEscalation(parsed:any, evidence:{legal:boolean;directory:boolean;priorReplies:number;consecutiveClarifications?:number}){
 const kinds=['greeting','information','clarification','preparation','legal','directory','handoff'];
 if(typeof parsed?.reply!=='string'||!parsed.reply.trim()||typeof parsed.escalate!=='boolean'||!kinds.includes(parsed.kind))return 'invalid_ai_response';
 if(parsed.missingEvidence||parsed.kind==='legal'&&!evidence.legal||parsed.kind==='directory'&&!evidence.directory)return 'no_verified_answer';
 return parsed.escalate||parsed.kind==='handoff'?'ai_handoff':undefined;
}

export function aiContinuationReply(locale:string,reason?:string){
 if(reason==='no_verified_answer')return locale==='sw'?'Sina chanzo kilichoidhinishwa kinachothibitisha jibu hilo kwa sasa, hivyo sitabuni sheria au mawasiliano. Naweza kukusaidia kupanga maelezo na hatua za maandalizi hapa. Unataka kufanikisha nini katika suala hili?':'I could not verify that answer from the approved information available, so I will not invent a rule or contact. I can still help organise the facts and prepare next steps here. What outcome are you trying to achieve?';
 return locale==='sw'?'Samahani, sijafanikiwa kuandaa jibu la kuaminika kwa ujumbe huu. Bado niko hapa kama Haki Yangu AI; sijahamisha mazungumzo kwa mtu. Tafadhali jaribu swali tena kwa ufupi.':'I could not produce a reliable answer to this message. I’m still here as Haki Yangu AI; this chat has not been transferred to a person. Please try the question again briefly.';
}

export function socialPriority(reason?:string){return reason==='urgent_safety'?'urgent':reason==='sensitive_case'||reason==='not_helped'?'priority':'standard';}
