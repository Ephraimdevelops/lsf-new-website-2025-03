"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { normalizeOptionalText, normalizeText } from "./lib/security";

const CHATBOT_TIMEOUT_MS = 25_000;

function pickWebhookUrl() {
  const url = process.env.N8N_CHATBOT_WEBHOOK_URL;
  if (!url) throw new Error("Chatbot service is not configured");
  if (!/^https:\/\/.+/i.test(url)) throw new Error("Chatbot webhook URL must use HTTPS");
  return url;
}

export const sendMessage = action({
  args: {
    message: v.string(),
    threadId: v.optional(v.string()),
    language: v.union(v.literal("swahili"), v.literal("english")),
  },
  handler: async (_ctx, args) => {
    const webhookUrl = pickWebhookUrl();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CHATBOT_TIMEOUT_MS);

    const body = {
      message: normalizeText(args.message, "Message", 2000),
      threadId: normalizeOptionalText(args.threadId, "Thread ID", 160),
      language: args.language,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      const contentType = response.headers.get("content-type") || "";
      const payload = contentType.includes("application/json")
        ? await response.json()
        : { message: await response.text() };

      if (!response.ok) {
        throw new Error("Chatbot service returned an error");
      }

      return payload;
    } finally {
      clearTimeout(timeout);
    }
  },
});
