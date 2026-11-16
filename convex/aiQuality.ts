"use node";
import {action} from './_generated/server';
import {api,internal} from './_generated/api';
import {v} from 'convex/values';
import OpenAI from 'openai';
import {CONVERSATION_QUALITY_CASES} from './lib/conversationQualityCases';
import {makeSocialTools} from './lib/socialPublicTools';
import {socialConversationMessages,runSocialConversation,type SocialTurn} from './lib/socialConversation';
import {meteredAi} from './lib/meteredAi';
import {costMicroUsd} from './lib/aiPricing';
import {socialTriage,handoffReply,consentReply,acceptsSocialConsent,replyEscalation,aiContinuationReply} from './lib/socialTriage';
import {responseLocale} from './lib/saadaLanguage';
export const evaluate=action({args:{caseId:v.string(),model:v.union(v.literal('gpt-4o'),v.literal('gpt-4o-mini'))},handler:async(ctx,args)=>{
 if(!await ctx.auth.getUserIdentity())throw new Error('Unauthorized');const access=await ctx.runQuery(api.users.currentAccess,{});if(!access?.roles.includes('admin'))throw new Error('Administrator required');
 const scenario=CONVERSATION_QUALITY_CASES.find(x=>x.id===args.caseId);if(!scenario)throw new Error('Unknown review case');
 const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY,timeout:20000,maxRetries:0});
 const prompt=await ctx.runQuery(internal.sara.getApprovedPromptInternal,{});const history:SocialTurn[]=[];const turns=[];
 let consent=args.caseId!=='consent_yes',calls=0,inputTokens=0,outputTokens=0,latencyMs=0;
 for(const question of scenario.messages){
  if(question.startsWith('[pause'))continue;
  const started=Date.now(),locale=responseLocale(question,undefined,history.map(x=>x.question));let result:any;
  const signal=socialTriage(question);
  if(signal==='human_request')result={reply:handoffReply(locale),kind:'handoff',tools:[],protocol:true};
  else if(question.startsWith('[voice note'))result={reply:locale==='sw'?'Ujumbe wa sauti unahitaji idhini na rekodi halisi kabla ya kunukuliwa.':'A voice note needs consent and an actual recording before transcription.',kind:'information',tools:[],protocol:true};
  else if(!consent&&!acceptsSocialConsent(question,history.length?{approvedText:history.at(-1)!.answer!,outboundId:'fixture-delivered',sentAt:Date.now()}:undefined))result={reply:consentReply(locale),kind:'consent',tools:[],protocol:true};
  else{
   consent=true;const prepared=socialConversationMessages(question,[...history.filter(x=>x.kind!=='consent'),{question}],prompt?.prompt);
   const response=await runSocialConversation({messages:prepared.messages,execute:makeSocialTools(ctx,{ai:client,locale,fixtureHistory:history,currentQuestion:question}),create:async(messages,tools,remainingMs)=>{
    const response=await meteredAi(ctx,{feature:'conversation_quality_eval',model:args.model,input:{messages,tools},maxOutputTokens:900},()=>client.chat.completions.create({model:args.model,messages,max_completion_tokens:900,response_format:{type:'json_object'},store:false,...(tools.length?{tools,tool_choice:'auto' as const}:{})},{timeout:Math.min(20000,remainingMs)}));calls++;inputTokens+=response.usage?.prompt_tokens??0;outputTokens+=response.usage?.completion_tokens??0;return response;
   }});
   const withheld=replyEscalation(response,{legal:response.legal,directory:response.directory,priorReplies:history.length});
   result={reply:withheld?aiContinuationReply(locale,withheld):response.reply,kind:response.kind,tools:response.usedTools,citations:response.cited,withheld:withheld??null,protocol:false};
  }
  const elapsed=Date.now()-started;latencyMs+=elapsed;turns.push({question,...result,latencyMs:elapsed});history.push({question,answer:result.reply,kind:result.kind});
 }
 return {caseId:scenario.id,model:args.model,turns,criteria:scenario.review_criteria,latencyMs,calls,inputTokens,outputTokens,chatCostEstimateUSD:(costMicroUsd(args.model,inputTokens,outputTokens)??0)/1e6,note:'Fictional scenario simulation through the shared social runtime and current public evidence tools. Protocol cases are deterministic. Not a beneficiary chat, a native delivery test or an expert legal correctness score.'};
}});
