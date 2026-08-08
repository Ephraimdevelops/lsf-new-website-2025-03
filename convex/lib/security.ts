import { ConvexError } from "convex/values";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function stripControlCharacters(value: string) {
  return Array.from(value)
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127);
    })
    .join("");
}

export const allowedUploadMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export function normalizeText(value: string, field: string, maxLength: number) {
  const normalized = stripControlCharacters(value).trim();
  if (!normalized) throw new ConvexError(`${field} is required`);
  if (normalized.length > maxLength) {
    throw new ConvexError(`${field} must be ${maxLength} characters or fewer`);
  }
  return normalized;
}

export function normalizeOptionalText(
  value: string | undefined,
  field: string,
  maxLength: number,
) {
  if (value === undefined) return undefined;
  const normalized = stripControlCharacters(value).trim();
  if (!normalized) return undefined;
  if (normalized.length > maxLength) {
    throw new ConvexError(`${field} must be ${maxLength} characters or fewer`);
  }
  return normalized;
}

export function normalizeEmail(value: string, field = "Email") {
  const email = normalizeText(value, field, 254).toLowerCase();
  if (!EMAIL_RE.test(email)) throw new ConvexError(`${field} is invalid`);
  return email;
}

export function normalizeOptionalEmail(value: string | undefined, field = "Email") {
  if (value === undefined) return undefined;
  return normalizeEmail(value, field);
}

export function escapeHtml(value: string | undefined) {
  return (value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function escapeHtmlWithLineBreaks(value: string | undefined) {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

export function assertAllowedUpload(args: {
  name: string;
  type: string;
  size: number;
  maxBytes: number;
}) {
  const name = normalizeText(args.name, "File name", 180);
  const type = normalizeText(args.type, "File type", 120).toLowerCase();

  if (!Number.isFinite(args.size) || args.size <= 0) {
    throw new ConvexError("File size is invalid");
  }
  if (args.size > args.maxBytes) {
    throw new ConvexError(`File size exceeds ${(args.maxBytes / (1024 * 1024)).toFixed(0)}MB limit`);
  }
  if (!allowedUploadMimeTypes.has(type)) {
    throw new ConvexError("File type is not allowed");
  }
  if (/\.(php|phtml|phar|cgi|pl|alfa|sh|html?|svg)$/i.test(name)) {
    throw new ConvexError("File extension is not allowed");
  }

  return { name, type };
}

const dangerousHtmlBlocks =
  /<\s*(script|style|iframe|object|embed|link|meta|base|form|input|button|textarea|select|option|svg|math)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi;
const dangerousSelfClosingTags =
  /<\s*(script|style|iframe|object|embed|link|meta|base|form|input|button|textarea|select|option|svg|math)\b[^>]*\/?\s*>/gi;
const tagRe = /<\/?([a-zA-Z0-9-]+)([^>]*)>/g;
const attrRe = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;

const allowedHtmlTags = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "img",
  "figure",
  "figcaption",
  "span",
]);

const allowedHtmlAttrs: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel", "class"]),
  img: new Set(["src", "alt", "title", "class"]),
  p: new Set(["class"]),
  span: new Set(["class"]),
  blockquote: new Set(["class"]),
  figure: new Set(["class"]),
  figcaption: new Set(["class"]),
};

function isSafeUrl(value: string, allowDataImage = false) {
  const trimmed = value.trim().replace(/\s+/g, "");
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(trimmed)) return true;
  return allowDataImage && /^data:image\/(png|jpeg|jpg|gif|webp);base64,/i.test(trimmed);
}

export function sanitizeRichHtml(value: string, maxLength = 100_000) {
  const bounded = normalizeText(value, "HTML content", maxLength);
  const withoutDangerousBlocks = bounded
    .replace(dangerousHtmlBlocks, "")
    .replace(dangerousSelfClosingTags, "");

  return withoutDangerousBlocks.replace(tagRe, (original, rawTag: string, rawAttrs: string) => {
    const tag = rawTag.toLowerCase();
    if (!allowedHtmlTags.has(tag)) return "";
    if (original.startsWith("</")) return `</${tag}>`;
    if (tag === "br") return "<br>";

    const allowedAttrs = allowedHtmlAttrs[tag] || new Set<string>();
    const safeAttrs: string[] = [];
    for (const match of rawAttrs.matchAll(attrRe)) {
      const attr = match[1].toLowerCase();
      const rawValue = match[3] ?? match[4] ?? match[5] ?? "";
      if (attr.startsWith("on") || !allowedAttrs.has(attr)) continue;
      if ((attr === "href" || attr === "src") && !isSafeUrl(rawValue, attr === "src")) continue;
      if (attr === "target" && rawValue !== "_blank") continue;

      safeAttrs.push(`${attr}="${escapeHtml(rawValue)}"`);
    }

    if (tag === "a") {
      const hasTargetBlank = safeAttrs.includes('target="_blank"');
      const hasRel = safeAttrs.some((attr) => attr.startsWith("rel="));
      if (hasTargetBlank && !hasRel) safeAttrs.push('rel="noopener noreferrer"');
    }

    return `<${tag}${safeAttrs.length ? ` ${safeAttrs.join(" ")}` : ""}>`;
  });
}
