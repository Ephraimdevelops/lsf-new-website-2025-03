export const HUMAN_HANDOFF_MS = 30 * 60 * 1000;
type Conversation = {humanMode:boolean;updatedAt:number;humanModeUntil?:number;humanModeReason?:string};
const heldReasons = new Set(['urgent_safety','sensitive_case','ai_opt_out']);
export function humanHandoffState(c:Conversation,now=Date.now(),legacyReason?:string){
  const reason=c.humanModeReason??legacyReason??'human_takeover';
  const until=heldReasons.has(reason)?undefined:c.humanModeUntil??c.updatedAt+HUMAN_HANDOFF_MS;
  return {active:c.humanMode&&(until===undefined||now<until),expired:c.humanMode&&until!==undefined&&now>=until,until,reason};
}
export function humanHandoffPatch(reason:string,now=Date.now(),text=''){
  const savedReason=/\b(stop ai|no ai|sitaki ai)\b/i.test(text)?'ai_opt_out':reason;
  return {humanMode:true,humanModeReason:savedReason,humanModeUntil:heldReasons.has(savedReason)?undefined:now+HUMAN_HANDOFF_MS,updatedAt:now};
}
export function resumedAIReply(text:string,locale:string){
  return (locale==='sw'
    ? 'Mimi ni Haki Yangu AI. Nimerudi kukusaidia.'
    : 'I’m Haki Yangu AI. I’m back to help.')+'\n\n'+text;
}
