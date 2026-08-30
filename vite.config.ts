import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: "data", dest: "." },
        { src: "music", dest: "." },
        { src: "assets", dest: "." },
        { src: "favicon.ico", dest: "." },
      ],
    }),
  ],
  server: { host: "127.0.0.1", port: 5173 },
  preview: { host: "127.0.0.1", port: 4173 },
  build: { outDir: "dist", emptyOutDir: true },
});
