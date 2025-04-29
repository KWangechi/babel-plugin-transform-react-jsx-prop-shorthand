"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Scope = exports.NameType = void 0;
var _scopeflags = require("./scopeflags.js");
var _parseError = require("../parse-error.js");
const NameType = exports.NameType = {
  Var: 1,
  Lexical: 2,
  Function: 4
};
class Scope {
  flags = 0;
  names = new Map();
  firstLexicalName = "";
  constructor(flags) {
    this.flags = flags;
  }
}
exports.Scope = Scope;
class ScopeHandler {
  parser;
  scopeStack = [];
  inModule;
  undefinedExports = new Map();
  constructor(parser, inModule) {
    this.parser = parser;
    this.inModule = inModule;
  }
  get inTopLevel() {
    return (this.currentScope().flags & _scopeflags.ScopeFlag.PROGRAM) > 0;
  }
  get inFunction() {
    return (this.currentVarScopeFlags() & _scopeflags.ScopeFlag.FUNCTION) > 0;
  }
  get allowSuper() {
    return (this.currentThisScopeFlags() & _scopeflags.ScopeFlag.SUPER) > 0;
  }
  get allowDirectSuper() {
    return (this.currentThisScopeFlags() & _scopeflags.ScopeFlag.DIRECT_SUPER) > 0;
  }
  get inClass() {
    return (this.currentThisScopeFlags() & _scopeflags.ScopeFlag.CLASS) > 0;
  }
  get inClassAndNotInNonArrowFunction() {
    const flags = this.currentThisScopeFlags();
    return (flags & _scopeflags.ScopeFlag.CLASS) > 0 && (flags & _scopeflags.ScopeFlag.FUNCTION) === 0;
  }
  get inStaticBlock() {
    for (let i = this.scopeStack.length - 1;; i--) {
      const {
        flags
      } = this.scopeStack[i];
      if (flags & _scopeflags.ScopeFlag.STATIC_BLOCK) {
        return true;
      }
      if (flags & (_scopeflags.ScopeFlag.VAR | _scopeflags.ScopeFlag.CLASS)) {
        return false;
      }
    }
  }
  get inNonArrowFunction() {
    return (this.currentThisScopeFlags() & _scopeflags.ScopeFlag.FUNCTION) > 0;
  }
  get treatFunctionsAsVar() {
    return this.treatFunctionsAsVarInScope(this.currentScope());
  }
  createScope(flags) {
    return new Scope(flags);
  }
  enter(flags) {
    this.scopeStack.push(this.createScope(flags));
  }
  exit() {
    const scope = this.scopeStack.pop();
    return scope.flags;
  }
  treatFunctionsAsVarInScope(scope) {
    return !!(scope.flags & (_scopeflags.ScopeFlag.FUNCTION | _scopeflags.ScopeFlag.STATIC_BLOCK) || !this.parser.inModule && scope.flags & _scopeflags.ScopeFlag.PROGRAM);
  }
  declareName(name, bindingType, loc) {
    let scope = this.currentScope();
    if (bindingType & _scopeflags.BindingFlag.SCOPE_LEXICAL || bindingType & _scopeflags.BindingFlag.SCOPE_FUNCTION) {
      this.checkRedeclarationInScope(scope, name, bindingType, loc);
      let type = scope.names.get(name) || 0;
      if (bindingType & _scopeflags.BindingFlag.SCOPE_FUNCTION) {
        type = type | NameType.Function;
      } else {
        if (!scope.firstLexicalName) {
          scope.firstLexicalName = name;
        }
        type = type | NameType.Lexical;
      }
      scope.names.set(name, type);
      if (bindingType & _scopeflags.BindingFlag.SCOPE_LEXICAL) {
        this.maybeExportDefined(scope, name);
      }
    } else if (bindingType & _scopeflags.BindingFlag.SCOPE_VAR) {
      for (let i = this.scopeStack.length - 1; i >= 0; --i) {
        scope = this.scopeStack[i];
        this.checkRedeclarationInScope(scope, name, bindingType, loc);
        scope.names.set(name, (scope.names.get(name) || 0) | NameType.Var);
        this.maybeExportDefined(scope, name);
        if (scope.flags & _scopeflags.ScopeFlag.VAR) break;
      }
    }
    if (this.parser.inModule && scope.flags & _scopeflags.ScopeFlag.PROGRAM) {
      this.undefinedExports.delete(name);
    }
  }
  maybeExportDefined(scope, name) {
    if (this.parser.inModule && scope.flags & _scopeflags.ScopeFlag.PROGRAM) {
      this.undefinedExports.delete(name);
    }
  }
  checkRedeclarationInScope(scope, name, bindingType, loc) {
    if (this.isRedeclaredInScope(scope, name, bindingType)) {
      this.parser.raise(_parseError.Errors.VarRedeclaration, loc, {
        identifierName: name
      });
    }
  }
  isRedeclaredInScope(scope, name, bindingType) {
    if (!(bindingType & _scopeflags.BindingFlag.KIND_VALUE)) return false;
    if (bindingType & _scopeflags.BindingFlag.SCOPE_LEXICAL) {
      return scope.names.has(name);
    }
    const type = scope.names.get(name);
    if (bindingType & _scopeflags.BindingFlag.SCOPE_FUNCTION) {
      return (type & NameType.Lexical) > 0 || !this.treatFunctionsAsVarInScope(scope) && (type & NameType.Var) > 0;
    }
    return (type & NameType.Lexical) > 0 && !(scope.flags & _scopeflags.ScopeFlag.SIMPLE_CATCH && scope.firstLexicalName === name) || !this.treatFunctionsAsVarInScope(scope) && (type & NameType.Function) > 0;
  }
  checkLocalExport(id) {
    const {
      name
    } = id;
    const topLevelScope = this.scopeStack[0];
    if (!topLevelScope.names.has(name)) {
      this.undefinedExports.set(name, id.loc.start);
    }
  }
  currentScope() {
    return this.scopeStack[this.scopeStack.length - 1];
  }
  currentVarScopeFlags() {
    for (let i = this.scopeStack.length - 1;; i--) {
      const {
        flags
      } = this.scopeStack[i];
      if (flags & _scopeflags.ScopeFlag.VAR) {
        return flags;
      }
    }
  }
  currentThisScopeFlags() {
    for (let i = this.scopeStack.length - 1;; i--) {
      const {
        flags
      } = this.scopeStack[i];
      if (flags & (_scopeflags.ScopeFlag.VAR | _scopeflags.ScopeFlag.CLASS) && !(flags & _scopeflags.ScopeFlag.ARROW)) {
        return flags;
      }
    }
  }
}
exports.default = ScopeHandler;

//# sourceMappingURL=scope.js.map
