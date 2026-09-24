import "server-only";
import { repository } from "./data";
import { formatNaira } from "./format";
import { resolveSiteUrl } from "./site-url";
import type { Property } from "./types";
import type { ViewingInput } from "./viewing";

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.NOTIFY_FROM_EMAIL);
}

/**
 * Emails the listing agent about a new viewing request and records the outcome.
 * Runs after the response is sent, so it must never throw.
 */
export async function notifyAgentOfViewing(reference: string, property: Property, request: ViewingInput): Promise<void> {
  try {
    if (!emailConfigured()) {
      console.info(`[viewing] ${reference} stored; agent email skipped (RESEND_API_KEY/NOTIFY_FROM_EMAIL not set)`);
      return;
    }
    const to = await repository.getAgentEmail(property.id);
    if (!to) {
      console.warn(`[viewing] ${reference}: no agent contact for property ${property.id}`);
      await repository.setViewingRequestStatus(reference, "notify_failed");
      return;
    }
    // Plain text only: every field below is user input.
    const text = [
      `New viewing request ${reference}`,
      ``,
      `Property: ${property.title} (${formatNaira(property.price)})`,
      new URL(`/properties/${property.slug}`, resolveSiteUrl()).href,
      ``,
      `Name: ${request.name}`,
      `Phone: ${request.phone}`,
      request.email ? `Email: ${request.email}` : null,
      `Preferred date: ${request.date}`,
      request.message ? `\nMessage:\n${request.message}` : null
    ].filter(line => line !== null).join("\n");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM_EMAIL,
        to: [to],
        reply_to: request.email,
        subject: `Viewing request: ${property.title} on ${request.date}`,
        text
      }),
      signal: AbortSignal.timeout(10_000)
    });
    await repository.setViewingRequestStatus(reference, res.ok ? "notified" : "notify_failed");
    if (!res.ok) console.error(`[viewing] ${reference}: email provider returned ${res.status}`);
  } catch (err) {
    console.error(`[viewing] ${reference}: notification failed`, err);
    await repository.setViewingRequestStatus(reference, "notify_failed").catch(() => {});
  }
}
