import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
// import { build } from "vite";
// import jsxTransformPropShorthand from "../src/index.js";

describe("Fixtures Tests", async () => {
  const fixturesDir = path.resolve(__dirname, "fixtures");

  const subfolders = fs.readdirSync(fixturesDir).filter((file) => {
    return fs.statSync(path.join(fixturesDir, file)).isDirectory();
  });
  it("should ensure all fixture subfolders exist", () => {
    expect(fs.existsSync(fixturesDir)).toBe(true);

    expect(subfolders.length).toBeGreaterThan(0);
  });

  it("should ensure each fixture subfolder contains files", () => {
    subfolders.forEach((subfolder) => {
      const files = fs.readdirSync(path.join(fixturesDir, subfolder));
      expect(files.length).toBeGreaterThan(0);
    });
  });

  it("should process .tsx and .jsx files correctly", async () => {
    const fixturesPath = path.resolve(__dirname, "fixtures");
    const jsxFiles = await fg("**/*.{jsx,tsx}", { cwd: fixturesPath });

    expect(jsxFiles.length).toBeGreaterThan(0);

    for (const file of jsxFiles) {
      const filePath = path.join(fixturesPath, file);

      const result = await build({
        root: path.resolve(__dirname, ".."),
        build: {
          outDir: "dist",
          rollupOptions: {
            input: filePath,
          },
        },
        plugins: [jsxTransformPropShorthand(), react()],
      });

      expect(result).toBeDefined();
    }
  });
});

// test to see if it bundles correctly with Vite
