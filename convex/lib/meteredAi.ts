import type { ActionCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import { costMicroUsd, quoteMicroUsd } from "./aiPricing";
type Meter = {
  feature: string;
  model: string;
  input: unknown;
  maxOutputTokens: number;
  audioDurationSeconds?: number;
};
function usageOf(result: any) {
  const usage = result?.usage;
  if (!usage) return undefined;
  const input = usage.prompt_tokens ?? usage.input_tokens ?? usage.total_tokens;
  const output = usage.completion_tokens ?? usage.output_tokens ?? 0;
  return Number.isSafeInteger(input) && Number.isSafeInteger(output)
    ? { input, output }
    : undefined;
}
async function reserve(ctx: ActionCtx, meter: Meter) {
  const duration = meter.audioDurationSeconds;
  const quote = meter.model === "whisper-1" && duration !== undefined && Number.isFinite(duration) && duration > 0 && duration <= 120
    ? Math.ceil((Math.ceil(duration) + 1) * 100)
    : quoteMicroUsd(meter.model, meter.input, meter.maxOutputTokens);
  return ctx.runMutation(internal.aiUsage.reserve, {
    feature: meter.feature,
    model: meter.model,
    estimateMicroUsd: quote ?? 0,
    priced: quote !== null,
  });
}
async function settle(
  ctx: ActionCtx,
  id: any,
  model: string,
  usage?: { input: number; output: number },
  audioSeconds?: number,
) {
  const cost = usage
    ? costMicroUsd(model, usage.input, usage.output)
    : model === "whisper-1" &&
        audioSeconds !== undefined &&
        Number.isFinite(audioSeconds) &&
        audioSeconds >= 0
      ? Math.ceil(audioSeconds * 100)
      : null;
  await ctx.runMutation(internal.aiUsage.settle, {
    id,
    ...(cost !== null ? { actualMicroUsd: cost } : {}),
    ...(usage ? { inputTokens: usage.input, outputTokens: usage.output } : {}),
  });
}
export async function meteredAi<T>(
  ctx: ActionCtx,
  meter: Meter,
  call: () => Promise<T>,
): Promise<T> {
  const id = await reserve(ctx, meter);
  let result: T;
  try {
    result = await call();
  } catch (error) {
    await settle(ctx, id, meter.model);
    throw error;
  }
  await settle(
    ctx,
    id,
    meter.model,
    usageOf(result),
    (result as any)?.duration,
  );
  return result;
}
export async function meteredAiStream<T extends { usage?: any }>(
  ctx: ActionCtx,
  meter: Meter,
  call: () => Promise<AsyncIterable<T>>,
): Promise<AsyncIterable<T>> {
  const id = await reserve(ctx, meter);
  let stream: AsyncIterable<T>;
  try {
    stream = await call();
  } catch (error) {
    await settle(ctx, id, meter.model);
    throw error;
  }
  return (async function* () {
    let usage;
    try {
      for await (const chunk of stream) {
        if (chunk.usage) usage = usageOf(chunk);
        yield chunk;
      }
    } finally {
      await settle(ctx, id, meter.model, usage);
    }
  })();
}
