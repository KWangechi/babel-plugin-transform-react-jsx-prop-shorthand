import { defineConfig } from "vite";

export default defineConfig({
  entry: ["./src/index.js"],
  build: {
    outDir: "dist",
    lib: {
      entry: "./src/index.js",
      name: "jsxTransformPropShorthand",
      formats: ["es", 'cjs'],
      fileName: `index`,
    },
    sourcemap: false
  }
});
