// npm run dev   — local dev server with live reload
// npm run build — static site in dist/: index.html (JS + CSS inlined) plus the
//                 files from public/. Upload dist/ to any static host, or open
//                 dist/index.html by double-clicking.
import { fileURLToPath } from "node:url";
import { readdirSync } from "node:fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// Make absolute /public paths in the source ("/projects/discord.mp4") relative,
// so the site works from a sub-path (e.g. GitHub Pages /repo/) and from file://.
function relativePublicPaths(): Plugin {
  const files = readdirSync(r("./public"), { recursive: true, withFileTypes: true })
    .filter((f) => f.isFile())
    .map((f) => `${f.parentPath}/${f.name}`.replace(/\\/g, "/").split("/public/")[1]);
  return {
    name: "relative-public-paths",
    enforce: "pre",
    transform(code, id) {
      if (id.includes("node_modules")) return null;
      let out = code;
      for (const f of files) out = out.replaceAll(`"/${f}"`, `"./${f}"`);
      return out === code ? null : out;
    },
  };
}

export default defineConfig({
  base: "./",
  resolve: { alias: { "@": r("./src") } },
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: false }),
    relativePublicPaths(),
    react(),
    tailwindcss(),
    viteSingleFile(),
  ],
});
