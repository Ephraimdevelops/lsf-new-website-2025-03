import assert from "node:assert/strict";
import test from "node:test";
import { build } from "esbuild";
import { getFunctionName } from "convex/server";
const compiled = await build({
  entryPoints: ["convex/lib/meteredAi.ts"],
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
});
const { meteredAi, meteredAiStream } = await import(
  "data:text/javascript;base64," +
    Buffer.from(compiled.outputFiles[0].text).toString("base64")
);
const meter = {
  feature: "test",
  model: "gpt-4o",
  input: { message: "synthetic" },
  maxOutputTokens: 10,
};
function fixture() {
  const writes = [];
  return {
    writes,
    ctx: {
      runMutation: async (ref, args) => {
        writes.push({ name: getFunctionName(ref), args });
        return "reservation";
      },
    },
  };
}
test("successful calls reserve before sending and settle usage without storing content", async () => {
  const f = fixture();
  await meteredAi(f.ctx, meter, async () => {
    assert.equal(f.writes[0].name, "aiUsage:reserve");
    return { usage: { prompt_tokens: 100, completion_tokens: 2 } };
  });
  assert.equal(f.writes[1].args.actualMicroUsd, 270);
  assert.doesNotMatch(JSON.stringify(f.writes), /synthetic/);
});
test("provider failures retain estimated allowance and cannot disappear from accounting", async () => {
  const f = fixture();
  await assert.rejects(
    meteredAi(f.ctx, meter, async () => {
      throw new Error("provider failed");
    }),
    /provider failed/,
  );
  assert.equal(f.writes[1].name, "aiUsage:settle");
  assert.equal(f.writes[1].args.actualMicroUsd, undefined);
});
test("stream usage settles once at completion; early consumer exit stays conservatively charged", async () => {
  const f = fixture();
  const stream = await meteredAiStream(f.ctx, meter, async () =>
    (async function* () {
      yield { content: "first" };
      yield { usage: { prompt_tokens: 100, completion_tokens: 2 } };
    })(),
  );
  for await (const chunk of stream) {
  }
  assert.equal(f.writes.length, 2);
  assert.equal(f.writes[1].args.actualMicroUsd, 270);
  const g = fixture();
  const early = await meteredAiStream(g.ctx, meter, async () =>
    (async function* () {
      yield { content: "first" };
      yield { usage: { prompt_tokens: 100, completion_tokens: 2 } };
    })(),
  );
  for await (const chunk of early) {
    break;
  }
  assert.equal(g.writes[1].args.actualMicroUsd, undefined);
});
test("budget denial prevents the provider request entirely", async () => {
  let sent = false;
  const ctx = {
    runMutation: async () => {
      throw new Error("allowance reached");
    },
  };
  await assert.rejects(
    meteredAi(ctx, meter, async () => {
      sent = true;
    }),
    /allowance/,
  );
  assert.equal(sent, false);
});
test("transcription records measured duration when available without pretending it was prebounded", async () => {
  const f = fixture();
  await meteredAi(f.ctx, { ...meter, model: "whisper-1" }, async () => ({
    duration: 60,
    text: "private voice content",
  }));
  assert.equal(f.writes[0].args.priced, false);
  assert.equal(f.writes[1].args.actualMicroUsd, 6000);
  assert.doesNotMatch(JSON.stringify(f.writes), /private voice content/);
});
test('bounded audio reserves before transcription and reconciles actual duration',async()=>{
 const f=fixture();await meteredAi(f.ctx,{feature:'saada_transcription',model:'whisper-1',input:'bounded_recording',maxOutputTokens:0,audioDurationSeconds:120},async()=>({text:'Synthetic question',duration:10}));
 assert.equal(f.writes[0].args.priced,true);assert.equal(f.writes[0].args.estimateMicroUsd,12100);assert.equal(f.writes[1].args.actualMicroUsd,1000);
 const g=fixture();await meteredAi(g.ctx,{feature:'transcription',model:'whisper-1',input:'unknown',maxOutputTokens:0},async()=>({text:'x',duration:1}));assert.equal(g.writes[0].args.priced,false);
});
test('speech reserves its allowance before generation and reconciles audio-token usage', async () => {
  const f = fixture();
  await meteredAi(f.ctx, { feature:'saada_speech', model:'gpt-4o-mini-tts', input:{text:'private answer'}, maxOutputTokens:16384 }, async () => {
    assert.equal(f.writes[0].args.priced,true);
    assert.ok(f.writes[0].args.estimateMicroUsd > 190000);
    return { audioBase64:'not-logged', usage:{input_tokens:14,output_tokens:101} };
  });
  assert.equal(f.writes[1].args.actualMicroUsd,1221);
  assert.doesNotMatch(JSON.stringify(f.writes),/private answer|not-logged/);
});
