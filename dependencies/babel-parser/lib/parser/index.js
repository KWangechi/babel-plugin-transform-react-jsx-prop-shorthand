"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _options = require("../options.js");
var _statement = require("./statement.js");
var _scope = require("../util/scope.js");
class Parser extends _statement.default {
  constructor(options, input, pluginsMap) {
    options = (0, _options.getOptions)(options);
    super(options, input);
    this.options = options;
    this.initializeScopes();
    this.plugins = pluginsMap;
    this.filename = options.sourceFilename;
    this.startIndex = options.startIndex;
    let optionFlags = 0;
    if (options.allowAwaitOutsideFunction) {
      optionFlags |= _options.OptionFlags.AllowAwaitOutsideFunction;
    }
    if (options.allowReturnOutsideFunction) {
      optionFlags |= _options.OptionFlags.AllowReturnOutsideFunction;
    }
    if (options.allowImportExportEverywhere) {
      optionFlags |= _options.OptionFlags.AllowImportExportEverywhere;
    }
    if (options.allowSuperOutsideMethod) {
      optionFlags |= _options.OptionFlags.AllowSuperOutsideMethod;
    }
    if (options.allowUndeclaredExports) {
      optionFlags |= _options.OptionFlags.AllowUndeclaredExports;
    }
    if (options.allowNewTargetOutsideFunction) {
      optionFlags |= _options.OptionFlags.AllowNewTargetOutsideFunction;
    }
    if (options.ranges) {
      optionFlags |= _options.OptionFlags.Ranges;
    }
    if (options.tokens) {
      optionFlags |= _options.OptionFlags.Tokens;
    }
    if (options.createImportExpressions) {
      optionFlags |= _options.OptionFlags.CreateImportExpressions;
    }
    if (options.createParenthesizedExpressions) {
      optionFlags |= _options.OptionFlags.CreateParenthesizedExpressions;
    }
    if (options.errorRecovery) {
      optionFlags |= _options.OptionFlags.ErrorRecovery;
    }
    if (options.attachComment) {
      optionFlags |= _options.OptionFlags.AttachComment;
    }
    if (options.annexB) {
      optionFlags |= _options.OptionFlags.AnnexB;
    }
    this.optionFlags = optionFlags;
  }
  getScopeHandler() {
    return _scope.default;
  }
  parse() {
    this.enterInitialScopes();
    const file = this.startNode();
    const program = this.startNode();
    this.nextToken();
    file.errors = null;
    this.parseTopLevel(file, program);
    file.errors = this.state.errors;
    file.comments.length = this.state.commentsLen;
    return file;
  }
}
exports.default = Parser;

//# sourceMappingURL=index.js.map
