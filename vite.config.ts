import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the build works when served from a GitHub Pages
// project subpath (e.g. /Cursed_Trades/) as well as from the root.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
