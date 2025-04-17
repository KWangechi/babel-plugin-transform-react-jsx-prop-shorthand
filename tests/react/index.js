import fs from 'fs';
import autoResolvePlugin from '../../src/index.js';
import { transform } from '@babel/core';

const reactCodeExample = fs.readFileSync("./tests/react/App.jsx", "utf-8");

// Transform the code using your custom parser and plugin
const { code } = transform(reactCodeExample, {
  plugins: [autoResolvePlugin, "@babel/plugin-transform-react-jsx"],
});

console.log(code);
