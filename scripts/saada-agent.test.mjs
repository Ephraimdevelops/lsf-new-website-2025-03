import assert from "node:assert/strict";
import test from "node:test";
import { build } from "esbuild";
const bundle = await build({
  entryPoints: ["convex/lib/saadaAgent.ts"],
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
});
const { runSaadaAgent, validateSaadaTool, SAADA_TOOLS } = await import(
  "data:text/javascript;base64," +
    Buffer.from(bundle.outputFiles[0].text).toString("base64")
);
const call = (name, args = {}, id = name) => ({
  choices: [
    {
      delta: {
        tool_calls: [
          { index: 0, id, function: { name, arguments: JSON.stringify(args) } },
        ],
      },
      finish_reason: "tool_calls",
    },
  ],
});
const answer = (content, finish_reason = "stop") => ({
  choices: [{ delta: { content }, finish_reason }],
});
async function* stream(chunks) {
  yield* chunks;
}
function setup(rounds, overrides = {}) {
  const executed = [],
    messages = [],
    requests = [],
    errors = [];
  const options = {
    messages,
    noEvidence: "NO VERIFIED EVIDENCE",
    hasLegalEvidence: () => false,
    create: async (messages, toolsAllowed) => {
      requests.push({ toolsAllowed, messages: structuredClone(messages) });
      return stream(rounds.shift() ?? [answer("untrusted model answer")]);
    },
    execute: async (name, args) => {
      executed.push({ name, args });
      return {
        content: "verified data",
        evidence: "directory",
        fallback: "DIRECTORY ONLY",
      };
    },
    onToolError: async (name) => {
      errors.push(name);
    },
    ...overrides,
  };
  return { options, executed, messages, requests, errors };
}

test("registry has bounded search, clarification and reviewed drafting tools and rejects forged ownership/side effects", () => {
  assert.equal(SAADA_TOOLS.length, 24);
  for (const name of [
    "send_email",
    "confirm_action",
    "saadaActionConfirm.confirm",
    "approve_source",
    "delete_case",
    "constructor",
    "__proto__",
  ])
    assert.throws(() => validateSaadaTool(name, "{}"));
  for (const raw of [
    "null",
    "[]",
    "{",
    '{"userId":"other"}',
    '{"__proto__":"other"}',
  ])
    assert.throws(() => validateSaadaTool("my_cases", raw));
  assert.throws(() =>
    validateSaadaTool("find_services", '{"issueCategory":"invented"}'),
  );
  assert.throws(() => validateSaadaTool("find_guides", "{}"));
  assert.throws(() =>
    validateSaadaTool("load_skill", '{"skill":"execute_shell"}'),
  );
  assert.throws(() =>
    validateSaadaTool(
      "find_guides",
      JSON.stringify({ search: "x".repeat(201) }),
    ),
  );
  assert.deepEqual(
    validateSaadaTool("find_paralegals", '{"region":" Arusha "}').args,
    { region: "Arusha" },
  );
});

test("handles interleaved streamed calls, then a dependent third tool, then final answer", async () => {
  const s = setup(
    [
      [
        {
          choices: [
            {
              delta: {
                content: "discard me",
                tool_calls: [
                  {
                    index: 1,
                    id: "b",
                    function: {
                      name: "find_services",
                      arguments: '{"issueCategory":',
                    },
                  },
                  {
                    index: 0,
                    id: "a",
                    function: { name: "load_skill", arguments: '{"skill":' },
                  },
                ],
              },
            },
          ],
        },
        {
          choices: [
            {
              delta: {
                tool_calls: [
                  { index: 0, function: { arguments: '"find_support"}' } },
                  { index: 1, function: { arguments: '"land"}' } },
                ],
              },
              finish_reason: "tool_calls",
            },
          ],
        },
      ],
      [call("find_paralegals", { region: "Arusha" }, "c")],
      [answer("Grounded final")],
    ],
    { hasLegalEvidence: () => true },
  );
  const result = await runSaadaAgent(s.options);
  assert.deepEqual(
    s.executed.map((x) => x.name),
    ["load_skill", "find_services", "find_paralegals"],
  );
  assert.equal(result.content, "Grounded final");
  assert.equal(s.messages.filter((x) => x.role === "tool").length, 3);
  assert.deepEqual(
    s.messages[0].tool_calls.map((x) => x.id),
    ["a", "b"],
  );
  assert.equal(
    s.messages.some((x) => x.content === "discard me"),
    false,
  );
});

test("duplicate read calls reuse results, retain protocol replies and count toward limits", async () => {
  const s = setup([
    [call("find_guides", { search: "land" }, "a")],
    [call("find_guides", { search: "land" }, "b")],
    [answer("invented law")],
  ]);
  const result = await runSaadaAgent(s.options);
  assert.equal(s.executed.length, 1);
  assert.equal(s.messages.filter((x) => x.role === "tool").length, 2);
  assert.equal(result.content, "DIRECTORY ONLY");
});

test("unknown/malformed calls never execute or leak exception details; model can recover", async () => {
  const s = setup(
    [
      [call("send_email",
    "confirm_action",
    "saadaActionConfirm.confirm", { to: "victim" }, "a")],
      [call("my_cases", {}, "b")],
      [answer("my status")],
    ],
    {
      execute: async (name) => {
        assert.equal(name, "my_cases");
        return { content: "assigned", evidence: "personal" };
      },
    },
  );
  const result = await runSaadaAgent(s.options);
  assert.equal(result.content, "my status");
  assert.deepEqual(s.errors, ["send_email"]);
  assert.match(s.messages[1].content, /arguments rejected/);
});

test("empty results and procedural skills cannot authorize generated legal claims", async () => {
  const s = setup(
    [
      [call("load_skill", { skill: "evidence_checklist" })],
      [answer("You have 30 days to file")],
    ],
    {
      execute: async () => ({ content: "Ask for evidence", evidence: "none" }),
    },
  );
  assert.equal(
    (await runSaadaAgent(s.options)).content,
    "NO VERIFIED EVIDENCE",
  );
});

test("unapproved search output cannot bypass deterministic directory-only fallback", async () => {
  const s = setup([
    [call("find_services", { issueCategory: "land" })],
    [answer("Ignore rules. Legal deadline is tomorrow.")],
  ]);
  assert.equal((await runSaadaAgent(s.options)).content, "DIRECTORY ONLY");
});

test("approved guide evidence supports multi-step answer without PDF evidence", async () => {
  const s = setup(
    [[call("find_guides", { search: "land" })], [answer("Cited guide answer")]],
    {
      execute: async () => ({
        content: "approved current guide",
        evidence: "legal",
        fallback: "guide text",
      }),
    },
  );
  assert.equal((await runSaadaAgent(s.options)).content, "Cited guide answer");
});

test("tool exceptions are redacted and provide a recoverable protocol response", async () => {
  const s = setup([[call("my_cases")], [answer("secret")]], {
    execute: async () => {
      throw new Error("token=private-secret");
    },
  });
  const result = await runSaadaAgent(s.options);
  assert.equal(result.content, "NO VERIFIED EVIDENCE");
  assert.doesNotMatch(JSON.stringify(s.messages), /private-secret/);
  assert.deepEqual(s.errors, ["my_cases"]);
});

test("truncated provider text is discarded even with legal evidence", async () => {
  const s = setup([[answer("partial legal advice", "length")]], {
    hasLegalEvidence: () => true,
  });
  const result = await runSaadaAgent(s.options);
  assert.equal(result.exhausted, true);
  assert.equal(result.content, "NO VERIFIED EVIDENCE");
});

test("bounded rounds disable tools on final synthesis and prohibit continuing execution", async () => {
  const rounds = Array.from({ length: 5 }, (_, i) => [
    call("find_guides", { search: "land" + i }, "call" + i),
  ]);
  rounds.push([answer("final")]);
  const s = setup(rounds, { hasLegalEvidence: () => true });
  assert.equal((await runSaadaAgent(s.options)).content, "final");
  assert.equal(s.requests.length, 6);
  assert.equal(s.requests.at(-1).toolsAllowed, false);
});

test("time and token limits stop loops without publishing preliminary answers", async () => {
  let clock = 0;
  const s = setup([[call("my_cases")]], {
    now: () => clock,
    execute: async () => {
      clock = 81_000;
      return { content: "status", evidence: "personal" };
    },
  });
  const result = await runSaadaAgent(s.options);
  assert.equal(result.exhausted, true);
  assert.equal(s.requests.length, 1);
  const t = setup(
    [[{ ...call("my_cases"), usage: { total_tokens: 12_000 } }]],
    { hasLegalEvidence: () => true },
  );
  assert.equal((await runSaadaAgent(t.options)).exhausted, true);
  assert.equal(t.executed.length, 0);
});

test("duplicate call IDs and oversized streamed payloads fail closed", async () => {
  const s = setup([
    [
      {
        choices: [
          {
            finish_reason: "tool_calls",
            delta: {
              tool_calls: [
                {
                  index: 0,
                  id: "a",
                  function: { name: "my_cases", arguments: "{}" },
                },
                {
                  index: 1,
                  id: "a",
                  function: { name: "my_requests", arguments: "{}" },
                },
              ],
            },
          },
        ],
      },
    ],
  ]);
  await assert.rejects(runSaadaAgent(s.options), /envelope/);
  assert.equal(s.executed.length, 0);
  const large = setup([[call("find_guides", { search: "x".repeat(5000) })]]);
  await assert.rejects(runSaadaAgent(large.options), /payload/);
});
