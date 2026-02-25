import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  mode: "e2e",
  plugins: [react()],
  resolve: {
    alias: {
      "react-naver-maps-kit": path.resolve(__dirname, "../../dist/index.js")
    }
  },
  server: {
    port: 9000
  }
});
