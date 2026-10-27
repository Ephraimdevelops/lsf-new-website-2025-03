import test from "node:test";
import assert from "node:assert/strict";
import { monthlySaadaTokens } from "../convex/lib/saadaCosts.ts";
const now = Date.UTC(2026, 9, 16);
test("month usage excludes older and future records and user messages", () => {
  assert.equal(
    monthlySaadaTokens(
      [
        { role: "assistant", timestamp: Date.UTC(2026, 8, 30), tokens: 1000 },
        { role: "assistant", timestamp: Date.UTC(2026, 9, 1), tokens: 50 },
        { role: "assistant", timestamp: now, tokens: 25 },
        { role: "assistant", timestamp: now + 1, tokens: 100 },
        { role: "user", timestamp: now, tokens: 100 },
      ],
      now,
    ),
    75,
  );
});
test("missing and invalid token fields cannot corrupt the usage calculation", () => {
  for (const tokens of [undefined, -1, NaN, Infinity, 1.5])
    assert.equal(
      monthlySaadaTokens([{ role: "assistant", timestamp: now, tokens }], now),
      0,
    );
});
test("month resets at a UTC calendar boundary, including the new year", () => {
  assert.equal(
    monthlySaadaTokens(
      [
        {
          role: "assistant",
          timestamp: Date.UTC(2026, 11, 31, 23, 59),
          tokens: 50,
        },
      ],
      Date.UTC(2027, 0, 1),
    ),
    0,
  );
});

const { build } = await import("esbuild");
const compiled = await build({
  entryPoints: ["convex/managedUploads.ts"],
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
});
const managed = await import(
  "data:text/javascript;base64," +
    Buffer.from(compiled.outputFiles[0].text).toString("base64")
);
function rateFixture() {
  const records = new Map();
  const user = { _id: "alice", isDeleted: false };
  const ctx = {
    auth: { getUserIdentity: async () => ({ subject: "clerk-alice" }) },
    db: {
      query(table) {
        let identifier;
        const q = {
          withIndex(_name, cb) {
            cb({
              eq(_field, value) {
                identifier = value;
                return this;
              },
            });
            return q;
          },
          unique: async () => user,
          first: async () => records.get(identifier) ?? null,
        };
        return q;
      },
      insert: async (_table, row) => {
        records.set(row.identifier, { ...row, _id: row.identifier });
        return row.identifier;
      },
      patch: async (id, fields) =>
        records.set(id, { ...records.get(id), ...fields }),
    },
  };
  return { ctx, records, user };
}
test("actual AI admission rejects the eleventh request in a minute", async () => {
  const f = rateFixture();
  for (let i = 0; i < 10; i++)
    await managed.reserveAiRequest._handler(f.ctx, {});
  await assert.rejects(
    managed.reserveAiRequest._handler(f.ctx, {}),
    /RATE_LIMITED|wait/,
  );
  assert.equal(f.records.get("ai-minute:alice").count, 10);
});
test("actual AI admission enforces the separate daily allowance", async () => {
  const f = rateFixture();
  f.records.set("ai-day:alice", {
    _id: "ai-day:alice",
    count: 100,
    windowStart: Date.now(),
  });
  await assert.rejects(
    managed.reserveAiRequest._handler(f.ctx, {}),
    /RATE_LIMITED|wait/,
  );
});
test("AI admission rejects guests and deactivated users before recording allowance", async () => {
  const f = rateFixture();
  f.ctx.auth.getUserIdentity = async () => null;
  await assert.rejects(
    managed.reserveAiRequest._handler(f.ctx, {}),
    /Unauthorized/,
  );
  f.ctx.auth.getUserIdentity = async () => ({ subject: "clerk-alice" });
  f.user.isDeleted = true;
  await assert.rejects(
    managed.reserveAiRequest._handler(f.ctx, {}),
    /Unauthorized/,
  );
  assert.equal(f.records.size, 0);
});
