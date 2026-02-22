import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-naver-maps-kit": fileURLToPath(
        new URL("../react-naver-maps-kit/src/index.ts", import.meta.url)
      )
    }
  }
});
