import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative asset paths let the built site work from any GitHub Pages subfolder.
  base: "./",
  plugins: [react()],
  // Pages serves this folder directly, while the repo keeps the readable source.
  build: {
    outDir: "docs",
  },
});
