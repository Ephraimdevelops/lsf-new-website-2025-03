import {internalQuery} from './_generated/server';
import {v} from 'convex/values';
import {globallySuspendedReferences} from './lib/aiCorrections';
// Organisation reports are public factual references after independent approval,
// never evidence for a legal rule. Drafts and expired sources cannot be searched.
export const searchApproved=internalQuery({args:{search:v.string()},handler:async(ctx,args)=>{
 if(!args.search.trim()||args.search.length>400)return [];
 const aliases:Record<string,string>={wanufaika:'beneficiaries',wanawake:'women',watoto:'children',watu:'people',wasaidizi:'paralegals',mafunzo:'training',mikoa:'regions',wilaya:'districts',fedha:'financial',bajeti:'budget',mapato:'income',matumizi:'expenditure',historia:'history',takwimu:'statistics',mkakati:'strategy',kazi:'work',inafanya:'empowerment'};
 const stop=new Set(['lsf','legal','services','facility','what','which','when','does','about','please','tell','nini','gani','naomba','kuhusu','mwaka','report','annual','summary','your','that','this','have']);
 const terms=[...new Set(args.search.toLowerCase().split(/[^\p{L}\p{N}]+/u).map(t=>aliases[t]??t).filter(t=>t.length>3&&!stop.has(t)))].slice(0,14);
 const years=[...args.search.matchAll(/\b20\d{2}\b/g)].map(x=>x[0]);
 const query=terms.filter(t=>!/^20\d{2}$/.test(t)).join(' ')||'legal empowerment';
 const excluded=await globallySuspendedReferences(ctx);
 const docs=(await ctx.db.query('documents').withIndex('by_approval_status',q=>q.eq('approvalStatus','approved')).collect()).filter(d=>d.sourceType==='lsf_knowledge'&&d.publicationStatus==='published'&&d.indexingStatus==='ready'&&(d.reviewDueAt??0)>Date.now()&&!excluded.has('lsf-report:'+d._id)&&(!years.length||years.some(y=>(d.reportingPeriod??d.title).includes(y)))).slice(0,60);
 const groups=await Promise.all(docs.map(async document=>({document,chunks:await ctx.db.query('embeddings').withSearchIndex('search_text',q=>q.search('text',query).eq('documentId',document._id)).take(3)})));
 return groups.flatMap(({document,chunks})=>chunks.map(chunk=>({chunk,document,score:terms.filter(t=>chunk.text.toLowerCase().includes(t)).length}))).sort((a,b)=>b.score-a.score||String(b.document.reportingPeriod??'').localeCompare(String(a.document.reportingPeriod??''))).slice(0,5).map(({chunk,document})=>({sourceId:'lsf-report:'+document._id,title:document.title,publisher:document.publisher,reportingPeriod:document.reportingPeriod,edition:document.versionLabel,category:document.contentCategory,url:document.sourceUrl,text:chunk.text.slice(0,2500),evidenceType:'organisation_information' as const,note:'State the report year for every figure. Historical figures are not current totals. Historical phone numbers, office addresses and named staff are dated report information, not verified current directory contacts. Do not add together overlapping annual/narrative/summary reports. Project narrative figures apply only to that project; strategy targets are plans, not achieved results. This report is not legal authority, live availability, eligibility or proof of a referral.'}));
}});
