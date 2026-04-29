import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().default(""),
  service: z.string().trim().min(1).max(50),
  budget: z.number().int().min(0).max(10_000_000),
  message: z.string().trim().min(1).max(2000),
});

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const formatCZK = (n: number) =>
  new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 }).format(n) + " Kč";

export const sendContactToTelegram = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
    if (!chatId) throw new Error("TELEGRAM_CHAT_ID is not configured");

    const text =
      `<b>🟦 Nová poptávka — ELEVATE</b>\n\n` +
      `<b>Jméno:</b> ${escapeHtml(data.name)}\n` +
      `<b>E-mail:</b> ${escapeHtml(data.email)}\n` +
      (data.phone ? `<b>Telefon:</b> ${escapeHtml(data.phone)}\n` : "") +
      `<b>Služba:</b> ${escapeHtml(data.service)}\n` +
      `<b>Rozpočet:</b> ${escapeHtml(formatCZK(data.budget))}\n\n` +
      `<b>Zpráva:</b>\n${escapeHtml(data.message)}`;

    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      },
    );

    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body?.ok) {
      console.error("Telegram sendMessage failed:", res.status, body);
      throw new Error(`Telegram API error (${res.status})`);
    }
    return { ok: true as const };
  });
