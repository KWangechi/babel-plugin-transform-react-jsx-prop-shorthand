import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  entry: ["./src/index.js"],
  plugins:[visualizer()],
  build: {
    outDir: "dist",
    lib: {
      entry: "./src/index.js",
      name: "jsxTransformPropShorthand",
      formats: ["es", 'cjs'],
      fileName: `index`,
    },
    sourcemap: false,
    rollupOptions: {
      external: ["@babel/core", "@kwangechi/modified-babel-parser"],
      output: {
        globals: {
          "@babel/core": "babel",
          "@kwangechi/modified-babel-parser": "babelParser",
        },
      },
    }
  }
});
