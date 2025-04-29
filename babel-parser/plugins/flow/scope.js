"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _scope = require("../../util/scope.js");
var _scopeflags = require("../../util/scopeflags.js");
class FlowScope extends _scope.Scope {
  declareFunctions = new Set();
}
class FlowScopeHandler extends _scope.default {
  createScope(flags) {
    return new FlowScope(flags);
  }
  declareName(name, bindingType, loc) {
    const scope = this.currentScope();
    if (bindingType & _scopeflags.BindingFlag.FLAG_FLOW_DECLARE_FN) {
      this.checkRedeclarationInScope(scope, name, bindingType, loc);
      this.maybeExportDefined(scope, name);
      scope.declareFunctions.add(name);
      return;
    }
    super.declareName(name, bindingType, loc);
  }
  isRedeclaredInScope(scope, name, bindingType) {
    if (super.isRedeclaredInScope(scope, name, bindingType)) return true;
    if (bindingType & _scopeflags.BindingFlag.FLAG_FLOW_DECLARE_FN && !scope.declareFunctions.has(name)) {
      const type = scope.names.get(name);
      return (type & _scope.NameType.Function) > 0 || (type & _scope.NameType.Lexical) > 0;
    }
    return false;
  }
  checkLocalExport(id) {
    if (!this.scopeStack[0].declareFunctions.has(id.name)) {
      super.checkLocalExport(id);
    }
  }
}
exports.default = FlowScopeHandler;

//# sourceMappingURL=scope.js.map
