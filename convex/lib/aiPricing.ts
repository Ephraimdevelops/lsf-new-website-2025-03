// Standard list-rate snapshot, 2026-10-16. Estimates are not provider invoices.
// Microdollars per token; cached tokens are deliberately charged at full input rate.
const rates: Record<string, [number, number]> = {
  "gpt-4o": [2.5, 10],
  "gpt-4o-mini": [0.15, 0.6],
  // Speech input text tokens and output audio tokens, official list rates 2026-10-19.
  "gpt-4o-mini-tts": [0.6, 12],
  "text-embedding-3-small": [0.02, 0],
};
export function costMicroUsd(model: string, input: number, output: number) {
  if (
    !rates[model] ||
    !Number.isFinite(input) ||
    !Number.isFinite(output) ||
    input < 0 ||
    output < 0
  )
    return null;
  return Math.ceil(input * rates[model][0] + output * rates[model][1]);
}
export function quoteMicroUsd(
  model: string,
  input: unknown,
  maxOutputTokens: number,
) {
  // UTF-8 bytes plus envelope overhead is intentionally conservative for text.
  // Include schemas/messages; inline image base64 is over-reserved, then reconciled.
  let images = 0;
  const countImages = (value: unknown): void => {
    if (!value || typeof value !== "object") return;
    if ((value as { type?: string }).type === "image_url") images++;
    for (const child of Object.values(value)) countImages(child);
  };
  countImages(input);
  const bytes = new TextEncoder().encode(JSON.stringify(input)).byteLength;
  return costMicroUsd(model, bytes + 4096 + images * 100000, maxOutputTokens);
}
export function monthlyLimitMicroUsd(value: string | undefined) {
  if (value === undefined || value.trim() === "") return null;
  if (!/^\d+(\.\d{1,2})?$/.test(value.trim()))
    throw new Error("Invalid AI monthly budget configuration.");
  const limit = Math.round(Number(value) * 1_000_000);
  if (!Number.isSafeInteger(limit) || limit <= 0)
    throw new Error("Invalid AI monthly budget configuration.");
  return limit;
}
