"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _parseError = require("../parse-error.js");
var _options = require("../options.js");
const {
  defineProperty
} = Object;
const toUnenumerable = (object, key) => {
  if (object) {
    defineProperty(object, key, {
      enumerable: false,
      value: object[key]
    });
  }
};
function toESTreeLocation(node) {
  toUnenumerable(node.loc.start, "index");
  toUnenumerable(node.loc.end, "index");
  return node;
}
var _default = superClass => class ESTreeParserMixin extends superClass {
  parse() {
    const file = toESTreeLocation(super.parse());
    if (this.optionFlags & _options.OptionFlags.Tokens) {
      file.tokens = file.tokens.map(toESTreeLocation);
    }
    return file;
  }
  parseRegExpLiteral({
    pattern,
    flags
  }) {
    let regex = null;
    try {
      regex = new RegExp(pattern, flags);
    } catch (_) {}
    const node = this.estreeParseLiteral(regex);
    node.regex = {
      pattern,
      flags
    };
    return node;
  }
  parseBigIntLiteral(value) {
    let bigInt;
    try {
      bigInt = BigInt(value);
    } catch {
      bigInt = null;
    }
    const node = this.estreeParseLiteral(bigInt);
    node.bigint = String(node.value || value);
    return node;
  }
  parseDecimalLiteral(value) {
    const decimal = null;
    const node = this.estreeParseLiteral(decimal);
    node.decimal = String(node.value || value);
    return node;
  }
  estreeParseLiteral(value) {
    return this.parseLiteral(value, "Literal");
  }
  parseStringLiteral(value) {
    return this.estreeParseLiteral(value);
  }
  parseNumericLiteral(value) {
    return this.estreeParseLiteral(value);
  }
  parseNullLiteral() {
    return this.estreeParseLiteral(null);
  }
  parseBooleanLiteral(value) {
    return this.estreeParseLiteral(value);
  }
  directiveToStmt(directive) {
    const expression = directive.value;
    delete directive.value;
    expression.type = "Literal";
    expression.raw = expression.extra.raw;
    expression.value = expression.extra.expressionValue;
    const stmt = directive;
    stmt.type = "ExpressionStatement";
    stmt.expression = expression;
    stmt.directive = expression.extra.rawValue;
    delete expression.extra;
    return stmt;
  }
  initFunction(node, isAsync) {
    super.initFunction(node, isAsync);
    node.expression = false;
  }
  checkDeclaration(node) {
    if (node != null && this.isObjectProperty(node)) {
      this.checkDeclaration(node.value);
    } else {
      super.checkDeclaration(node);
    }
  }
  getObjectOrClassMethodParams(method) {
    return method.value.params;
  }
  isValidDirective(stmt) {
    return stmt.type === "ExpressionStatement" && stmt.expression.type === "Literal" && typeof stmt.expression.value === "string" && !stmt.expression.extra?.parenthesized;
  }
  parseBlockBody(node, allowDirectives, topLevel, end, afterBlockParse) {
    super.parseBlockBody(node, allowDirectives, topLevel, end, afterBlockParse);
    const directiveStatements = node.directives.map(d => this.directiveToStmt(d));
    node.body = directiveStatements.concat(node.body);
    delete node.directives;
  }
  parsePrivateName() {
    const node = super.parsePrivateName();
    if (!process.env.BABEL_8_BREAKING) {
      if (!this.getPluginOption("estree", "classFeatures")) {
        return node;
      }
    }
    return this.convertPrivateNameToPrivateIdentifier(node);
  }
  convertPrivateNameToPrivateIdentifier(node) {
    const name = super.getPrivateNameSV(node);
    node = node;
    delete node.id;
    node.name = name;
    node.type = "PrivateIdentifier";
    return node;
  }
  isPrivateName(node) {
    if (!process.env.BABEL_8_BREAKING) {
      if (!this.getPluginOption("estree", "classFeatures")) {
        return super.isPrivateName(node);
      }
    }
    return node.type === "PrivateIdentifier";
  }
  getPrivateNameSV(node) {
    if (!process.env.BABEL_8_BREAKING) {
      if (!this.getPluginOption("estree", "classFeatures")) {
        return super.getPrivateNameSV(node);
      }
    }
    return node.name;
  }
  parseLiteral(value, type) {
    const node = super.parseLiteral(value, type);
    node.raw = node.extra.raw;
    delete node.extra;
    return node;
  }
  parseFunctionBody(node, allowExpression, isMethod = false) {
    super.parseFunctionBody(node, allowExpression, isMethod);
    node.expression = node.body.type !== "BlockStatement";
  }
  parseMethod(node, isGenerator, isAsync, isConstructor, allowDirectSuper, type, inClassScope = false) {
    let funcNode = this.startNode();
    funcNode.kind = node.kind;
    funcNode = super.parseMethod(funcNode, isGenerator, isAsync, isConstructor, allowDirectSuper, type, inClassScope);
    funcNode.type = "FunctionExpression";
    delete funcNode.kind;
    node.value = funcNode;
    const {
      typeParameters
    } = node;
    if (typeParameters) {
      delete node.typeParameters;
      funcNode.typeParameters = typeParameters;
      this.resetStartLocationFromNode(funcNode, typeParameters);
    }
    if (type === "ClassPrivateMethod") {
      node.computed = false;
    }
    if (process.env.BABEL_8_BREAKING && this.hasPlugin("typescript")) {
      if (!funcNode.body) {
        funcNode.type = "TSEmptyBodyFunctionExpression";
      }
      if (node.abstract) {
        return this.finishNode(node, "TSAbstractMethodDefinition");
      }
    }
    return this.finishNode(node, "MethodDefinition");
  }
  nameIsConstructor(key) {
    if (key.type === "Literal") return key.value === "constructor";
    return super.nameIsConstructor(key);
  }
  parseClassProperty(...args) {
    const propertyNode = super.parseClassProperty(...args);
    if (!process.env.BABEL_8_BREAKING) {
      if (!this.getPluginOption("estree", "classFeatures")) {
        return propertyNode;
      }
    }
    if (process.env.BABEL_8_BREAKING && propertyNode.abstract && this.hasPlugin("typescript")) {
      propertyNode.type = "TSAbstractPropertyDefinition";
    } else {
      propertyNode.type = "PropertyDefinition";
    }
    return propertyNode;
  }
  parseClassPrivateProperty(...args) {
    const propertyNode = super.parseClassPrivateProperty(...args);
    if (!process.env.BABEL_8_BREAKING) {
      if (!this.getPluginOption("estree", "classFeatures")) {
        return propertyNode;
      }
    }
    if (process.env.BABEL_8_BREAKING && propertyNode.abstract && this.hasPlugin("typescript")) {
      propertyNode.type = "TSAbstractPropertyDefinition";
    } else {
      propertyNode.type = "PropertyDefinition";
    }
    propertyNode.computed = false;
    return propertyNode;
  }
  parseObjectMethod(prop, isGenerator, isAsync, isPattern, isAccessor) {
    const node = super.parseObjectMethod(prop, isGenerator, isAsync, isPattern, isAccessor);
    if (node) {
      node.type = "Property";
      if (node.kind === "method") {
        node.kind = "init";
      }
      node.shorthand = false;
    }
    return node;
  }
  parseObjectProperty(prop, startLoc, isPattern, refExpressionErrors) {
    const node = super.parseObjectProperty(prop, startLoc, isPattern, refExpressionErrors);
    if (node) {
      node.kind = "init";
      node.type = "Property";
    }
    return node;
  }
  isValidLVal(type, isUnparenthesizedInAssign, binding) {
    return type === "Property" ? "value" : super.isValidLVal(type, isUnparenthesizedInAssign, binding);
  }
  isAssignable(node, isBinding) {
    if (node != null && this.isObjectProperty(node)) {
      return this.isAssignable(node.value, isBinding);
    }
    return super.isAssignable(node, isBinding);
  }
  toAssignable(node, isLHS = false) {
    if (node != null && this.isObjectProperty(node)) {
      const {
        key,
        value
      } = node;
      if (this.isPrivateName(key)) {
        this.classScope.usePrivateName(this.getPrivateNameSV(key), key.loc.start);
      }
      this.toAssignable(value, isLHS);
    } else {
      super.toAssignable(node, isLHS);
    }
  }
  toAssignableObjectExpressionProp(prop, isLast, isLHS) {
    if (prop.type === "Property" && (prop.kind === "get" || prop.kind === "set")) {
      this.raise(_parseError.Errors.PatternHasAccessor, prop.key);
    } else if (prop.type === "Property" && prop.method) {
      this.raise(_parseError.Errors.PatternHasMethod, prop.key);
    } else {
      super.toAssignableObjectExpressionProp(prop, isLast, isLHS);
    }
  }
  finishCallExpression(unfinished, optional) {
    const node = super.finishCallExpression(unfinished, optional);
    if (node.callee.type === "Import") {
      node.type = "ImportExpression";
      node.source = node.arguments[0];
      node.options = node.arguments[1] ?? null;
      node.attributes = node.arguments[1] ?? null;
      delete node.arguments;
      delete node.callee;
    }
    return node;
  }
  toReferencedArguments(node) {
    if (node.type === "ImportExpression") {
      return;
    }
    super.toReferencedArguments(node);
  }
  parseExport(unfinished, decorators) {
    const exportStartLoc = this.state.lastTokStartLoc;
    const node = super.parseExport(unfinished, decorators);
    switch (node.type) {
      case "ExportAllDeclaration":
        node.exported = null;
        break;
      case "ExportNamedDeclaration":
        if (node.specifiers.length === 1 && node.specifiers[0].type === "ExportNamespaceSpecifier") {
          node.type = "ExportAllDeclaration";
          node.exported = node.specifiers[0].exported;
          delete node.specifiers;
        }
      case "ExportDefaultDeclaration":
        {
          const {
            declaration
          } = node;
          if (declaration?.type === "ClassDeclaration" && declaration.decorators?.length > 0 && declaration.start === node.start) {
            this.resetStartLocation(node, exportStartLoc);
          }
        }
        break;
    }
    return node;
  }
  parseSubscript(base, startLoc, noCalls, state) {
    const node = super.parseSubscript(base, startLoc, noCalls, state);
    if (state.optionalChainMember) {
      if (node.type === "OptionalMemberExpression" || node.type === "OptionalCallExpression") {
        node.type = node.type.substring(8);
      }
      if (state.stop) {
        const chain = this.startNodeAtNode(node);
        chain.expression = node;
        return this.finishNode(chain, "ChainExpression");
      }
    } else if (node.type === "MemberExpression" || node.type === "CallExpression") {
      node.optional = false;
    }
    return node;
  }
  isOptionalMemberExpression(node) {
    if (node.type === "ChainExpression") {
      return node.expression.type === "MemberExpression";
    }
    return super.isOptionalMemberExpression(node);
  }
  hasPropertyAsPrivateName(node) {
    if (node.type === "ChainExpression") {
      node = node.expression;
    }
    return super.hasPropertyAsPrivateName(node);
  }
  isObjectProperty(node) {
    return node.type === "Property" && node.kind === "init" && !node.method;
  }
  isObjectMethod(node) {
    return node.type === "Property" && (node.method || node.kind === "get" || node.kind === "set");
  }
  finishNodeAt(node, type, endLoc) {
    return toESTreeLocation(super.finishNodeAt(node, type, endLoc));
  }
  resetStartLocation(node, startLoc) {
    super.resetStartLocation(node, startLoc);
    toESTreeLocation(node);
  }
  resetEndLocation(node, endLoc = this.state.lastTokEndLoc) {
    super.resetEndLocation(node, endLoc);
    toESTreeLocation(node);
  }
};
exports.default = _default;

//# sourceMappingURL=estree.js.map
