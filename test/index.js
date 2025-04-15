import fs from 'fs';
import { transform } from '@babel/core';
import autoResolvePlugin from '../src/index.js';

const reactCodeExample = fs.readFileSync("./test/react/App.jsx", "utf-8");

// console.log(reactCodeExample);
const { code } = transform(reactCodeExample, {
  plugins: [autoResolvePlugin, "@babel/plugin-transform-react-jsx"],
});

console.log(code);
