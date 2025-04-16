"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Errors = void 0;
exports.ParseErrorEnum = ParseErrorEnum;
var _location = require("./util/location.js");
var _moduleErrors = require("./parse-error/module-errors.js");
var _standardErrors = require("./parse-error/standard-errors.js");
var _strictModeErrors = require("./parse-error/strict-mode-errors.js");
var _pipelineOperatorErrors = require("./parse-error/pipeline-operator-errors.js");
const _excluded = ["message"];
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function defineHidden(obj, key, value) {
  Object.defineProperty(obj, key, {
    enumerable: false,
    configurable: true,
    value
  });
}
function toParseErrorConstructor({
  toMessage,
  code,
  reasonCode,
  syntaxPlugin
}) {
  const hasMissingPlugin = reasonCode === "MissingPlugin" || reasonCode === "MissingOneOfPlugins";
  if (!process.env.BABEL_8_BREAKING) {
    const oldReasonCodes = {
      AccessorCannotDeclareThisParameter: "AccesorCannotDeclareThisParameter",
      AccessorCannotHaveTypeParameters: "AccesorCannotHaveTypeParameters",
      ConstInitializerMustBeStringOrNumericLiteralOrLiteralEnumReference: "ConstInitiailizerMustBeStringOrNumericLiteralOrLiteralEnumReference",
      SetAccessorCannotHaveOptionalParameter: "SetAccesorCannotHaveOptionalParameter",
      SetAccessorCannotHaveRestParameter: "SetAccesorCannotHaveRestParameter",
      SetAccessorCannotHaveReturnType: "SetAccesorCannotHaveReturnType"
    };
    if (oldReasonCodes[reasonCode]) {
      reasonCode = oldReasonCodes[reasonCode];
    }
  }
  return function constructor(loc, details) {
    const error = new SyntaxError();
    error.code = code;
    error.reasonCode = reasonCode;
    error.loc = loc;
    error.pos = loc.index;
    error.syntaxPlugin = syntaxPlugin;
    if (hasMissingPlugin) {
      error.missingPlugin = details.missingPlugin;
    }
    defineHidden(error, "clone", function clone(overrides = {}) {
      const {
        line,
        column,
        index
      } = overrides.loc ?? loc;
      return constructor(new _location.Position(line, column, index), Object.assign({}, details, overrides.details));
    });
    defineHidden(error, "details", details);
    Object.defineProperty(error, "message", {
      configurable: true,
      get() {
        const message = `${toMessage(details)} (${loc.line}:${loc.column})`;
        this.message = message;
        return message;
      },
      set(value) {
        Object.defineProperty(this, "message", {
          value,
          writable: true
        });
      }
    });
    return error;
  };
}
function ParseErrorEnum(argument, syntaxPlugin) {
  if (Array.isArray(argument)) {
    return parseErrorTemplates => ParseErrorEnum(parseErrorTemplates, argument[0]);
  }
  const ParseErrorConstructors = {};
  for (const reasonCode of Object.keys(argument)) {
    const template = argument[reasonCode];
    const _ref = typeof template === "string" ? {
        message: () => template
      } : typeof template === "function" ? {
        message: template
      } : template,
      {
        message
      } = _ref,
      rest = _objectWithoutPropertiesLoose(_ref, _excluded);
    const toMessage = typeof message === "string" ? () => message : message;
    ParseErrorConstructors[reasonCode] = toParseErrorConstructor(Object.assign({
      code: "BABEL_PARSER_SYNTAX_ERROR",
      reasonCode,
      toMessage
    }, syntaxPlugin ? {
      syntaxPlugin
    } : {}, rest));
  }
  return ParseErrorConstructors;
}
const Errors = exports.Errors = Object.assign({}, ParseErrorEnum(_moduleErrors.default), ParseErrorEnum(_standardErrors.default), ParseErrorEnum(_strictModeErrors.default), ParseErrorEnum`pipelineOperator`(_pipelineOperatorErrors.default));

//# sourceMappingURL=parse-error.js.map
