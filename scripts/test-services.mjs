import assert from "node:assert/strict";
import ts from "typescript";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const dir = await mkdtemp(new URL("../.test-services-", import.meta.url));
const originalFetch = globalThis.fetch;
let checks = 0;
try {
  const source = await readFile(
    new URL("../src/lib/live-services.server.ts", import.meta.url),
    "utf8",
  );
  const file = dir + "/services.mjs";
  await writeFile(
    file,
    ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    }).outputText,
  );
  const { liveServices } = await import(pathToFileURL(file));
  const request = (path, body, headers = {}) =>
    new Request("https://www.rastayaar.com/api/transport/" + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-vercel-forwarded-for": String(++checks),
        ...headers,
      },
      body: JSON.stringify(body),
    });
  assert.equal(
    (await liveServices(new Request("https://www.rastayaar.com/api/transport/search"))).status,
    405,
  );
  assert.equal(
    (await liveServices(request("search", { query: "NIPA" }, { origin: "https://other.example" })))
      .status,
    403,
  );
  assert.equal((await liveServices(request("search", { query: "x" }))).status, 400);
  delete process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_SEARCH_MODEL;
  delete process.env.GOOGLE_ROUTES_API_KEY;
  assert.equal((await liveServices(request("search", { query: "unknown place" }))).status, 503);
  assert.equal(
    (await liveServices(request("walk", { from: "Shaheen Complex", to: "Oak Tower" }))).status,
    503,
  );
  process.env.GEMINI_API_KEY = "test-only";
  process.env.GEMINI_SEARCH_MODEL = "test-model";
  globalThis.fetch = async (url, options) => {
    assert.equal(new URL(url).hostname, "generativelanguage.googleapis.com");
    const body = JSON.parse(options.body);
    assert(body.tools[0].google_search);
    assert(body.systemInstruction.parts[0].text.includes("Urdu"));
    return Response.json({
      candidates: [
        {
          content: { parts: [{ text: "Reported route" }] },
          groundingMetadata: {
            groundingChunks: [
              { web: { uri: "https://source.example/route", title: "Route source" } },
            ],
            searchEntryPoint: { renderedContent: "<p>Google</p>" },
          },
        },
      ],
    });
  };
  const result = await liveServices(request("search", { query: "unknown place", language: "ur" }));
  assert.equal(result.status, 200);
  assert.equal((await result.json()).sources.length, 1);
  globalThis.fetch = async () =>
    Response.json({ candidates: [{ content: { parts: [{ text: "Unsupported answer" }] } }] });
  assert.equal((await liveServices(request("search", { query: "unknown place" }))).status, 404);
  process.env.GOOGLE_ROUTES_API_KEY = "test-only";
  globalThis.fetch = async (url, options) => {
    assert.equal(new URL(url).hostname, "routes.googleapis.com");
    const body = JSON.parse(options.body);
    assert.equal(body.travelMode, "WALK");
    assert(body.origin.address.includes("Shaheen Complex"));
    assert(body.destination.address.includes("Oak Tower"));
    return Response.json({
      routes: [{ distanceMeters: 650, duration: "480s", warnings: ["Check pedestrian access"] }],
    });
  };
  const walk = await liveServices(request("walk", { from: "Shaheen Complex", to: "Oak Tower" }));
  assert.equal(walk.status, 200);
  assert.deepEqual(await walk.json(), {
    meters: 650,
    minutes: 8,
    warnings: ["Check pedestrian access"],
    source: "Google Maps",
    estimated: true,
  });
  globalThis.fetch = async () => {
    throw new Error("provider failed");
  };
  assert.equal(
    (await liveServices(request("walk", { from: "Shaheen Complex", to: "Oak Tower" }))).status,
    502,
  );
  console.log(
    "PASS service validation, origin checks, missing keys, Google grounding, unsourced rejection, walking meters, provider failures (mocked)",
  );
} finally {
  globalThis.fetch = originalFetch;
  delete process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_SEARCH_MODEL;
  delete process.env.GOOGLE_ROUTES_API_KEY;
  await rm(dir, { recursive: true, force: true });
}
