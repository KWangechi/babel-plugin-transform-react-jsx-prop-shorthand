import { defineConfig } from "vite";
import { react } from "@vitejs/plugin-react";

export default defineConfig({
  entry: ["./src/index.js"],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "./src/index.js",
    },
  },
  test: {
    build: {
      rollupOptions: {
        input: "tests/fixtures/**/*.{jsx, tsx}",
      },
      plugins: [react()],
    },
  },
});
