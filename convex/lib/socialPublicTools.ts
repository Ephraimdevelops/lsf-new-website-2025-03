import type {ActionCtx} from '../_generated/server';
import type {Id} from '../_generated/dataModel';
import type OpenAI from 'openai';
import {api,internal} from '../_generated/api';
import {meteredAi} from './meteredAi';
import {publicHelpResourcesForIssue} from './publicHelpResources';
import {LSF_INFORMATION,lsfInformationReply} from './lsfInformation';
import {SAADA_SKILLS,type SaadaSkill} from './saadaSkills';
import type {SocialToolOutput} from './socialConversation';
import {groundedFact,asksToForget} from './conversationState';
export function makeSocialTools(ctx:ActionCtx,options:{ai:OpenAI;locale:'en'|'sw';id?:Id<'social_messages'>;fixtureHistory?:Array<{question:string;answer?:string|null}>;currentQuestion?:string}){
 const {ai,locale,id}=options;
 return async(name:string,args:Record<string,string>,remainingMs:number):Promise<SocialToolOutput>=>{
  // Evaluation uses fictional same-chat context, never another person's memory.
  if(!id&&name==='recall_conversation')return {data:{messages:options.fixtureHistory??[],scope:'Fictional evaluation chat only.'}};
  if(!id&&name==='remember_context')return {data:groundedFact(args.field,args.value,options.currentQuestion??'')};
  if(!id&&name==='forget_context'){if(!asksToForget(options.currentQuestion??''))throw new Error('Explicit request required');return {data:{forgotten:true}};}

    if(name==='remember_context')return {data:await ctx.runMutation(internal.conversationMemory.rememberSocial,{id:id!,field:args.field,value:args.value})};
    if(name==='forget_context')return {data:await ctx.runMutation(internal.conversationMemory.forgetSocial,{id:id!})};
    if(name==='recall_conversation')return {data:{messages:await ctx.runQuery(internal.socialMessaging.recallHistory,{id:id!,search:args.search}),scope:'Only this sender/account/channel chat. Prior circumstances may have changed. Personal context, not legal evidence.'}};
    if(name==='load_skill')return {data:{workflow:SAADA_SKILLS[args.skill as SaadaSkill],note:'Workflow only, not legal authority. In this DM, prepare factual unsent text; no private case access or submission tools are available.'}};
    if(name==='about_lsf'){
     const url=args.topic==='contact'?LSF_INFORMATION.contact.sourceUrl:LSF_INFORMATION.sources[0].url;
     return {data:{answer:lsfInformationReply(locale,args.topic),profile:LSF_INFORMATION},sources:[{id:'lsf:'+String(args.topic||'overview'),kind:'published',title:'LSF published information',url}]};
    }
    if(name==='search_knowledge'){
     const embedding=await meteredAi(ctx,{socialMessageId:id,feature:'social_embedding',model:'text-embedding-3-small',input:args.search,maxOutputTokens:0},()=>ai.embeddings.create({model:'text-embedding-3-small',input:args.search},{timeout:Math.min(15000,remainingMs)}));
     const matches=await ctx.vectorSearch('embeddings','by_embedding',{vector:embedding.data[0].embedding,limit:64});
     const approved=new Set(await ctx.runQuery(internal.sara.getApprovedChunkIds,{ids:matches.map(x=>x._id)}));
     const semantic=await ctx.runQuery(internal.sara.getChunks,{ids:matches.filter(x=>approved.has(x._id)&&x._score>=0.75).slice(0,4).map(x=>x._id)});
     const employment=/\b(?:ajira|mwajiri|mshahara|sijalipwa|employment|employer|wages|salary|dismissal)\b/i.test(args.search);
     const query=employment&&/\b(?:mkataba|contract|huandikwa|particulars)\b/i.test(args.search)?'written employment contract particulars':args.search.slice(0,200);
     const lexical=await ctx.runQuery(internal.sara.searchApprovedPassages,{search:query});
     const combined=[...lexical,...semantic];
     const relevant=employment?combined.filter(x=>/employment|labour|ajira/i.test(x.sourceTitle)):combined;
     const chunks=[...new Map(relevant.map(x=>[x._id,x])).values()].slice(0,4);
     return {data:{query:args.search,passages:chunks.map(x=>({sourceId:'law:'+x.documentId,title:x.sourceTitle,text:x.text.slice(0,2500),jurisdiction:x.jurisdiction,publisher:x.publisher,edition:x.versionLabel})),note:chunks.length?'Explain only the applicable passage; no unsupported legal rule.':'No sufficiently relevant approved passage matched. Try a focused synonym query or a guide; practical non-legal preparation is still allowed.'},sources:chunks.map(x=>({id:'law:'+x.documentId,kind:'legal',title:x.sourceTitle,url:x.sourceUrl}))};
    }
    if(name==='find_guides'){
     const guides=await ctx.runQuery(api.publications.searchPublicLegalGuides,{search:args.search,jurisdiction:args.jurisdiction as 'national'|'tanzania_mainland'|'zanzibar'|undefined});
     return {data:{guides:guides.slice(0,3).map(x=>({sourceId:'guide:'+x._id,title:locale==='sw'?x.titleSw:x.titleEn,summary:(locale==='sw'?x.summarySw:x.summaryEn).slice(0,1000),steps:(locale==='sw'?x.stepsSw:x.stepsEn).slice(0,6).map(step=>step.slice(0,400)),jurisdiction:x.jurisdiction}))},sources:guides.slice(0,3).map(x=>({id:'guide:'+x._id,kind:'legal',title:x.sourceTitle,url:x.sourceUrl}))};
    }
    if(name==='find_services'){
     let services=await ctx.runQuery(api.justiceServices.listPublicServices,{search:args.search,issueCategory:args.issueCategory,region:args.region,district:args.district});
     let broadenedSearch=false;
     // An empty exact keyword/category match does not mean the district has
     // no public offices. Retry location-only, retaining public verification.
     if(!services.length&&(args.district||args.region)&&(args.search||args.issueCategory)){
      services=await ctx.runQuery(api.justiceServices.listPublicServices,{region:args.region,district:args.district});broadenedSearch=true;
     }
     return {data:{filters:args,broadenedSearch,issueMatchUnconfirmed:broadenedSearch,services:services.slice(0,3).map(x=>({sourceId:'service:'+x._id,name:x.name,organisation:x.organizationName,region:x.region,district:x.district,address:x.physicalLocation,phone:x.phone,intake:x.currentIntakeState,contactOnly:broadenedSearch||!['open','limited'].includes(x.currentIntakeState),eligibility:x.eligibility,openingHours:x.openingHours,services:x.serviceTypes})),referralSent:false,note:'These are current verified public listings. Closed/unknown intake or broadened matches are contact information only, not confirmed case acceptance or a confirmed issue match. No confidential locations are returned.'},sources:services.slice(0,3).map(x=>({id:'service:'+x._id,kind:'directory',title:x.name}))};
    }
    if(name==='find_paralegals'){
     const people=await ctx.runQuery(api.paralegals.listApprovedParalegals,{region:args.region});
     const matches=people.filter(x=>!args.district||x.district.trim().toLowerCase()===args.district.trim().toLowerCase()).slice(0,3);
     return {data:{filters:args,paralegals:matches.map(x=>({sourceId:'paralegal:'+x._id,name:x.fullName,region:x.region,district:x.district,phone:x.phone,languages:x.languages,availability:x.availabilityStatus,specialisations:x.specializations})),referralSent:false,note:'Public approved profiles only; verify recorded availability. No match is not a reason to invent a person or immediately stop helping.'},sources:matches.map(x=>({id:'paralegal:'+x._id,kind:'directory',title:x.fullName}))};
    }
    if(name==='find_information_resources'){
     const resources=publicHelpResourcesForIssue(args.issueCategory).slice(0,8);
     return {data:{resources,note:'Publisher information and published contacts only. These are not approved legal evidence or verified intake/availability. Use as a supplement, not a link-only answer.'},sources:resources.map(x=>({id:'publisher:'+x.id,kind:'published',title:x.name,url:x.url}))};
    }
    throw new Error('Unsupported social tool');
 };
}
