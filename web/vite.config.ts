import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: './' — относительные пути к ассетам, чтобы одинаково работало
// и на GitHub Pages (project pages: user.github.io/repo), и на своём домене.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
