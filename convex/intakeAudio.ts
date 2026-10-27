"use node";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { ConvexError, v } from "convex/values";
import OpenAI, { toFile } from "openai";
import { recordingDuration } from "./lib/audioDuration";
import { meteredAi } from "./lib/meteredAi";

export const transcribe = action({
  args: { requestId: v.id("legal_help_requests"), attachmentId: v.id("request_attachments"), locale: v.union(v.literal("sw"), v.literal("en")), consent: v.boolean() },
  handler: async (ctx, args): Promise<string> => {
    if (!await ctx.auth.getUserIdentity()) throw new ConvexError("Sign in to transcribe");
    if (!args.consent) throw new ConvexError("Recording transcription requires consent");
    if (!process.env.OPENAI_API_KEY) throw new ConvexError("Voice transcription is unavailable. You can still type your answer.");
    const recording = await ctx.runMutation(internal.legalHelp.reserveTranscription, { requestId: args.requestId, attachmentId: args.attachmentId });
    if (!recording.url) throw new ConvexError("Recording is unavailable");
    const response = await fetch(recording.url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new ConvexError("Unable to read recording");
    const bytes = new Uint8Array(await response.arrayBuffer());
    recordingDuration(bytes, recording.type!); // Validate before reserving the full two-minute cost allowance.
    const file = await toFile(bytes, recording.name, { type: recording.type });
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 60000, maxRetries: 0 });
      const result = await meteredAi(ctx, { feature: "transcription", model: "whisper-1", input: "bounded_recording", maxOutputTokens: 0, audioDurationSeconds: 120 }, () => client.audio.transcriptions.create({ file, model: "whisper-1", language: args.locale, response_format: "verbose_json" }));
      return result.text.trim().slice(0, 5000);
    } catch {
      throw new ConvexError("Transcription failed. Your recording is kept; try again or type your answer.");
    }
  },
});
