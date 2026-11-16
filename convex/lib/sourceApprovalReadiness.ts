type ReviewSource={approvalStatus?:string;uploadedByClerkId?:string;curationFlags?:string[];indexingStatus?:string;processedAt?:number;publisher?:string;jurisdiction?:string;language?:string;contentCategory?:string;versionLabel?:string;reviewDueAt?:number};
// Read-only guidance. The review mutation remains the final authority.
export function sourceApprovalBlockers(doc:ReviewSource,subject:string,now=Date.now()){
 if(doc.approvalStatus!=='pending')return [];
 const blockers:string[]=[];
 if(doc.uploadedByClerkId===subject)blockers.push('This account uploaded the document. A different administrator must approve or reject it.');
 if(doc.curationFlags?.length)blockers.push(`Resolve the ${doc.curationFlags.length} highlighted source issues before approval.`);
 if(doc.indexingStatus!=='ready'||!doc.processedAt)blockers.push('Finish preparing the document before approval.');
 if(!doc.publisher?.trim()||/publisher review pending/i.test(doc.publisher))blockers.push('Confirm the actual publisher in the source details.');
 if(!doc.jurisdiction||doc.jurisdiction==='other')blockers.push('Confirm whether the source applies to Mainland Tanzania, Zanzibar or nationally.');
 if(!doc.language||!doc.contentCategory?.trim()||!doc.versionLabel?.trim())blockers.push('Complete the language, category and edition in the source details.');
 if(!doc.reviewDueAt||doc.reviewDueAt<=now)blockers.push('Choose a future review date after checking the source.');
 return blockers;
}
