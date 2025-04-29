"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _scope = require("../../util/scope.js");
var _scopeflags = require("../../util/scopeflags.js");
var _parseError = require("../../parse-error.js");
class TypeScriptScope extends _scope.Scope {
  tsNames = new Map();
}
class TypeScriptScopeHandler extends _scope.default {
  importsStack = [];
  createScope(flags) {
    this.importsStack.push(new Set());
    return new TypeScriptScope(flags);
  }
  enter(flags) {
    if (flags === _scopeflags.ScopeFlag.TS_MODULE) {
      this.importsStack.push(new Set());
    }
    super.enter(flags);
  }
  exit() {
    const flags = super.exit();
    if (flags === _scopeflags.ScopeFlag.TS_MODULE) {
      this.importsStack.pop();
    }
    return flags;
  }
  hasImport(name, allowShadow) {
    const len = this.importsStack.length;
    if (this.importsStack[len - 1].has(name)) {
      return true;
    }
    if (!allowShadow && len > 1) {
      for (let i = 0; i < len - 1; i++) {
        if (this.importsStack[i].has(name)) return true;
      }
    }
    return false;
  }
  declareName(name, bindingType, loc) {
    if (bindingType & _scopeflags.BindingFlag.FLAG_TS_IMPORT) {
      if (this.hasImport(name, true)) {
        this.parser.raise(_parseError.Errors.VarRedeclaration, loc, {
          identifierName: name
        });
      }
      this.importsStack[this.importsStack.length - 1].add(name);
      return;
    }
    const scope = this.currentScope();
    let type = scope.tsNames.get(name) || 0;
    if (bindingType & _scopeflags.BindingFlag.FLAG_TS_EXPORT_ONLY) {
      this.maybeExportDefined(scope, name);
      scope.tsNames.set(name, type | 16);
      return;
    }
    super.declareName(name, bindingType, loc);
    if (bindingType & _scopeflags.BindingFlag.KIND_TYPE) {
      if (!(bindingType & _scopeflags.BindingFlag.KIND_VALUE)) {
        this.checkRedeclarationInScope(scope, name, bindingType, loc);
        this.maybeExportDefined(scope, name);
      }
      type = type | 1;
    }
    if (bindingType & _scopeflags.BindingFlag.FLAG_TS_ENUM) {
      type = type | 2;
    }
    if (bindingType & _scopeflags.BindingFlag.FLAG_TS_CONST_ENUM) {
      type = type | 4;
    }
    if (bindingType & _scopeflags.BindingFlag.FLAG_CLASS) {
      type = type | 8;
    }
    if (type) scope.tsNames.set(name, type);
  }
  isRedeclaredInScope(scope, name, bindingType) {
    const type = scope.tsNames.get(name);
    if ((type & 2) > 0) {
      if (bindingType & _scopeflags.BindingFlag.FLAG_TS_ENUM) {
        const isConst = !!(bindingType & _scopeflags.BindingFlag.FLAG_TS_CONST_ENUM);
        const wasConst = (type & 4) > 0;
        return isConst !== wasConst;
      }
      return true;
    }
    if (bindingType & _scopeflags.BindingFlag.FLAG_CLASS && (type & 8) > 0) {
      if (scope.names.get(name) & _scope.NameType.Lexical) {
        return !!(bindingType & _scopeflags.BindingFlag.KIND_VALUE);
      } else {
        return false;
      }
    }
    if (bindingType & _scopeflags.BindingFlag.KIND_TYPE && (type & 1) > 0) {
      return true;
    }
    return super.isRedeclaredInScope(scope, name, bindingType);
  }
  checkLocalExport(id) {
    const {
      name
    } = id;
    if (this.hasImport(name)) return;
    const len = this.scopeStack.length;
    for (let i = len - 1; i >= 0; i--) {
      const scope = this.scopeStack[i];
      const type = scope.tsNames.get(name);
      if ((type & 1) > 0 || (type & 16) > 0) {
        return;
      }
    }
    super.checkLocalExport(id);
  }
}
exports.default = TypeScriptScopeHandler;

//# sourceMappingURL=scope.js.map
