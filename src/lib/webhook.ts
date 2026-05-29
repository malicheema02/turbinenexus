import { getSetting } from "@/lib/settings";

/**
 * Fire-and-forget webhook dispatcher for CRM automation (n8n / Zapier / Make).
 *
 * Reads the configurable `webhook_url` from SiteSettings and POSTs the given
 * event + payload as JSON. Never throws — failures are logged and swallowed so
 * the originating request (inquiry/offer/etc.) always succeeds.
 */
export async function dispatchWebhook(
  event: string,
  payload: Record<string, unknown>
): Promise<void> {
  let url = "";
  try {
    url = await getSetting("webhook_url", "");
  } catch {
    return;
  }
  if (!url || !/^https?:\/\//i.test(url)) return;

  const body = JSON.stringify({
    event,
    timestamp: new Date().toISOString(),
    source: "turbine-nexus",
    data: payload,
  });

  try {
    // 5s timeout so a slow webhook endpoint never blocks the user response.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));
  } catch (err) {
    console.warn(`[webhook] dispatch failed for event "${event}":`, err);
  }
}
