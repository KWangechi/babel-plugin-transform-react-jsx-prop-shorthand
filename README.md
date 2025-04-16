# babel-plugin-transform-react-jsx-prop-shorthand

A Babel plugin that transforms React JSX props Shorthand Syntax - by using double colons i.e from

```jsx
<CompA ::propA ::propB />
```

to

```jsx
<CompA propA={propA} propB={propB} />
```
where possible, making your code cleaner and more concise.

## Important Note

This plugin bundles modified versions of `@babel/parser`, `@babel/types`, and `@babel/traverse` to support the `::propA` syntax. The modified code is derived from the Babel project (https://babeljs.io/) and is licensed under the MIT License. A link to the [LICENSE](https://github.com/babel/babel/blob/main/LICENSE)

## Limitations

- **Restricted to React Functional Components (RFCs):** This plugin only supports shorthand syntax for props used in React Functional Components. It does not work with class components or other types of React elements.
- **Non-standard Feature:** The shorthand syntax (`::prop`) is not a standard feature of JSX or React. Using this plugin requires a modified version of the Babel codebase, which may lead to compatibility issues with other Babel plugins or tools.
- **Potential Maintenance Overhead:** Since the plugin relies on a custom Babel implementation, updates to Babel's main codebase may require corresponding updates to the plugin to maintain compatibility.
- **Limited Ecosystem Support:** Tools and libraries that rely on standard JSX syntax may not recognize or support the shorthand syntax introduced by this plugin.
- **Learning Curve:** Developers unfamiliar with the shorthand syntax may find the code less intuitive, potentially impacting team collaboration.


## Installation

```bash
npm install --save-dev babel-plugin-transform-react-jsx-prop-shorthand
```

## Usage

Add the plugin to your Babel configuration:

### `.babelrc` or `babel.config.json`

```json
{
  "plugins": ["babel-plugin-transform-react-jsx-prop-shorthand"]
}
```

### Babel CLI

```bash
babel --plugins babel-plugin-transform-react-jsx-prop-shorthand src --out-dir lib
```

## Example

### Input

```jsx
<MyComponent ::prop anotherProp="value" />
```

### Output

```jsx
<MyComponent prop={prop} anotherProp="value" />
```

## Motivation

This plugin simplifies JSX syntax by enabling writing shorthand JSX and having it transformed into regular JSX, improving code readability and reducing boilerplate.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
