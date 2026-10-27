export const uploadPurposes = ["application", "request_attachment", "case_document", "personal_document", "case_voice", "saada_audio", "referral_consent", "profile_photo", "public_media", "ai_source"] as const;
export type UploadPurpose = typeof uploadPurposes[number];
const documents = ["application/pdf", "image/jpeg", "image/png"];
const office = ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const caseFiles = [...documents, ...office, "image/webp", "image/gif"];
const audio = ["audio/mp4", "audio/m4a", "audio/mpeg", "audio/webm", "audio/wav", "audio/x-wav"];

export function uploadPolicy(purpose: UploadPurpose) {
  if (!uploadPurposes.includes(purpose)) throw new Error("Unknown upload purpose.");
  const types = (purpose === "case_voice" || purpose === "saada_audio") ? audio : purpose === "request_attachment" ? [...caseFiles, "text/plain", ...audio]
    : purpose === "case_document" ? caseFiles
    : purpose === "personal_document" ? [...documents, "image/webp"]
    : purpose === "profile_photo" ? ["image/jpeg", "image/png", "image/webp"]
    : purpose === "ai_source" ? ["application/pdf"]
    : purpose === "public_media" ? [...documents, "image/webp", "image/gif", ...office] : documents;
  return { types, maxBytes: (purpose === "public_media" || purpose === "ai_source" ? 20 : 10) * 1024 * 1024 };
}

export async function digestBytes(bytes: Uint8Array) {
  const hash = await crypto.subtle.digest("SHA-256", bytes as BufferSource);
  return Array.from(new Uint8Array(hash), n => n.toString(16).padStart(2, "0")).join("");
}

export function validateFileSignature(bytes: Uint8Array, type: string) {
  if (type === "text/plain") {
    if (bytes.includes(0)) throw new Error("Text files must contain UTF-8 text.");
    new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return;
  }
  const starts = (...values: number[]) => values.every((n, i) => bytes[i] === n);
  const text = (offset: number, length: number) => String.fromCharCode(...bytes.slice(offset, offset + length));
  const valid = type === "application/pdf" ? text(0, 5) === "%PDF-"
    : type === "image/png" ? starts(137, 80, 78, 71, 13, 10, 26, 10)
    : type === "image/jpeg" ? starts(255, 216, 255)
    : type === "image/gif" ? ["GIF87a", "GIF89a"].includes(text(0, 6))
    : type === "image/webp" ? text(0, 4) === "RIFF" && text(8, 4) === "WEBP"
    : ["audio/wav", "audio/x-wav"].includes(type) ? text(0, 4) === "RIFF" && text(8, 4) === "WAVE"
    : ["audio/mp4", "audio/m4a"].includes(type) ? text(4, 4) === "ftyp"
    : type === "audio/webm" ? starts(26, 69, 223, 163)
    : type === "audio/mpeg" ? text(0, 3) === "ID3" || bytes[0] === 255 && (bytes[1] & 224) === 224
    : type === "application/msword" ? starts(208, 207, 17, 224, 161, 177, 26, 225)
    : type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? starts(80, 75, 3, 4) : false;
  if (!valid) throw new Error("File contents do not match the selected format.");
}

export async function readBoundedBody(request: Request, maximum: number) {
  if (!request.body) throw new Error("Empty upload.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maximum) throw new Error("File exceeds the upload size limit.");
      chunks.push(value);
    }
  } catch (error) { await reader.cancel(); throw error; }
  if (!length) throw new Error("Empty upload.");
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return bytes;
}
