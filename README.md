# babel-plugin-transform-react-jsx-prop-shorthand

A Babel plugin that transforms React JSX props Shorthand Syntax - by using double colons.

## Example

### Input

```jsx
<CompA ::propA ::propB />
```

### Output

```jsx
<CompA propA={propA} propB={propB} />
```

where possible, making your code cleaner and more concise.

## Important Note

This plugin uses a modified parser forked from the official Babel Parser in order to support `::propA` syntax. Link to the modified parser:  [Babel Modified Parser](https://github.com/KWangechi/modified-babel-parser)


## Installation

```bash
npm install babel-plugin-transform-react-jsx-prop-shorthand
```

## Usage

Add the plugin to your Bundler config file e.g if using [Vite](https://vite.dev/guide/), modify your `vite.config.js` file:

### `vite.config.js`

```js
import { react } from "@vite/plugin-react";
import jsxTransformPropShorthand from "babel-plugin-transform-react-jsx-prop-shorthand";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [jsxTransformPropShorthand()],
      },
    }),
  ],
});
```

## Motivation

This plugin simplifies JSX syntax by enabling writing shorthand JSX and having it transformed into regular JSX, improving code readability and reducing boilerplate.

> Sidenote: The name of the plugin is so long(Yeah, I know), will work on that and narrow it down. Suggestions are also welcomed

## Special Mentions

During the development of this project, I came across several insightful resources that deserve a special shoutout:

1. **[Lin Tai Hau's Article](https://lihautan.com/creating-custom-javascript-syntax-with-babel)**  
  This fantastic article made the process of forking the Babel repository much easier. A must-read for anyone exploring custom JavaScript syntax with Babel.

2. **[Babel Propname Value Shorthand](https://github.com/inversepolarity/babel-prop-name-value-shorthand)**  
  Initially, I considered this approach. However, implementing it in JSX results in props being auto-resolved to boolean values, which can be a bit confusing. Despite this, it's great to see such an idea in action.

3. **[Unplugin JSX Short Bind](https://github.com/zhiyuanzmj/unplugin-jsx-short-bind)**  
  This is, by far, the most impressive solution I’ve encountered. It’s framework-agnostic and works seamlessly with various bundlers like `tsup`, `rollup`, `vite`, etc.  
  What sets it apart is that it doesn’t require modifying a parser. Instead, it’s built on top of [AST Grep](https://github.com/ast-grep/ast-grep), a powerful tool for manipulating ASTs without the need to fork a JSX transpiler. Highly recommended!

These resources have been invaluable, and I encourage you to check them out!

## Limitations

- **Restricted to React Functional Components (RFCs):** This plugin only supports shorthand syntax for props used in React Functional Components. It does not work with class components or other types of React elements.
- **Non-standard Syntax:** The shorthand syntax (`::prop`) is not part of standard JSX or React. It requires a custom Babel implementation, which may cause compatibility issues with other Babel tools and plugins. Additionally, IDEs like VSCode may show errors as the syntax is not recognized by the JSX LSP Server.
- **Potential Maintenance Overhead:** Since the plugin relies on a custom Babel implementation, updates to Babel's main codebase may require corresponding updates to the plugin to maintain compatibility.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
