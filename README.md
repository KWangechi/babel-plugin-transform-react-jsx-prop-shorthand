# babel-plugin-transform-react-jsx-prop-shorthand

A Babel plugin that transforms React JSX props Shorthand Syntax - by using double colons i.e

```jsx
<CompA ::propA ::propB />
```

to
```jsx
<CompA propA={propA} propB={propB} />
```
where possible, making your code cleaner and more concise.

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
