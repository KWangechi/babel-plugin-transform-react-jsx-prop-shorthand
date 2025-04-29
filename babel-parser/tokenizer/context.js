"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = exports.TokContext = void 0;
class TokContext {
  constructor(token, preserveSpace) {
    this.token = token;
    this.preserveSpace = !!preserveSpace;
  }
  token;
  preserveSpace;
}
exports.TokContext = TokContext;
const types = exports.types = {
  brace: new TokContext("{"),
  j_oTag: new TokContext("<tag"),
  j_cTag: new TokContext("</tag"),
  j_expr: new TokContext("<tag>...</tag>", true)
};
if (!process.env.BABEL_8_BREAKING) {
  types.template = new TokContext("`", true);
}

//# sourceMappingURL=context.js.map
