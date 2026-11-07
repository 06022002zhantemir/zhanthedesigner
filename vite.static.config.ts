// Builds the site into dist-static/: one self-contained index.html plus the
// files from /public (videos, images) copied next to it.
// Open index.html by double-clicking — no server needed. Run: npm run build:html
import { cpSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// Swap the SSR root route for the client-only one, and make absolute /public
// paths ("/projects/discord.mp4") relative so they resolve from file://.
function staticSite(): Plugin {
  const rootRoute = r("./src/routes/__root.tsx").replace(/\\/g, "/");
  const publicFiles = readdirSync(r("./public"), { recursive: true, withFileTypes: true })
    .filter((f) => f.isFile())
    .map((f) => `${f.parentPath}/${f.name}`.replace(/\\/g, "/").split("/public/")[1]);
  return {
    name: "static-site",
    enforce: "pre",
    async resolveId(source, importer, options) {
      if (!source.includes("__root")) return null;
      const res = await this.resolve(source, importer, { ...options, skipSelf: true });
      if (res && res.id.replace(/\\/g, "/") === rootRoute) return r("./static/root.tsx");
      return null;
    },
    transform(code, id) {
      if (id.includes("node_modules")) return null;
      let out = code;
      for (const f of publicFiles) out = out.replaceAll(`"/${f}"`, `"./${f}"`);
      return out === code ? null : out;
    },
    closeBundle() {
      cpSync(r("./public"), r("./dist-static"), { recursive: true });
    },
  };
}

export default defineConfig({
  root: r("./static"),
  base: "./",
  publicDir: false,
  resolve: { alias: { "@": r("./src") } },
  plugins: [staticSite(), react(), tailwindcss(), viteSingleFile()],
  build: { outDir: r("./dist-static"), emptyOutDir: true },
});
