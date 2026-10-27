"use node";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v, ConvexError } from "convex/values";
import OpenAI, { toFile } from "openai";
import { recordingDuration } from "./lib/audioDuration";
import { meteredAi } from "./lib/meteredAi";
import { readSpeechStream } from "./lib/speechStream";
import { SAADA_SPEECH_MODEL, SAADA_SPEECH_VOICE, SAADA_SPEECH_INSTRUCTIONS } from "./lib/saadaSpeech";

export const transcribe = action({args:{storageId:v.id("_storage"),consent:v.boolean(),locale:v.optional(v.union(v.literal("en"),v.literal("sw")))},handler:async(ctx,args):Promise<string>=>{
  if(!await ctx.auth.getUserIdentity()) throw new ConvexError("Sign in to transcribe.");
  const recording=await ctx.runMutation(internal.saadaMedia.reserveAudio,{storageId:args.storageId,consent:args.consent});
  await ctx.runMutation(internal.managedUploads.reserveAiRequest,{});
  if(!process.env.OPENAI_API_KEY) throw new ConvexError("Voice transcription is unavailable. You can type your question.");
  const blob=await ctx.storage.get(args.storageId);
  if(!blob || blob.size>10*1024*1024) throw new ConvexError("Recording unavailable.");
  const bytes=new Uint8Array(await blob.arrayBuffer());
  recordingDuration(bytes,recording.type); // Validate before reserving the full two-minute cost allowance.
  const file=await toFile(bytes,recording.type.includes("wav")?"question.wav":"question.m4a",{type:recording.type});
  const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY,timeout:45000,maxRetries:0});
  const result=await meteredAi(ctx,{feature:"saada_transcription",model:"whisper-1",input:"bounded_recording",maxOutputTokens:0,audioDurationSeconds:120},()=>client.audio.transcriptions.create({file,model:"whisper-1",response_format:"verbose_json",...(args.locale?{language:args.locale}:{})}));
  const text=result.text.trim();
  if(!text) throw new ConvexError("No words were detected. Try again or type your question.");
  if(text.length>5000) throw new ConvexError("The transcript is too long. Record a shorter question.");
  return text;
}});

export const speak = action({
  args: { messageId: v.id('sara_chats'), partIndex: v.number(), consent: v.boolean() },
  handler: async (ctx, args): Promise<{ audioBase64: string; partCount: number }> => {
    if (!await ctx.auth.getUserIdentity()) throw new ConvexError('Sign in to listen to answers.');
    const section = await ctx.runMutation(internal.saadaMedia.reserveSpeech, args);
    await ctx.runMutation(internal.managedUploads.reserveAiRequest, {});
    if (!process.env.OPENAI_API_KEY) throw new ConvexError('Spoken answers are unavailable. You can read the answer in chat.');
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 45000, maxRetries: 0 });
    try {
      // Conservative application estimate, not a provider-enforced output limit.
      // The final SSE usage receipt reconciles text-input and audio-output tokens.
      const result = await meteredAi(ctx, {
        feature: 'saada_speech', model: SAADA_SPEECH_MODEL,
        input: { text: section.text, instructions: SAADA_SPEECH_INSTRUCTIONS }, maxOutputTokens: 16384,
      }, async () => readSpeechStream(await client.audio.speech.create({
        model: SAADA_SPEECH_MODEL, voice: SAADA_SPEECH_VOICE, input: section.text,
        instructions: SAADA_SPEECH_INSTRUCTIONS, response_format: 'mp3', stream_format: 'sse',
      }, { signal: AbortSignal.timeout(45000) })));
      // Inline to the authenticated caller only. No public storage URL or transcript logs.
      return { audioBase64: result.audioBase64, partCount: section.partCount };
    } catch (error) {
      if (error instanceof OpenAI.APIError) throw new ConvexError('Spoken audio is unavailable right now. Please try again.');
      throw error;
    }
  },
});
