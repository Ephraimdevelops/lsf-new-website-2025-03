"use node";
import {internalAction} from './_generated/server';
import {internal} from './_generated/api';
import {v} from 'convex/values';
import OpenAI,{toFile} from 'openai';
import {createHash} from 'node:crypto';
import {meteredAi} from './lib/meteredAi';
import {recordingDuration} from './lib/audioDuration';
import {metaAudioUrl,boundedAudio,opusDuration,SOCIAL_AUDIO_LIMIT} from './lib/socialAudio';
export const transcribe=internalAction({args:{id:v.id('social_messages')},handler:async(ctx,{id})=>{
 const row=await ctx.runMutation(internal.socialMessaging.claimTranscription,{id});if(!row)return;
 try{
  if(row.account!==process.env.META_WHATSAPP_PHONE_ID||!process.env.META_WHATSAPP_TOKEN||!process.env.OPENAI_API_KEY||!/^\d{5,40}$/.test(row.mediaId!))throw new Error('Voice unavailable');
  const version=process.env.META_GRAPH_VERSION;if(!version||!/^v\d+\.\d+$/.test(version))throw new Error('Invalid Graph version');
  const headers={Authorization:'Bearer '+process.env.META_WHATSAPP_TOKEN};
  const response=await fetch('https://graph.facebook.com/'+version+'/'+row.mediaId+'?phone_number_id='+row.account,{headers,redirect:'error',signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw new Error('Media metadata unavailable');const media=await response.json();
  const mime=String(media.mime_type??'').split(';')[0].trim().toLowerCase();
  if(!['audio/ogg','audio/wav','audio/x-wav','audio/mp4','audio/m4a'].includes(mime)||!Number.isSafeInteger(media.file_size)||media.file_size<=0||media.file_size>SOCIAL_AUDIO_LIMIT||media.id!==row.mediaId)throw new Error('Unsupported audio');
  const bytes=await boundedAudio(await fetch(metaAudioUrl(media.url),{headers,redirect:'error',signal:AbortSignal.timeout(15000)}));
  const hash=createHash('sha256').update(bytes);const digest=/^[a-f0-9]{64}$/i.test(media.sha256??'')?hash.digest('hex'):/^[A-Za-z0-9+/]{43}=$/.test(media.sha256??'')?hash.digest('base64'):null;
  if(bytes.length!==media.file_size||!digest||digest!==media.sha256)throw new Error('Media integrity mismatch');
  const duration=mime==='audio/ogg'?opusDuration(bytes):recordingDuration(bytes,mime);
  if(!await ctx.runQuery(internal.socialMessaging.hasConsent,{id}))throw new Error('Consent changed');
  const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY,timeout:30000,maxRetries:0});
  const file=await toFile(bytes,mime==='audio/ogg'?'voice.ogg':mime.includes('wav')?'voice.wav':'voice.m4a',{type:mime});
  const result=await meteredAi(ctx,{socialMessageId:id,feature:'social_transcription',model:'whisper-1',input:'bounded_voice_note',maxOutputTokens:0,audioDurationSeconds:duration},()=>client.audio.transcriptions.create({model:'whisper-1',file,response_format:'verbose_json',language:row.transcriptionLocale??'sw',prompt:row.transcriptionLocale==='en'?'A conversation with Haki Yangu AI at Legal Services Facility, LSF, Tanzania.':'Mazungumzo ya Kiswahili na Haki Yangu AI, Legal Services Facility, LSF, Tanzania.'},{timeout:30000}));
  const unclear=result.segments?.some(segment=>segment.no_speech_prob>0.6||segment.avg_logprob< -1||segment.compression_ratio>2.4);
  await ctx.runMutation(internal.socialMessaging.finishTranscription,{id,...(!unclear?{text:result.text}:{})});
 }catch{await ctx.runMutation(internal.socialMessaging.finishTranscription,{id});}
}});
