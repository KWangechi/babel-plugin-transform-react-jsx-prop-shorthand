import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { build } from "vite";
import react from "@vitejs/plugin-react";
import fg from "fast-glob";
import {jsxTransformPropShorthand} from "../src/index.js";
import { transform } from "@babel/core";

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

  // it("should transform and bundle .jsx files correctly", async () => {
  //   const fixturesPath = path.resolve(__dirname, "fixtures");
  //   const jsxFiles = await fg("**/*.{jsx,tsx}", { cwd: fixturesPath });


  //   for (const file of jsxFiles) {
  //     const filePath = path.join(fixturesPath, file);
  //     const fileName = path.basename(file, path.extname(file));

  //     const result = await build({
  //       root: path.resolve(__dirname, ".."),
  //       build: {
  //         outDir: "dist", 
  //         rollupOptions: {
  //           input: filePath,
  //           external: ["react", "react-dom"],
  //           output: {
  //             entryFileNames: `${fileName}.jsx`,
  //             dir: "dist",
  //             format: "es",
  //           },
  //         },
  //       },
  //       plugins: [
  //         react({
  //           babel: {
  //             plugins: [jsxTransformPropShorthand()],
  //           },
  //         }),
  //       ],
  //     });

  //     console.log(`Built file: ${fileName}.js`);
  //     expect(result).toBeDefined();
  //   }
  // });

  it("should transform shorthand props correctly", () => {
    const inputCode = `
    const propA = 'Hello World';
    <ChildComp ::propA />`;

    const result = transform(inputCode, {
      presets: ["@babel/preset-react"],
      plugins: [jsxTransformPropShorthand()],
    });

    expect(result.code).toMatchSnapshot();
  });

  // test to see if it bundles correctly with Vite
  // it("should transform and bundle JSX correctly", async () => {
  //   const fixturesPath = path.resolve(__dirname, "fixtures/react");
  //   const inputFile = path.join(fixturesPath, "App.jsx");
  //   const outputFile = path.resolve(__dirname, "../dist/App.js");

  //   // Run the Vite build
  //   await build({
  //     root: path.resolve(__dirname, ".."),
  //     build: {
  //       outDir: "dist",
  //       rollupOptions: {
  //         input: inputFile,
  //       },
  //     },
  //     plugins: [
  //       react({
  //         babel: {
  //           plugins: [jsxTransformPropShorthand()],
  //         },
  //       }),
  //     ],
  //   });

  //   // Read the output file
  //   const outputCode = fs.readFileSync(outputFile, "utf-8");

  //   // Assert the transformed output
  //   expect(outputCode).toContain(`<ChildComp propA={propA} />`);
  // });
});
