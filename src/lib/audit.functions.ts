import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  website: z.string().trim().min(3).max(255),
  goal: z.string().trim().max(2000).optional().default(""),
});

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const sendAuditRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const parsed = inputSchema.safeParse(input);
    if (!parsed.success) {
      // Never expose Zod's structured issues to the client — return a clean message.
      throw new Error("INVALID_INPUT");
    }
    return parsed.data;
  })
  .handler(async ({ data }) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      console.error("Telegram credentials not configured");
      throw new Error("SEND_FAILED");
    }

    const text =
      `<b>🔍 Žádost o audit zdarma — ELEVATE</b>\n\n` +
      `<b>Jméno:</b> ${escapeHtml(data.name)}\n` +
      `<b>E-mail:</b> ${escapeHtml(data.email)}\n` +
      `<b>Web:</b> ${escapeHtml(data.website)}\n` +
      (data.goal ? `\n<b>Cíl / kontext:</b>\n${escapeHtml(data.goal)}` : "");

    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.ok) {
        console.error("Telegram sendMessage failed:", res.status, body);
        throw new Error("SEND_FAILED");
      }
    } catch (err) {
      console.error("Audit send error:", err);
      throw new Error("SEND_FAILED");
    }
    return { ok: true as const };
  });
