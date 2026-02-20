import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/index.ts",
  external: ["react", "react-dom"],
  output: [
    {
      file: "dist/index.js",
      format: "esm",
      sourcemap: true
    },
    {
      file: "dist/index.cjs",
      format: "cjs",
      sourcemap: true,
      exports: "named"
    }
  ]
});
