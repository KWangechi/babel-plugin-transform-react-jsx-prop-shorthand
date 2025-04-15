

function jsxTransformJSXPropShorthand(){

  const { types: t } = api;
  return {
    name: "babel-plugin-react-jsx-props-shorthand",
    visitor: {
      JSXOpeningElement(path) {
        // only target Functional Components
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
        attributes.forEach(attributePath => {
          const attrNode = attributePath.node;

          if (t.isJSXPropShorthandAttribute(attrNode)) {
            console.log("Found JSXPropShorthandAttribute");
            const propName = attrNode.name.name;
            if (!path.scope.hasBinding(propName)) {
              console.warn(
                "Prop name not found in scope:... Skipping transformation",
              );
            }
            const newAttr = t.jsxAttribute(
              t.jsxIdentifier(propName),
              t.jsxExpressionContainer(t.identifier(propName)),
            );
            attributePath.replaceWith(newAttr);
          }
        });
      },
    },
  };
}
