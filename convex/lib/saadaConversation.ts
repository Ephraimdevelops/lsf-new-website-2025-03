type Turn = { role: "user" | "assistant"; content: string };

// Keep whole recent turns within a predictable cost budget. Empty in-flight replies
// must be removed before detecting the client-saved current user message.
export function prepareSaadaHistory(stored: Turn[], currentMessage: string) {
  const completed = stored.filter(turn => turn.content.trim());
  const turns = completed.at(-1)?.role === "user" && completed.at(-1)?.content === currentMessage
    ? completed.slice(0, -1) : completed;
  let remaining = 16_000;
  const selected: Turn[] = [];
  for (const turn of turns.slice(-24).reverse()) {
    const content = turn.content.slice(0, 3000);
    if (content.length > remaining) break;
    selected.unshift({role: turn.role, content});
    remaining -= content.length;
  }
  return selected;
}

// Short follow-ups such as "what next?" need the person's earlier issue and
// location in retrieval, not just in the final model's conversation.
export function contextualSaadaSearch(message: string, history: Turn[]) {
  const earlier = history.filter(turn => turn.role === "user").slice(-3)
    .map(turn => turn.content.slice(0, 350));
  return [...earlier, message].join("\n").slice(-1800);
}

export function introduceSaada(content: string, locale: "en" | "sw", history: Turn[]) {
  if (history.some(turn => turn.role === "assistant" && turn.content.trim()) || /(?:I[’']m|Naitwa) Haki Yangu AI/.test(content)) return content;
  return (locale === "en"
    ? "I'm Haki Yangu AI, LSF's AI assistant."
    : "Naitwa Haki Yangu AI, msaidizi wa LSF anayetumia AI.") + "\n\n" + content;
}
