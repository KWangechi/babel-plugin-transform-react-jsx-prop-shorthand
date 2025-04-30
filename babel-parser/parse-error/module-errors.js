"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const code = "BABEL_PARSER_SOURCETYPE_MODULE_REQUIRED";
var _default = exports.default = {
  ImportMetaOutsideModule: {
    message: `import.meta may appear only with 'sourceType: "module"'`,
    code
  },
  ImportOutsideModule: {
    message: `'import' and 'export' may appear only with 'sourceType: "module"'`,
    code
  }
};

//# sourceMappingURL=module-errors.js.map
