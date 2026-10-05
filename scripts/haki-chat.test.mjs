import assert from "node:assert/strict";
import test from "node:test";
import { build } from "esbuild";
import { getFunctionName } from "convex/server";

const bundle = await build({ entryPoints: ["convex/sara_chat.ts"], bundle: true, write: false, platform: "node", format: "esm" });
const chat = await import("data:text/javascript;base64," + Buffer.from(bundle.outputFiles[0].text).toString("base64"));

function fixture(subject = "alice") {
  const rows = {
    users: [{ _id: "user-a", clerkId: "alice" }, { _id: "user-b", clerkId: "bob" }],
    sara_conversations: [{ _id: "a", userId: "alice", title: "First", updatedAt: 1 }, { _id: "b", userId: "bob", title: "Private", updatedAt: 2 }],
    sara_chats: [{ _id: "old", userId: "alice", role: "user", content: "Legacy", timestamp: 1 }, { _id: "new", userId: "alice", conversationId: "a", role: "user", content: "New topic", timestamp: 2 }],
  };
  const ctx = {
    auth: { getUserIdentity: async () => subject ? { subject } : null },
    db: {
      get: async id => Object.values(rows).flat().find(row => row._id === id) ?? null,
      insert: async (table, value) => { const id = table + "-" + rows[table].length; rows[table].push({ ...value, _id: id }); return id; },
      patch: async (id, value) => Object.assign(Object.values(rows).flat().find(row => row._id === id), value),
      delete: async id => { for (const table of Object.keys(rows)) rows[table] = rows[table].filter(row => row._id !== id); },
      query: table => {
        let result = [...rows[table]];
        const query = {
          withIndex: (_index, select) => { const q = { eq: (field, value) => { result = result.filter(row => row[field] === value); return q; } }; select(q); return query; },
          order: direction => { if (direction === "desc") result.reverse(); return query; },
          unique: async () => result[0] ?? null,
          first: async () => result[0] ?? null,
          collect: async () => result,
          paginate: async () => ({ page: result, isDone: true, continueCursor: "" }),
        };
        return query;
      },
    },
  };
  return { ctx, rows };
}

const paginationOpts = { numItems: 20, cursor: null };

test("conversation reads and both message writers reject a different owner", async () => {
  const { ctx, rows } = fixture();
  await assert.rejects(chat.getConversationMessages._handler(ctx, { conversationId: "b", paginationOpts }), /Conversation not found/);
  await assert.rejects(chat.sendMessage._handler(ctx, { conversationId: "b", content: "Attempt" }), /Conversation not found/);
  await assert.rejects(chat.createBotMessage._handler(ctx, { conversationId: "b", userId: "alice" }), /Conversation not found/);
  await assert.rejects(chat.checkConversationOwner._handler(ctx, { conversationId: "b", userId: "alice" }), /Conversation not found/);
  await assert.rejects(chat.deleteConversation._handler(ctx, { conversationId: "b" }), /Conversation not found/);
  assert.equal(rows.sara_chats.length, 2);
});

test("deleting one conversation keeps legacy history and other accounts intact", async () => {
  const { ctx, rows } = fixture();
  await chat.deleteConversation._handler(ctx, { conversationId: "a" });
  assert.deepEqual(rows.sara_conversations.map(row => row._id), ["b"]);
  assert.deepEqual(rows.sara_chats.map(row => row._id), ["old"]);
});

test("history lists only the signed-in user's conversations", async () => {
  const { ctx } = fixture();
  const result = await chat.listConversations._handler(ctx, { paginationOpts });
  assert.deepEqual(result.page.map(row => row._id), ["a"]);
});

test("legacy messages and new conversations never mix", async () => {
  const { ctx } = fixture();
  const legacy = await chat.getConversationMessages._handler(ctx, { paginationOpts });
  const current = await chat.getConversationMessages._handler(ctx, { conversationId: "a", paginationOpts });
  const web = await chat.getMessages._handler(ctx, {});
  assert.deepEqual(legacy.page.map(row => row._id), ["old"]);
  assert.deepEqual(current.page.map(row => row._id), ["new"]);
  assert.deepEqual(web.map(row => row._id), ["old"]);
});

test("new conversation and streamed answer retain the owner and request identity", async () => {
  const { ctx, rows } = fixture();
  const id = await chat.createConversation._handler(ctx, { title: "  A new question  " });
  await chat.sendMessage._handler(ctx, { conversationId: id, content: "A new question" });
  await chat.createBotMessage._handler(ctx, { conversationId: id, userId: "alice", clientRequestId: "request-1" });
  assert.equal(rows.sara_conversations.at(-1).title, "A new question");
  assert.equal(rows.sara_chats.at(-1).conversationId, id);
  assert.equal(rows.sara_chats.at(-1).metadata.clientRequestId, "request-1");
  assert.equal(rows.sara_chats.at(-1).userId, "alice");
});

test("signed-out users cannot read or create conversations", async () => {
  const { ctx } = fixture(null);
  await assert.rejects(chat.listConversations._handler(ctx, { paginationOpts }));
  await assert.rejects(chat.getConversationMessages._handler(ctx, { paginationOpts }));
  await assert.rejects(chat.createConversation._handler(ctx, { title: "Test" }));
});

test("provider credit failure completes the saved reply and emits a failed activity", async () => {
  const actionBundle = await build({
    entryPoints: ["convex/sara_actions.ts"], bundle: true, write: false, platform: "node", format: "esm",
    define: { "process.env.OPENAI_API_KEY": '"test-key"' },
    plugins: [{ name: "offline-provider", setup(build) {
      build.onResolve({ filter: /^openai$/ }, () => ({ path: "provider", namespace: "test" }));
      build.onLoad({ filter: /.*/, namespace: "test" }, () => ({ contents: 'export default class { embeddings = { create: async () => { throw new Error("429 You have no credits remaining"); } }; }' }));
    } }],
  });
  const actions = await import("data:text/javascript;base64," + Buffer.from(actionBundle.outputFiles[0].text).toString("base64"));
  const writes = [];
  const ctx = {
    auth: { getUserIdentity: async () => ({ subject: "alice" }) },
    runQuery: async ref => getFunctionName(ref) === "sara:getAllChats" ? [] : null,
    runMutation: async (ref, args) => { writes.push({ name: getFunctionName(ref), args }); return "bot-id"; },
  };
  const response = await actions.ask._handler(ctx, { message: "Application test", history: [], locale: "en", source: "mobile", clientRequestId: "request-1" });
  assert.match(response, /unable to answer right now/);
  const saved = writes.find(write => write.name === "sara_chat:updateMessage");
  assert.equal(saved.args.isDone, true);
  assert.equal(saved.args.failureCode, "unavailable");
  assert.equal(saved.args.clientRequestId, "request-1");
  const event = writes.find(write => write.name === "sara:recordActivityEvent" && write.args.type === "failed");
  assert.equal(event.args.metadata.reason, "provider_quota");
  assert.doesNotMatch(saved.args.content, /429|billing|test-key/);
});
