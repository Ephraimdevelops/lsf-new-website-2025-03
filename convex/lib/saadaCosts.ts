// A usage guard, not an invoice or hard monetary spending limit.
// UTC calendar months align the accounting window with a stable server boundary.
export function monthlySaadaTokens(
  rows: Array<{ role: string; timestamp: number; tokens?: number }>,
  now = Date.now(),
) {
  const date = new Date(now);
  const monthStart = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1);
  return rows.reduce((total, row) => {
    if (
      row.role !== "assistant" ||
      row.timestamp < monthStart ||
      row.timestamp > now ||
      !Number.isSafeInteger(row.tokens) ||
      (row.tokens ?? 0) < 0
    )
      return total;
    return total + (row.tokens ?? 0);
  }, 0);
}
