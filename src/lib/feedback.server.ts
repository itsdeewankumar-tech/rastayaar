import { z } from "zod";
const schema = z
  .object({
    id: z.string().uuid(),
    name: z.string().trim().max(80).default(""),
    email: z.union([z.literal(""), z.string().trim().max(254).email()]).default(""),
    category: z.enum(["feedback", "route_problem", "route_correction", "fare", "website"]),
    route: z.string().trim().max(100).default(""),
    message: z.string().trim().min(10).max(5000),
    website: z.string().max(200).default(""),
  })
  .strict();
const quotas = new Map<string, { count: number; reset: number }>();
const reply = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const labels = {
  feedback: "General feedback",
  route_problem: "Route problem",
  route_correction: "Route correction",
  fare: "Fare information",
  website: "Website problem",
};
/** Fixed recipient, validated plain text and server-only credentials: never an open mail relay. */
export async function feedback(request: Request): Promise<Response> {
  if (request.method !== "POST") return reply({ error: "method" }, 405);
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return reply({ error: "origin" }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return reply({ error: "format" }, 415);
  const now = Date.now();
  for (const [key, value] of quotas) if (value.reset < now) quotas.delete(key);
  const ip =
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("cf-connecting-ip") ??
    "shared";
  const quota = quotas.get(ip) ?? { count: 0, reset: now + 600000 };
  const globalQuota = quotas.get("global") ?? { count: 0, reset: now + 600000 };
  if (quota.count >= 3 || globalQuota.count >= 40 || quotas.size > 10000)
    return reply({ error: "rate_limit" }, 429);
  quota.count++;
  globalQuota.count++;
  quotas.set(ip, quota);
  quotas.set("global", globalQuota);
  try {
    // Bound actual bytes even when Content-Length is absent or incorrect.
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: "invalid" }, 400);
    const decoder = new TextDecoder();
    let text = "",
      bytes = 0;
    while (true) {
      const item = await reader.read();
      if (item.done) break;
      bytes += item.value.byteLength;
      if (bytes > 16000) {
        await reader.cancel();
        return reply({ error: "too_large" }, 413);
      }
      text += decoder.decode(item.value, { stream: true });
    }
    text += decoder.decode();
    const body = schema.parse(JSON.parse(text));
    if (body.website) return reply({ error: "invalid" }, 400);
    const key = process.env["RESEND_API_KEY"],
      from = process.env["FEEDBACK_FROM_EMAIL"];
    if (!key || !from) return reply({ error: "unavailable" }, 503);
    const subject = `[RastaYaar] ${labels[body.category]}${body.route ? ` — ${body.route.replace(/[\r\n]/g, " ")}` : ""}`;
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `feedback/${body.id}`,
      },
      body: JSON.stringify({
        from,
        to: ["rastayaar@gmail.com"],
        ...(body.email ? { reply_to: body.email } : {}),
        subject,
        text: [
          "RastaYaar website feedback",
          `Type: ${labels[body.category]}`,
          `Name: ${body.name || "Not provided"}`,
          `Reply email: ${body.email || "Not provided"}`,
          `Route / stop: ${body.route || "Not provided"}`,
          "",
          body.message,
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) return reply({ error: "delivery_failed" }, 502);
    const result = await response.json();
    if (typeof result.id !== "string" || !result.id)
      return reply({ error: "delivery_failed" }, 502);
    return reply({ accepted: true });
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError)
      return reply({ error: "invalid" }, 400);
    return reply({ error: "delivery_failed" }, 502);
  }
}
