"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OptionFlags = void 0;
exports.getOptions = getOptions;
const OptionFlags = exports.OptionFlags = {
  AllowAwaitOutsideFunction: 1,
  AllowReturnOutsideFunction: 2,
  AllowNewTargetOutsideFunction: 4,
  AllowImportExportEverywhere: 8,
  AllowSuperOutsideMethod: 16,
  AllowUndeclaredExports: 32,
  Ranges: 64,
  Tokens: 128,
  CreateImportExpressions: 256,
  CreateParenthesizedExpressions: 512,
  ErrorRecovery: 1024,
  AttachComment: 2048,
  AnnexB: 4096
};
function createDefaultOptions() {
  return {
    sourceType: "script",
    sourceFilename: undefined,
    startIndex: 0,
    startColumn: 0,
    startLine: 1,
    allowAwaitOutsideFunction: false,
    allowReturnOutsideFunction: false,
    allowNewTargetOutsideFunction: false,
    allowImportExportEverywhere: false,
    allowSuperOutsideMethod: false,
    allowUndeclaredExports: false,
    plugins: [],
    strictMode: null,
    ranges: false,
    tokens: false,
    createImportExpressions: process.env.BABEL_8_BREAKING ? true : false,
    createParenthesizedExpressions: false,
    errorRecovery: false,
    attachComment: true,
    annexB: true
  };
}
function getOptions(opts) {
  const options = createDefaultOptions();
  if (opts == null) {
    return options;
  }
  if (opts.annexB != null && opts.annexB !== false) {
    throw new Error("The `annexB` option can only be set to `false`.");
  }
  for (const key of Object.keys(options)) {
    if (opts[key] != null) options[key] = opts[key];
  }
  if (options.startLine === 1) {
    if (opts.startIndex == null && options.startColumn > 0) {
      options.startIndex = options.startColumn;
    } else if (opts.startColumn == null && options.startIndex > 0) {
      options.startColumn = options.startIndex;
    }
  } else if (opts.startColumn == null || opts.startIndex == null) {
    if (opts.startIndex != null || process.env.BABEL_8_BREAKING) {
      throw new Error("With a `startLine > 1` you must also specify `startIndex` and `startColumn`.");
    }
  }
  return options;
}

//# sourceMappingURL=options.js.map
