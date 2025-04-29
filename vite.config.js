import { defineConfig } from "vite";

export default defineConfig({
  entry: ["./src/index.js"],
  build: {
    outDir: "dist"
  },
  // test: {
  //   build: {
  //     rollupOptions: {
  //       input: "tests/fixtures/**/*.{jsx, tsx}",
  //     },
  //     plugins: [react()],
  //   },
  // },
});
