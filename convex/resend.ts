"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

// ==========================================
// RESEND EMAIL INTEGRATION
// ==========================================

/**
 * Sends an email via Resend API.
 * Requires RESEND_API_KEY in Convex environment.
 * 
 * For testing: Use `onboarding@resend.dev` as sender.
 * For production: Verify `info@lsftz.org` in Resend dashboard.
 */
export const sendEmail = action({
    args: {
        to: v.array(v.string()), // Array of recipient emails
        subject: v.string(),
        html: v.string(), // HTML content
        from: v.optional(v.string()), // Override sender
        replyTo: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            console.error("[Resend] RESEND_API_KEY not configured");
            throw new Error("Email service not configured. Please add RESEND_API_KEY to Convex environment.");
        }

        // Default sender (use test sender until domain verified)
        const sender = args.from || "Legal Services Facility (LSF) <onboarding@resend.dev>";

        // Resend has a limit of 100 recipients per batch
        const BATCH_SIZE = 50;
        const results: { success: boolean; email: string; error?: string }[] = [];

        for (let i = 0; i < args.to.length; i += BATCH_SIZE) {
            const batch = args.to.slice(i, i + BATCH_SIZE);

            try {
                const response = await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        from: sender,
                        to: batch,
                        subject: args.subject,
                        html: args.html,
                        reply_to: args.replyTo || "info@lsftz.org",
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error(`[Resend] API Error:`, data);
                    batch.forEach(email => {
                        results.push({
                            success: false,
                            email,
                            error: data.message || "Failed to send"
                        });
                    });
                } else {
                    console.log(`[Resend] Sent to ${batch.length} recipients. ID: ${data.id}`);
                    batch.forEach(email => {
                        results.push({ success: true, email });
                    });
                }
            } catch (error) {
                console.error(`[Resend] Network Error:`, error);
                batch.forEach(email => {
                    results.push({
                        success: false,
                        email,
                        error: "Network error"
                    });
                });
            }
        }

        const successCount = results.filter(r => r.success).length;
        const failedCount = results.filter(r => !r.success).length;

        return {
            totalSent: successCount,
            totalFailed: failedCount,
            results,
        };
    },
});

/**
 * Send a single transactional email (for contact form replies, etc.)
 */
export const sendTransactionalEmail = action({
    args: {
        to: v.string(),
        subject: v.string(),
        html: v.string(),
        replyTo: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            throw new Error("Email service not configured");
        }

        try {
            const response = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: "Legal Services Facility (LSF) <onboarding@resend.dev>",
                    to: [args.to],
                    subject: args.subject,
                    html: args.html,
                    reply_to: args.replyTo,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(`[Resend] Failed to send to ${args.to}:`, data);
                return { success: false, error: data.message };
            }

            return { success: true, id: data.id };
        } catch (error) {
            console.error(`[Resend] Error:`, error);
            return { success: false, error: "Network error" };
        }
    },
});
