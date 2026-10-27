import assert from "node:assert/strict";
import test from "node:test";
import {
  harness,
  loadHandlerModule,
} from "./test-support/convex-handler-harness.mjs";
const api = loadHandlerModule("convex/aiUsage.ts");
const pricing = loadHandlerModule("convex/lib/aiPricing.ts");
async function limited(value, fn) {
  const prior = process.env.SAADA_MONTHLY_BUDGET_USD;
  try {
    if (value === undefined) delete process.env.SAADA_MONTHLY_BUDGET_USD;
    else process.env.SAADA_MONTHLY_BUDGET_USD = value;
    await fn();
  } finally {
    if (prior === undefined) delete process.env.SAADA_MONTHLY_BUDGET_USD;
    else process.env.SAADA_MONTHLY_BUDGET_USD = prior;
  }
}
const request = {
  feature: "test",
  model: "gpt-4o",
  estimateMicroUsd: 600000,
  priced: true,
};
test("budget input is explicit; empty means monitoring and invalid limits fail closed", () => {
  assert.equal(pricing.monthlyLimitMicroUsd(undefined), null);
  assert.equal(pricing.monthlyLimitMicroUsd("1.25"), 1250000);
  for (const value of ["0", "-2", "NaN", "1.234", "Infinity"])
    assert.throws(() => pricing.monthlyLimitMicroUsd(value));
  assert.equal(pricing.costMicroUsd("gpt-4o", 100, 2), 270);
  assert.equal(pricing.costMicroUsd("unpriced", 100, 2), null);
  assert.ok(
    pricing.quoteMicroUsd(
      "gpt-4o-mini",
      [{ type: "image_url", image_url: { url: "data:small" } }],
      600,
    ) > 15000,
  );
});
test("reservations share a monthly allowance and settlement releases excess exactly once", async () =>
  limited("1", async () => {
    const h = harness(),
      u = await h.user();
    const id = await h.invoke(api.reserve, request, u);
    await assert.rejects(h.invoke(api.reserve, request, u), /allowance/);
    await h.invoke(
      api.settle,
      { id, actualMicroUsd: 100000, inputTokens: 20, outputTokens: 1 },
      u,
    );
    await h.invoke(api.settle, { id, actualMicroUsd: 0 }, u);
    const row = (await h.db.query("ai_usage_months").collect())[0];
    assert.equal(row.committedMicroUsd, 100000);
    assert.equal(row.reservedMicroUsd, 0);
    await h.invoke(api.reserve, request, u);
    assert.equal((await h.db.query("ai_usage_months").collect()).length, 1);
  }));
test("failed known-price calls retain their conservative cost and history deletion does not reset it", async () =>
  limited("1", async () => {
    const h = harness(),
      u = await h.user(),
      id = await h.invoke(api.reserve, request, u);
    await h.invoke(api.settle, { id }, u);
    assert.equal((await h.db.get(id)).status, "uncertain");
    const chat = await h.db.insert("sara_chats", { tokens: 9999 });
    h.records.delete(chat);
    assert.equal(
      (await h.db.query("ai_usage_months").collect())[0].committedMicroUsd,
      600000,
    );
    await assert.rejects(h.invoke(api.reserve, request, u), /allowance/);
  }));
test("unpriced or pending audio cannot bypass an enabled cap; monitoring records known duration costs", async () =>
  limited(undefined, async () => {
    const h = harness(),
      u = await h.user();
    const id = await h.invoke(
      api.reserve,
      { ...request, model: "whisper-1", estimateMicroUsd: 0, priced: false },
      u,
    );
    process.env.SAADA_MONTHLY_BUDGET_USD = "1";
    await assert.rejects(
      h.invoke(api.reserve, request, u),
      /cannot be bounded/,
    );
    delete process.env.SAADA_MONTHLY_BUDGET_USD;
    await h.invoke(api.settle, { id, actualMicroUsd: 6000 }, u);
    assert.equal(
      (await h.db.query("ai_usage_months").collect())[0].unpricedCalls,
      0,
    );
    process.env.SAADA_MONTHLY_BUDGET_USD = "1";
    await assert.rejects(
      h.invoke(api.reserve, { ...request, priced: false }, u),
      /cannot be bounded/,
    );
  }));
test("unsettled and underestimated requests stay visible and cannot free allowance", async () =>
  limited("1", async () => {
    const h = harness(),
      u = await h.user();
    const id = await h.invoke(
      api.reserve,
      { ...request, estimateMicroUsd: 100 },
      u,
    );
    await h.invoke(api.settle, { id, actualMicroUsd: 200 }, u);
    await assert.rejects(
      h.invoke(api.reserve, request, u),
      /cannot be bounded/,
    );
  }));
test("only staff can read aggregate costs; users cannot settle another owner or call as guest", async () =>
  limited(undefined, async () => {
    const h = harness(),
      u = await h.user(),
      other = await h.user(),
      admin = await h.user("admin");
    const id = await h.invoke(api.reserve, request, u);
    await assert.rejects(
      h.invoke(api.settle, { id, actualMicroUsd: 1 }, other),
      /access denied/,
    );
    await assert.rejects(h.invoke(api.reserve, request), /Unauthorized/);
    await assert.rejects(h.invoke(api.status, {}, u), /Forbidden/);
    const status = await h.invoke(api.status, {}, admin);
    assert.equal(status.mode, "monitoring");
    assert.equal(status.reservedEstimateUSD, 0.6);
    assert.equal(status.alert, "limit_not_configured");
    assert.doesNotMatch(JSON.stringify(status), /ownerClerkId|clerk|test:/);
  }));
