// Explicitly authorized small synthetic provider test. Never print/store the key.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import OpenAI from "openai";
const getSetting = (name) => {
  try {
    return execFileSync("npx", ["convex", "env", "get", name], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 60000,
    }).trim();
  } catch {
    return "";
  }
};
const key = getSetting("OPENAI_API_KEY");
if (!key || ["undefined", "null"].includes(key))
  throw new Error("Backend OpenAI key unavailable.");
const configuredModel = getSetting("SAADA_CHAT_MODEL");
const model =
  configuredModel && !["undefined", "null"].includes(configuredModel)
    ? configuredModel
    : "gpt-4o";
const client = new OpenAI({ apiKey: key, timeout: 20000, maxRetries: 0 });
const report = {
  checkedAt: new Date().toISOString(),
  environment: "configured development key; direct synthetic provider test",
  model,
  checks: [],
  providerCalls: 0,
  privateUserDataSent: false,
  appRecordWrites: 0,
};
try {
  report.providerCalls++;
  const embedding = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: "Synthetic test: legal service search.",
  });
  report.checks.push({
    name: "Query/document embedding endpoint",
    passed: embedding.data[0]?.embedding.length === 1536,
    dimensions: embedding.data[0]?.embedding.length,
    inputTokens: embedding.usage.prompt_tokens,
  });
  report.providerCalls++;
  const messages = [
    {
      role: "user",
      content: "Connection test. Call app_help with no arguments.",
    },
  ];
  const first = await client.chat.completions.create({
    model,
    messages,
    tools: [
      {
        type: "function",
        function: {
          name: "app_help",
          description: "Return synthetic app help.",
          parameters: {
            type: "object",
            properties: {},
            required: [],
            additionalProperties: false,
          },
        },
      },
    ],
    tool_choice: { type: "function", function: { name: "app_help" } },
    max_completion_tokens: 64,
    store: false,
  });
  const choice = first.choices[0]?.message;
  const call = choice?.tool_calls?.find(
    (item) => item.type === "function" && item.function.name === "app_help",
  );
  report.checks.push({
    name: "Chat and tool-call generation",
    passed: Boolean(call),
    usage: first.usage,
  });
  if (call) {
    report.providerCalls++;
    const stream = await client.chat.completions.create({
      model,
      messages: [
        ...messages,
        choice,
        {
          role: "tool",
          tool_call_id: call.id,
          content: "Synthetic result: connection works. Reply OK.",
        },
      ],
      stream: true,
      stream_options: { include_usage: true },
      max_completion_tokens: 16,
      store: false,
    });
    let content = "",
      usage;
    for await (const chunk of stream) {
      content += chunk.choices[0]?.delta?.content ?? "";
      if (chunk.usage) usage = chunk.usage;
    }
    report.checks.push({
      name: "Streamed answer after tool result",
      passed: Boolean(content.trim()),
      usage,
    });
  }
} catch (error) {
  report.checks.push({
    name: "Provider request",
    passed: false,
    httpStatus: error.status ?? null,
    category: error.code ?? "unavailable",
  });
}
report.passed =
  report.checks.length === 3 && report.checks.every((item) => item.passed);
fs.writeFileSync(
  "docs/haki-yangu/saada-provider-live-check-2026-10-16.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
if (!report.passed) process.exitCode = 1;
