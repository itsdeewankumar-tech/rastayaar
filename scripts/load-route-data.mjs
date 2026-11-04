import ts from "typescript";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
export async function loadRouteData(includePlanner = false) {
  const dir = await mkdtemp(join(tmpdir(), "rastayaar-data-"));
  try {
    for (const [name, path] of [
      ["places", "../src/data/places.ts"],
      ["routes", "../src/data/routes.ts"],
      ...(includePlanner ? [["trip-planner", "../src/lib/trip-planner.ts"]] : []),
    ]) {
      const source = await readFile(new URL(path, import.meta.url), "utf8");
      const js = ts
        .transpileModule(source, {
          compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
        })
        .outputText.replaceAll('"./places"', '"./places.mjs"')
        .replaceAll('"@/data/routes"', '"./routes.mjs"')
        .replaceAll('"@/data/places"', '"./places.mjs"');
      await writeFile(join(dir, name + ".mjs"), js);
    }
    const data = await import(pathToFileURL(join(dir, "routes.mjs")).href);
    return {
      ...data,
      ...(includePlanner ? await import(pathToFileURL(join(dir, "trip-planner.mjs")).href) : {}),
    };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
