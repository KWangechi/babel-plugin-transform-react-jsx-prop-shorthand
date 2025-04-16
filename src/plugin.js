import { types as t } from "@babel/core";
import { parse } from "../dependencies/babel-parser/lib/index.js";

export default function jsxTransformPropShorthand() {
  return {
    name: "babel-plugin-react-jsx-props-shorthand",
    parserOverride(code, opts) {
      return parse(code, {
        ...opts,
        sourceType: "module",
        plugins: ["jsx"],
      });
    },
    visitor: {
      JSXOpeningElement(path) {
        // only target Functional Components - for now
        // get the JSX Identifier from this node
        if (t.isJSXIdentifier(path.node.name)) {
          const componentName = path.node.name.name;
          if (
            !componentName ||
            componentName[0] !== componentName[0].toUpperCase()
          ) {
            return;
          }
        }

        const attributes = path.get("attributes");
        attributes.forEach((attributePath) => {
          const attrNode = attributePath.node;

          if (attrNode.type === 'JSXPropShorthandAttribute') {
            console.log("Found JSXPropShorthandAttribute");
            const propName = attrNode.name.name;
            if (!path.scope.hasBinding(propName)) {
              console.warn(
                "Prop name not found in scope:... Skipping transformation"
              );
            }
            const newAttr = t.jsxAttribute(
              t.jsxIdentifier(propName),
              t.jsxExpressionContainer(t.identifier(propName))
            );
            attributePath.replaceWith(newAttr);
          }
        });
      },
    },
  };
}
