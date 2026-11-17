import {referenceExcluded} from './aiCorrections';
import type {ActionCtx} from '../_generated/server';
import type {Id} from '../_generated/dataModel';
import type OpenAI from 'openai';
import {api,internal} from '../_generated/api';
import {meteredAi} from './meteredAi';
import {publicHelpResourcesForIssue} from './publicHelpResources';
import {LSF_INFORMATION,lsfInformationReply,lsfTopicSource} from './lsfInformation';
import {SAADA_SKILLS,type SaadaSkill} from './saadaSkills';
import type {SocialToolOutput} from './socialConversation';
import {readPublishedParalegals,publishedParalegalMatches,LSF_PUBLIC_DIRECTORY_URL} from './publishedParalegals';
import {rankSupport,areaReference,proximityInformation} from './supportProximity';
import {matchesParalegalArea} from './paralegalSearch';
import {groundedFact,asksToForget} from './conversationState';
export function makeSocialTools(ctx:ActionCtx,options:{ai:OpenAI;locale:'en'|'sw';id?:Id<'social_messages'>;fixtureHistory?:Array<{question:string;answer?:string|null}>;currentQuestion?:string;excludedIds?:string[]}){
 const {ai,locale,id}=options;
 const excluded=new Set(options.excludedIds??[]);
 let published:ReturnType<typeof readPublishedParalegals>|undefined;
 const officeAlternative={sourceId:'lsf:contact',name:'LSF office',...LSF_INFORMATION.contact,note:'Published office contact for enquiries only. Not the nearest verified provider, confirmed intake, a named paralegal, an appointment or a sent referral.'};
 const officeSource={id:'lsf:contact',kind:'published' as const,title:'LSF office contact',url:LSF_INFORMATION.contact.sourceUrl};
 return async(name:string,args:Record<string,string>,remainingMs:number):Promise<SocialToolOutput>=>{
  if(name==='report_information_problem'){
   if(!id)return {data:{recorded:false,note:'Fictional evaluation only; no real report submitted.'}};
   const result=await ctx.runMutation(internal.aiCorrections.reportProblem,{socialMessageId:id,referenceId:args.referenceId,category:args.category as any});
   const updated=await ctx.runQuery(internal.aiCorrections.getState,{socialMessageId:id});for(const ref of updated.excludedIds)excluded.add(ref);
   return {data:{...result,excludedIds:updated.excludedIds}};
  }
  // Evaluation uses fictional same-chat context, never another person's memory.
  if(!id&&name==='recall_conversation')return {data:{messages:options.fixtureHistory??[],scope:'Fictional evaluation chat only.'}};
  if(!id&&name==='remember_context')return {data:groundedFact(args.field,args.value,options.currentQuestion??'')};
  if(!id&&name==='forget_context'){if(!asksToForget(options.currentQuestion??''))throw new Error('Explicit request required');return {data:{forgotten:true}};}

    if(name==='remember_context')return {data:await ctx.runMutation(internal.conversationMemory.rememberSocial,{id:id!,field:args.field,value:args.value})};
    if(name==='forget_context')return {data:await ctx.runMutation(internal.conversationMemory.forgetSocial,{id:id!})};
    if(name==='recall_conversation')return {data:{messages:await ctx.runQuery(internal.socialMessaging.recallHistory,{id:id!,search:args.search}),scope:'Only this sender/account/channel chat. Prior circumstances may have changed. Personal context, not legal evidence.'}};
    if(name==='load_skill')return {data:{workflow:SAADA_SKILLS[args.skill as SaadaSkill],note:'Workflow only, not legal authority. In this DM, prepare factual unsent text; no private case access or submission tools are available.'}};
    if(name==='search_lsf_knowledge'){
     const passages=(await ctx.runQuery(internal.lsfKnowledge.searchApproved,{search:args.search.slice(0,400)})).filter(x=>!excluded.has(x.sourceId));
     return {data:{passages,note:'Independently approved published LSF reports only. Cite the year of each figure. No legal authority, current staffing, case acceptance or referral is established.'},sources:passages.map(x=>({id:x.sourceId,kind:'published',title:x.title+(x.reportingPeriod?' — '+x.reportingPeriod:''),...(x.url?{url:x.url}:{})}))};
    }
    if(name==='about_lsf'){
     if(referenceExcluded(excluded,'lsf:'+String(args.topic||'overview'),args.topic==='contact'?LSF_INFORMATION.contact.phone:undefined))return {data:{available:false,note:'This reference was disputed in this chat or suspended by review. Do not repeat its prior claim; check a different source or clarify the disputed detail.'}};
     const url=lsfTopicSource(args.topic);
     if(args.topic==='network'){
      published??=readPublishedParalegals();const directory=await published;
      if('stats' in directory&&directory.stats)return {data:{answer:lsfInformationReply(locale,args.topic),profile:{name:LSF_INFORMATION.name,checkedOn:LSF_INFORMATION.checkedOn,limits:LSF_INFORMATION.limits},publishedDirectory:{...directory.stats,sourceUrl:LSF_PUBLIC_DIRECTORY_URL,note:'Published website record counts, not the total active LSF network, unique qualified people or app accounts. Usable means passed basic contact-data checks, not current availability.'}},sources:[{id:'lsf:network',kind:'published',title:'LSF published paralegal directory',url:LSF_PUBLIC_DIRECTORY_URL}]};
     }
     return {data:{answer:lsfInformationReply(locale,args.topic),profile:args.topic==='contact'?{contact:LSF_INFORMATION.contact}:{name:LSF_INFORMATION.name,checkedOn:LSF_INFORMATION.checkedOn,limits:LSF_INFORMATION.limits}},sources:[{id:'lsf:'+String(args.topic||'overview'),kind:'published',title:'LSF published information',url}]};
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
     const permitted=combined.filter(x=>!excluded.has('law:'+x.documentId));
     const relevant=employment?permitted.filter(x=>/employment|labour|ajira/i.test(x.sourceTitle)):permitted;
     const chunks=[...new Map(relevant.map(x=>[x._id,x])).values()].slice(0,4);
     return {data:{query:args.search,passages:chunks.map(x=>({sourceId:'law:'+x.documentId,title:x.sourceTitle,text:x.text.slice(0,2500),jurisdiction:x.jurisdiction,publisher:x.publisher,edition:x.versionLabel})),note:chunks.length?'Explain only the applicable passage; no unsupported legal rule.':'No sufficiently relevant approved passage matched. Try a focused synonym query or a guide; practical non-legal preparation is still allowed.'},sources:chunks.map(x=>({id:'law:'+x.documentId,kind:'legal',title:x.sourceTitle,url:x.sourceUrl}))};
    }
    if(name==='find_guides'){
     const guides=(await ctx.runQuery(api.publications.searchPublicLegalGuides,{search:args.search,excludedIds:[...excluded].slice(0,300),jurisdiction:args.jurisdiction as 'national'|'tanzania_mainland'|'zanzibar'|undefined})).filter(x=>!excluded.has('guide:'+x._id));
     return {data:{guides:guides.slice(0,3).map(x=>({sourceId:'guide:'+x._id,title:locale==='sw'?x.titleSw:x.titleEn,summary:(locale==='sw'?x.summarySw:x.summaryEn).slice(0,1000),steps:(locale==='sw'?x.stepsSw:x.stepsEn).slice(0,6).map(step=>step.slice(0,400)),jurisdiction:x.jurisdiction}))},sources:guides.slice(0,3).map(x=>({id:'guide:'+x._id,kind:'legal',title:x.sourceTitle,url:x.sourceUrl}))};
    }
    if(name==='find_services'){
     const origin=areaReference(args.area??args.district);
     let services=await ctx.runQuery(api.justiceServices.listPublicServices,{search:args.search,issueCategory:args.issueCategory,region:args.region??origin?.region,district:origin?undefined:args.district});
     let broadenedSearch=false;
     // An empty exact keyword/category match does not mean the district has
     // no public offices. Retry location-only, retaining public verification.
     if(!services.length&&(args.district||args.region)&&(args.search||args.issueCategory)){
      services=await ctx.runQuery(api.justiceServices.listPublicServices,{region:args.region??origin?.region,district:origin?undefined:args.district});broadenedSearch=true;
     }
     services=services.filter(x=>!referenceExcluded(excluded,'service:'+x._id,x.phone));
     const proximity=rankSupport(services,args);services=proximity.items.map(x=>x.record);
     return {data:{filters:args,proximity:proximityInformation(proximity),...(!services.length&&!referenceExcluded(excluded,'lsf:contact',LSF_INFORMATION.contact.phone)?{publishedOfficeAlternative:officeAlternative}:{}),broadenedSearch,issueMatchUnconfirmed:broadenedSearch,services:services.slice(0,3).map(x=>({sourceId:'service:'+x._id,name:x.name,organisation:x.organizationName,region:x.region,district:x.district,address:x.physicalLocation,phone:x.phone,intake:x.currentIntakeState,contactOnly:broadenedSearch||!['open','limited'].includes(x.currentIntakeState),eligibility:x.eligibility,openingHours:x.openingHours,services:x.serviceTypes})),referralSent:false,note:'These are current verified public listings. Closed/unknown intake or broadened matches are contact information only, not confirmed case acceptance or a confirmed issue match. No confidential locations are returned.'},sources:!services.length?(referenceExcluded(excluded,'lsf:contact',LSF_INFORMATION.contact.phone)?[]:[officeSource]):services.slice(0,3).map(x=>({id:'service:'+x._id,kind:'directory',title:x.name,...(x.phone?{phone:x.phone}:{})}))};
    }
    if(name==='find_paralegals'){
     const people=await ctx.runQuery(api.paralegals.listApprovedParalegals,{});
     const proximity=rankSupport(people.filter(x=>!referenceExcluded(excluded,'paralegal:'+x._id,x.phone)),args);
     const matches=proximity.items.map(x=>x.record);
     if(!matches.length){
      published??=readPublishedParalegals();const directory=await published;
      const publicProximity=rankSupport(directory.contacts.filter(x=>!referenceExcluded(excluded,'published-paralegal:'+x.sourceId,x.phone)),args);
      const contacts=publicProximity.items.map(x=>x.record);
      if(contacts.length)return {data:{filters:args,proximity:proximityInformation(publicProximity),paralegals:[],publishedContacts:contacts.map(x=>({...x,sourceId:'published-paralegal:'+x.sourceId})),contactOnly:true,referralSent:false,note:'These contacts are published on LSF’s live website, not verified/onboarded profiles in this app. Their availability, specialisation and meeting address are unconfirmed. Give the actual name, recorded area and phone. Return kind information with the published source. Do not claim nearest, accepting cases, personal location, an appointment or a sent referral.'},sources:contacts.map(x=>({id:'published-paralegal:'+x.sourceId,kind:'published',title:x.fullName+' — LSF published directory',phone:x.phone,url:LSF_PUBLIC_DIRECTORY_URL}))};
     }
     const offices=(await Promise.all(matches.map(x=>x.meetingPoint?ctx.runQuery(api.justiceServices.getPublicService,{id:x.meetingPoint.id}):null))).map(office=>office?.servicePointType==='safe_house'?null:office);
     return {data:{filters:args,proximity:proximityInformation(proximity),...(!matches.length&&!referenceExcluded(excluded,'lsf:contact',LSF_INFORMATION.contact.phone)?{publishedOfficeAlternative:officeAlternative}:{}),paralegals:matches.map((x,i)=>({sourceId:'paralegal:'+x._id,name:x.fullName,region:x.region,district:x.district,ward:x.ward,phone:x.phone,languages:x.languages,availability:x.availabilityStatus,specialisations:x.specializations,meetingOffice:offices[i]?{name:offices[i]!.name,address:offices[i]!.physicalLocation,phone:offices[i]!.phone,openingHours:offices[i]!.openingHours}:null})),referralSent:false,note:'Public approved profiles only; verify recorded availability. Use proximity metadata only when its estimate is non-null; otherwise report the recorded region, district or ward without claiming nearest. A meetingOffice is a chosen public office, not the person’s current position or a confirmed appointment. An empty result means no verified matching profile in this app, not that LSF has no paralegals. When no profile is returned, use kind information to explain that specific gap, not kind directory. Try find_services for an office contact if useful; do not invent a person or immediately stop helping.'},sources:!matches.length?(referenceExcluded(excluded,'lsf:contact',LSF_INFORMATION.contact.phone)?[]:[officeSource]):matches.map(x=>({id:'paralegal:'+x._id,kind:'directory',title:x.fullName,phone:x.phone}))};
    }
    if(name==='find_information_resources'){
     const references=(await ctx.runQuery(api.directoryResearch.searchPublicReferences,{search:args.search??args.issueCategory,excludedIds:[...excluded].slice(0,300)})).filter(x=>!referenceExcluded(excluded,x.id,x.phone)).slice(0,3);
     const resources=publicHelpResourcesForIssue(args.issueCategory).filter(x=>!args.search||[x.name,x.titleEn,x.titleSw,x.descriptionEn,x.descriptionSw,...x.issues].join(' ').toLowerCase().includes(args.search.toLowerCase())).filter(x=>!referenceExcluded(excluded,'publisher:'+x.id)&&!x.contactPoints.some(p=>referenceExcluded(excluded,'publisher:'+x.id,p.phone))).slice(0,4);
     return {data:{references:references.map(x=>({sourceId:x.id,scope:x.scope,title:locale==='sw'?x.titleSw:x.titleEn,text:(locale==='sw'?x.bodySw:x.bodyEn).slice(0,2000),phone:x.phone,email:x.email,address:x.address,region:x.region,district:x.district,reviewDueAt:x.reviewDueAt})),resources,note:'Approved preparation checklists and publisher information and published contacts only. These are not approved legal evidence or verified intake/availability. Use as a supplement, not a link-only answer.'},sources:[...references.map(x=>({id:x.id,kind:'published' as const,title:x.titleEn,url:x.sourceUrls[0],...(x.phone?{phone:x.phone}:{})})),...resources.map(x=>({id:'publisher:'+x.id,kind:'published' as const,title:x.name,url:x.url}))]};
    }
    throw new Error('Unsupported social tool');
 };
}
