import { fileURLToPath } from "node:url";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart({
      // TanStack Start's bundled server entry is redirected to src/server.ts
      // (our SSR error wrapper — see that file for why).
      server: { entry: "server" },
    }),
    // Build-only: produces a deployable server bundle. "vercel" targets
    // Vercel's Node runtime; change the preset if you deploy elsewhere
    // (see https://nitro.build/deploy for the full list).
    nitro({ preset: "vercel" }),
    viteReact(),
  ],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    // Prevents duplicate React/TanStack Query instances, which otherwise
    // surface as confusing "invalid hook call" or context-mismatch errors.
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  server: {
    host: true,
    port: 8080,
  },
});
