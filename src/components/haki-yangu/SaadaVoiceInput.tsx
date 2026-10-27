import { useEffect, useRef, useState } from 'react';
import { useAction, useMutation } from 'convex/react';
import { Mic, Square, X } from 'lucide-react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { recordingBlobToWav } from '../../../shared/voiceAudio';

export function SaadaVoiceInput({sw,disabled,onText}:{sw:boolean;disabled:boolean;onText:(text:string)=>void}) {
 const issue=useMutation(api.saadaMedia.generateAudioUploadUrl), discard=useMutation(api.saadaMedia.discardAudio), transcribe=useAction(api.saadaMediaActions.transcribe);
 const recorder=useRef<MediaRecorder>(); const stream=useRef<MediaStream>(); const timer=useRef<ReturnType<typeof setTimeout>>(); const mounted=useRef(true); const lock=useRef(false); const saved=useRef<Id<'_storage'>>();
 const [recording,setRecording]=useState(false), [busy,setBusy]=useState(false), [audio,setAudio]=useState<{blob:Blob;url:string}|null>(null), [error,setError]=useState('');
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false; if(timer.current)clearTimeout(timer.current); if(recorder.current?.state==='recording')recorder.current.stop();stream.current?.getTracks().forEach(track=>track.stop());};},[]);
 useEffect(()=>()=>{if(audio)URL.revokeObjectURL(audio.url);},[audio]);
 async function start(){if(lock.current||disabled)return;lock.current=true;setError('');try{
  if(!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder==='undefined')throw new Error(sw?'Kipaza sauti hakipatikani. Andika swali lako.':'Microphone recording is unavailable. You can type your question.');
  const active=await navigator.mediaDevices.getUserMedia({audio:true});stream.current=active;if(!mounted.current){active.getTracks().forEach(track=>track.stop());return;}
  if(saved.current){await discard({storageId:saved.current}).catch(()=>undefined);saved.current=undefined;}setAudio(null);
  const mime=['audio/webm','audio/mp4'].find(type=>MediaRecorder.isTypeSupported(type));if(!mime)throw new Error('Recording is unavailable in this browser.');
  const chunks:BlobPart[]=[];const next=new MediaRecorder(active,{mimeType:mime});recorder.current=next;next.ondataavailable=event=>{if(event.data.size)chunks.push(event.data);};
  next.onstop=()=>{active.getTracks().forEach(track=>track.stop());if(timer.current)clearTimeout(timer.current);if(!mounted.current)return;setRecording(false);const blob=new Blob(chunks,{type:mime});if(blob.size){setAudio({blob,url:URL.createObjectURL(blob)});saved.current=undefined;}};
  next.start();setRecording(true);timer.current=setTimeout(()=>{if(next.state==='recording')next.stop();},119000);
 }catch(cause){stream.current?.getTracks().forEach(track=>track.stop());setError(cause instanceof Error?cause.message:'Recording failed.');}finally{lock.current=false;}}
 async function convert(){if(!audio||lock.current||recording)return;lock.current=true;setBusy(true);setError('');try{
  let id=saved.current;
  if(!id){const wav=await recordingBlobToWav(audio.blob);const response=await fetch(await issue({}),{method:'POST',headers:{'Content-Type':'audio/wav'},body:wav,signal:AbortSignal.timeout(60000)});if(!response.ok)throw new Error(sw?'Sauti haijapakiwa. Jaribu tena.':'Recording upload failed. Please try again.');const result=await response.json();if(!result.storageId)throw new Error('Upload was not confirmed.');id=result.storageId as Id<'_storage'>;saved.current=id;}
  const text=await transcribe({storageId:id,consent:true});
  if(mounted.current){onText(text);setAudio(null);}
  await discard({storageId:id}).catch(()=>undefined);saved.current=undefined;
 }catch{if(mounted.current)setError(sw?'Unukuzi haujakamilika. Jaribu tena au andika swali lako.':'Transcription did not finish. Try again or type your question.');}finally{lock.current=false;if(mounted.current)setBusy(false);}}
 async function remove(){if(saved.current)await discard({storageId:saved.current}).catch(()=>undefined);saved.current=undefined;setAudio(null);setError('');}
 return <div className="mb-2 text-xs text-stone-500"><div className="flex flex-wrap items-center gap-2"><button type="button" disabled={disabled||busy} onClick={()=>recording?recorder.current?.stop():void start()} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 hover:bg-stone-50 disabled:opacity-40">{recording?<Square size={15}/>:<Mic size={15}/>} {recording?(sw?'Simamisha rekodi':'Stop recording'):(sw?'Uliza kwa sauti':'Ask by voice')}</button><label className="inline-flex min-h-10 cursor-pointer items-center px-2">{sw?'Chagua rekodi':'Choose a recording'}<input className="sr-only" aria-label={sw?'Chagua rekodi ya sauti':'Choose voice recording'} type="file" accept="audio/wav,audio/mp4,audio/x-m4a,.m4a" disabled={disabled||busy||recording} onChange={event=>{const file=event.target.files?.[0];if(!file)return;if(file.size>10*1024*1024){setError(sw?'Rekodi isizidi MB 10.':'Recording must be under 10 MB.');return;}if(saved.current)void discard({storageId:saved.current}).catch(()=>undefined);setAudio({blob:file,url:URL.createObjectURL(file)});saved.current=undefined;setError('');}}/></label>{recording&&<span role="status">{sw?'Inarekodi · hadi dakika mbili':'Recording · up to two minutes'}</span>}</div>
 {audio&&<div className="space-y-2 rounded-xl border border-stone-200 p-3"><audio controls src={audio.url} className="h-9 w-full" aria-label={sw?'Sikiliza rekodi':'Recording preview'}/><p>{sw?'Badili sauti kuwa maandishi kwa OpenAI. Kagua na uhariri maandishi kabla ya kutuma swali.':'Transcribe this recording with OpenAI. Review and edit the text before sending your question.'}</p><div className="flex gap-3"><button type="button" disabled={busy||disabled||recording} onClick={()=>void convert()} className="min-h-10 font-medium text-primary">{busy?(sw?'Inanukuu…':'Transcribing…'):(sw?'Nimekubali, nukuu':'I agree, transcribe')}</button><button type="button" disabled={busy} onClick={()=>void remove()} className="inline-flex min-h-10 items-center gap-1"><X size={14}/>{sw?'Ondoa':'Discard'}</button></div></div>}{error&&<p role="alert" className="mt-2 text-primary">{error}</p>}</div>;
}
