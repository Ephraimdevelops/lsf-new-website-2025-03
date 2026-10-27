import { useAction, useMutation, useQuery } from 'convex/react';
import { useUser } from '@clerk/clerk-react';
import { useRef, useState } from 'react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
export function SaadaActionCard({ id,sw }: {id:string;sw:boolean}) {
  const {isSignedIn,user}=useUser();
  const valid=/^[a-z0-9]{20,64}$/.test(id);
  const draft=useQuery(api.saadaActionDrafts.get,isSignedIn && valid?{id:id as Id<'saada_action_drafts'>}:'skip');
  const confirm=useAction(api.saadaActionConfirm.confirm),cancel=useMutation(api.saadaActionDrafts.cancel);
  const [busy,setBusy]=useState(false),[error,setError]=useState(''); const lock=useRef(false);
  const owner=useRef(user?.id);owner.current=user?.id;
  if(!isSignedIn || !valid)return null;
  if(draft===undefined)return <p className="my-3 text-sm text-stone-500">{sw?'Inafungua rasimu…':'Opening draft…'}</p>;
  if(!draft)return <p className="my-3 text-sm text-stone-500">{sw?'Rasimu hii haipatikani. Kagua taarifa za kesi.':'This draft is unavailable. Check the case updates.'}</p>;
  const submitted=draft.status==='submitted',cancelled=draft.status==='cancelled',p=draft.payload;
  async function act(kind:'confirm'|'cancel') {
    if(lock.current)return;lock.current=true;setBusy(true);setError('');const requestOwner=owner.current;
    try{if(kind==='confirm')await confirm({id:id as Id<'saada_action_drafts'>,confirmed:true});else await cancel({id:id as Id<'saada_action_drafts'>});}
    catch{if(owner.current===requestOwner)setError(sw?'Hatukuweza kuthibitisha matokeo. Kagua kesi au jaribu tena; ombi lilelile halitatumwa mara mbili.':'We could not confirm the result. Check the case or retry; the same request will not be submitted twice.');}
    finally{if(owner.current===requestOwner){lock.current=false;setBusy(false);}}
  }
  return <section className="my-4 rounded-2xl border border-stone-200 bg-stone-50 p-4" aria-label={sw?'Kagua ombi':'Review request'}>
    <h3 className="text-base font-semibold text-stone-900">{p.kind==='appointment'?(sw?'Kagua ombi la miadi':'Review appointment request'):(sw?'Kagua pendekezo la rufaa':'Review referral proposal')}</h3>
    <p className="mt-2 text-sm font-medium">{sw?'Kesi':'Case'}: {draft.caseReference}</p>
    {p.kind==='appointment'?<div className="mt-2 space-y-1 text-sm text-stone-700"><p>{p.preferredMode==='phone'?(sw?'Kwa simu':'Phone'):p.preferredMode==='remote'?(sw?'Mtandaoni':'Online'):(sw?'Ana kwa ana':'In person')}</p><p>{p.preferredTime || (sw?'Muda utapangwa na timu ya kesi.':'Time to be agreed with the case team.')}</p>{p.note&&<p className="whitespace-pre-wrap">{p.note}</p>}</div>:<div className="mt-2 space-y-2 text-sm text-stone-700"><p>{p.destinationName} · {p.providerName}</p><p className="whitespace-pre-wrap">{p.reason}</p><p><strong>{sw?'Taarifa zinazopendekezwa kushirikiwa:':'Proposed information to share:'}</strong> {p.information}</p></div>}
    <p className="mt-3 text-xs leading-5 text-stone-600">{p.kind==='appointment'?(sw?'Hili ni ombi la muda unaopendelea; timu ya kesi bado inahitaji kuthibitisha miadi.':'This requests your preferred time; the case team must still confirm the appointment.'):(sw?'Hili linaomba ridhaa ya mnufaika. Mtoa huduma hatapokea maelezo mpaka mnufaika akubali.':'This asks for the beneficiary’s consent. The provider receives details only after the beneficiary agrees.')}</p>
    {submitted?<p role="status" className="mt-3 text-sm font-medium text-green-800">{p.kind==='appointment'?(sw?'Ombi la miadi limetumwa kwa timu ya kesi.':'Appointment request submitted to the case team.'):(sw?'Pendekezo limeundwa; linasubiri ridhaa ya mnufaika.':'Proposal created; awaiting beneficiary consent.')} {draft.result?.reference}</p>:cancelled || draft.expired?<p className="mt-3 text-sm">{cancelled?(sw?'Rasimu imeghairiwa.':'Draft cancelled.'):(sw?'Rasimu imekwisha muda. Omba mpya.':'Draft expired. Ask for a new one.')}</p>:<div className="mt-4 flex flex-wrap gap-2"><button type="button" disabled={busy} onClick={()=>void act('confirm')} className="min-h-11 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{busy?(sw?'Inathibitisha…':'Confirming…'):draft.status==='confirming'?(sw?'Kagua na ujaribu tena':'Check and retry'):(sw?'Thibitisha ombi':'Confirm request')}</button>{draft.status==='pending'&&<button type="button" disabled={busy} onClick={()=>void act('cancel')} className="min-h-11 rounded-xl border px-4 py-2 text-sm">{sw?'Ghairi rasimu':'Cancel draft'}</button>}</div>}
    {error&&<p role="alert" className="mt-3 text-sm text-primary">{error}</p>}
  </section>;
}
