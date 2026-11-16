export const CONTEXT_KEYS=['name','location','issue','desiredOutcome','nextStep'] as const;
export type ContextKey=typeof CONTEXT_KEYS[number];
export type ConversationFacts=Partial<Record<ContextKey,string>>;
export function cleanFacts(input:ConversationFacts){
 const facts:ConversationFacts={};
 for(const key of CONTEXT_KEYS){const value=input[key]?.normalize('NFKC').replace(/\s+/g,' ').trim();if(value){if(value.length>200||/\b(?:password|api.?key|access.?token|passport number|bank account)\b/i.test(value)||/\d{9,}/.test(value))throw new Error('Keep only brief, non-sensitive chat details.');facts[key]=value;}}
 return facts;
}
export function groundedFact(field:string,value:string,currentUserText:string){
 if(!CONTEXT_KEYS.includes(field as ContextKey))throw new Error('Unknown memory field');
 const clean=cleanFacts({[field]:value});const actual=clean[field as ContextKey];
 if(!actual||!currentUserText.normalize('NFKC').toLowerCase().includes(actual.toLowerCase()))throw new Error('Only words supplied by the person in the current message can be remembered.');
 return {field:field as ContextKey,value:actual};
}
export function asksToForget(text:string){return /\b(forget (?:my|what|everything|this|the)|clear (?:my |the )?(?:memory|saved details)|delete (?:my |the )?(?:memory|saved details)|sahau (?:taarifa|kumbukumbu|nilicho|yote)|futa (?:taarifa zangu|kumbukumbu))\b/i.test(text);}
