import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-naver-maps-kit": fileURLToPath(new URL("../dist/index.js", import.meta.url))
    }
  },
  optimizeDeps: {
    exclude: ["react-naver-maps-kit"]
  }
});
