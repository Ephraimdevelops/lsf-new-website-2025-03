export function prepareSaadaHistory(
  stored: Array<{ role: "user" | "assistant"; content: string }>,
  currentMessage: string,
) {
  const turns = stored[stored.length - 1]?.role === "user"
    && stored[stored.length - 1]?.content === currentMessage
    ? stored.slice(0, -1) : stored;
  return turns.filter((turn) => turn.content.trim()).slice(-10)
    .map((turn) => ({ role: turn.role, content: turn.content.slice(0, 2000) }));
}
