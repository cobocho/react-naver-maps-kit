import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/index.ts",
  external: (id) =>
    id === "react" || id.startsWith("react/") || id === "react-dom" || id.startsWith("react-dom/"),
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
