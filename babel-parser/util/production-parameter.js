"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ParamKind = void 0;
exports.functionFlags = functionFlags;
const ParamKind = exports.ParamKind = {
  PARAM: 0,
  PARAM_YIELD: 1,
  PARAM_AWAIT: 2,
  PARAM_RETURN: 4,
  PARAM_IN: 8
};
class ProductionParameterHandler {
  stacks = [];
  enter(flags) {
    this.stacks.push(flags);
  }
  exit() {
    this.stacks.pop();
  }
  currentFlags() {
    return this.stacks[this.stacks.length - 1];
  }
  get hasAwait() {
    return (this.currentFlags() & ParamKind.PARAM_AWAIT) > 0;
  }
  get hasYield() {
    return (this.currentFlags() & ParamKind.PARAM_YIELD) > 0;
  }
  get hasReturn() {
    return (this.currentFlags() & ParamKind.PARAM_RETURN) > 0;
  }
  get hasIn() {
    return (this.currentFlags() & ParamKind.PARAM_IN) > 0;
  }
}
exports.default = ProductionParameterHandler;
function functionFlags(isAsync, isGenerator) {
  return (isAsync ? ParamKind.PARAM_AWAIT : 0) | (isGenerator ? ParamKind.PARAM_YIELD : 0);
}

//# sourceMappingURL=production-parameter.js.map
