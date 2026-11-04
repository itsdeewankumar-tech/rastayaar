import assert from "node:assert/strict";
import ts from "typescript";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const dir = await mkdtemp(new URL("../.test-feedback-", import.meta.url));
const originalFetch = globalThis.fetch;
const previous = { key: process.env.RESEND_API_KEY, from: process.env.FEEDBACK_FROM_EMAIL };
let seq = 0;
try {
  const source = await readFile(new URL("../src/lib/feedback.server.ts", import.meta.url), "utf8");
  const file = dir + "/feedback.mjs";
  await writeFile(
    file,
    ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    }).outputText,
  );
  const { feedback } = await import(pathToFileURL(file));
  const valid = {
    id: "b6e2c4bf-a4f0-4f27-91f8-3710f1b954ec",
    name: "A commuter",
    email: "visitor@example.com",
    category: "route_correction",
    route: "N-5",
    message: "Please check the Metropole boarding stop.",
    website: "",
  };
  const request = (body = valid, extra = {}) =>
    new Request("https://www.rastayaar.com/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-vercel-forwarded-for": `test-${++seq}`,
        ...extra,
      },
      body: JSON.stringify(body),
    });
  assert.equal((await feedback(new Request("https://www.rastayaar.com/api/feedback"))).status, 405);
  assert.equal((await feedback(request(valid, { origin: "https://other.example" }))).status, 403);
  assert.equal((await feedback(request({ ...valid, message: "x" }))).status, 400);
  assert.equal((await feedback(request({ ...valid, email: "invalid" }))).status, 400);
  assert.equal((await feedback(request({ ...valid, to: "other@example.com" }))).status, 400);
  assert.equal((await feedback(request({ ...valid, website: "spam.example" }))).status, 400);
  assert.equal((await feedback(request({ ...valid, message: "x".repeat(17000) }))).status, 413);
  delete process.env.RESEND_API_KEY;
  delete process.env.FEEDBACK_FROM_EMAIL;
  assert.equal((await feedback(request())).status, 503);
  process.env.RESEND_API_KEY = "test-only";
  process.env.FEEDBACK_FROM_EMAIL = "RastaYaar <feedback@rastayaar.com>";
  let calls = 0;
  globalThis.fetch = async (url, options) => {
    calls++;
    assert.equal(url, "https://api.resend.com/emails");
    assert.equal(options.headers.Authorization, "Bearer test-only");
    assert.equal(options.headers["Idempotency-Key"], "feedback/" + valid.id);
    const body = JSON.parse(options.body);
    assert.deepEqual(body.to, ["rastayaar@gmail.com"]);
    assert.equal(body.from, "RastaYaar <feedback@rastayaar.com>");
    assert.equal(body.reply_to, "visitor@example.com");
    assert(body.subject.includes("Route correction"));
    assert(body.text.includes(valid.message));
    assert(!("html" in body));
    return Response.json({ id: "provider-message-id" });
  };
  const success = await feedback(request());
  assert.equal(success.status, 200);
  assert.deepEqual(await success.json(), { accepted: true });
  assert.equal(calls, 1);
  assert.equal((await feedback(request())).status, 200); // Retried unchanged payload uses the same provider idempotency key.
  globalThis.fetch = async () => Response.json({ error: "rejected" }, { status: 403 });
  assert.equal((await feedback(request())).status, 502);
  globalThis.fetch = async () => Response.json({});
  assert.equal((await feedback(request())).status, 502);
  globalThis.fetch = async () => {
    throw new Error("network timeout");
  };
  assert.equal((await feedback(request())).status, 502);
  for (let i = 0; i < 3; i++)
    await feedback(request(valid, { "x-vercel-forwarded-for": "limited-client" }));
  assert.equal(
    (await feedback(request(valid, { "x-vercel-forwarded-for": "limited-client" }))).status,
    429,
  );
  console.log(
    "PASS feedback: origin/input checks, fixed recipient, plain text, reply address, idempotency key, honest missing-key/provider failures, bounded body and rate limit (mocked; no real email sent)",
  );
} finally {
  globalThis.fetch = originalFetch;
  if (previous.key === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = previous.key;
  if (previous.from === undefined) delete process.env.FEEDBACK_FROM_EMAIL;
  else process.env.FEEDBACK_FROM_EMAIL = previous.from;
  await rm(dir, { recursive: true, force: true });
}
