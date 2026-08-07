const allowedTags = new Set([
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

const allowedAttrs: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel", "class"]),
  img: new Set(["src", "alt", "title", "class"]),
  p: new Set(["class"]),
  span: new Set(["class"]),
  blockquote: new Set(["class"]),
  figure: new Set(["class"]),
  figcaption: new Set(["class"]),
};

function isSafeUrl(value: string, allowDataImage = false) {
  const compact = value.trim().replace(/\s+/g, "");
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(compact)) return true;
  return allowDataImage && /^data:image\/(png|jpeg|jpg|gif|webp);base64,/i.test(compact);
}

function sanitizeElement(element: Element) {
  const tag = element.tagName.toLowerCase();

  if (!allowedTags.has(tag)) {
    element.replaceWith(...Array.from(element.childNodes));
    return;
  }

  const tagAllowedAttrs = allowedAttrs[tag] || new Set<string>();
  for (const attr of Array.from(element.attributes)) {
    const name = attr.name.toLowerCase();
    const value = attr.value;

    if (name.startsWith("on") || !tagAllowedAttrs.has(name)) {
      element.removeAttribute(attr.name);
      continue;
    }

    if ((name === "href" || name === "src") && !isSafeUrl(value, name === "src")) {
      element.removeAttribute(attr.name);
    }
  }

  if (tag === "a" && element.getAttribute("target") === "_blank" && !element.getAttribute("rel")) {
    element.setAttribute("rel", "noopener noreferrer");
  }
}

export function sanitizeHtml(html: string | null | undefined) {
  if (!html) return "";
  if (typeof DOMParser === "undefined") {
    return html.replace(/<\s*script\b[\s\S]*?<\s*\/\s*script\s*>/gi, "");
  }

  const doc = new DOMParser().parseFromString(html, "text/html");
  for (const element of Array.from(doc.body.querySelectorAll("*"))) {
    sanitizeElement(element);
  }
  return doc.body.innerHTML;
}
