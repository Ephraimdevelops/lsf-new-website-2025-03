import { action } from './_generated/server';
import { api, internal } from './_generated/api';
import { v, ConvexError } from 'convex/values';

// Deliberately absent from the model's tool manifest. Only the review UI calls it.
export const confirm=action({args:{id:v.id('saada_action_drafts'),confirmed:v.boolean()},handler:async(ctx,args):Promise<{id:string;reference:string;status:string}>=>{
  if(!await ctx.auth.getUserIdentity())throw new ConvexError("Unauthorized");
  const draft=await ctx.runMutation(internal.saadaActionDrafts.claim,args);
  if(draft.status==='submitted' && draft.result)return draft.result;
  const clientActionId=`saada:${draft._id}`;
  let result:{id:string;reference:string;status:string};
  if(draft.payload.kind==='appointment'){
    const event=await ctx.runMutation(api.caseManagement.requestAppointment,{caseId:draft.caseId,clientActionId,preferredMode:draft.payload.preferredMode,preferredTime:draft.payload.preferredTime,note:draft.payload.note});
    result={id:String(event),reference:draft.caseReference,status:'appointment_requested'};
  } else {
    const referral=await ctx.runMutation(api.referrals.createForCase,{caseId:draft.caseId,clientActionId,destinationServiceId:draft.payload.destinationServiceId,destinationUserId:draft.payload.destinationUserId,reason:draft.payload.reason,informationShared:[draft.payload.information],consentMethod:'written',consentStatement:'Awaiting beneficiary approval in Haki Yangu. No consent has been recorded yet.'});
    result={id:String(referral.referralId),reference:referral.publicId,status:'awaiting_beneficiary_consent'};
  }
  await ctx.runMutation(internal.saadaActionDrafts.complete,{id:draft._id,result});return result;
}});
