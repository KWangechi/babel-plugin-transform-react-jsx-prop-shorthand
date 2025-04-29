"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NodeUtils = void 0;
exports.cloneIdentifier = cloneIdentifier;
exports.cloneStringLiteral = cloneStringLiteral;
var _util = require("./util.js");
var _location = require("../util/location.js");
var _options = require("../options.js");
class Node {
  constructor(parser, pos, loc) {
    this.start = pos;
    this.end = 0;
    this.loc = new _location.SourceLocation(loc);
    if (parser?.optionFlags & _options.OptionFlags.Ranges) this.range = [pos, 0];
    if (parser?.filename) this.loc.filename = parser.filename;
  }
  type = "";
}
const NodePrototype = Node.prototype;
if (!process.env.BABEL_8_BREAKING) {
  NodePrototype.__clone = function () {
    const newNode = new Node(undefined, this.start, this.loc.start);
    const keys = Object.keys(this);
    for (let i = 0, length = keys.length; i < length; i++) {
      const key = keys[i];
      if (key !== "leadingComments" && key !== "trailingComments" && key !== "innerComments") {
        newNode[key] = this[key];
      }
    }
    return newNode;
  };
}
function clonePlaceholder(node) {
  return cloneIdentifier(node);
}
function cloneIdentifier(node) {
  const {
    type,
    start,
    end,
    loc,
    range,
    extra,
    name
  } = node;
  const cloned = Object.create(NodePrototype);
  cloned.type = type;
  cloned.start = start;
  cloned.end = end;
  cloned.loc = loc;
  cloned.range = range;
  cloned.extra = extra;
  cloned.name = name;
  if (type === "Placeholder") {
    cloned.expectedNode = node.expectedNode;
  }
  return cloned;
}
function cloneStringLiteral(node) {
  const {
    type,
    start,
    end,
    loc,
    range,
    extra
  } = node;
  if (type === "Placeholder") {
    return clonePlaceholder(node);
  }
  const cloned = Object.create(NodePrototype);
  cloned.type = type;
  cloned.start = start;
  cloned.end = end;
  cloned.loc = loc;
  cloned.range = range;
  if (node.raw !== undefined) {
    cloned.raw = node.raw;
  } else {
    cloned.extra = extra;
  }
  cloned.value = node.value;
  return cloned;
}
class NodeUtils extends _util.default {
  startNode() {
    const loc = this.state.startLoc;
    return new Node(this, loc.index, loc);
  }
  startNodeAt(loc) {
    return new Node(this, loc.index, loc);
  }
  startNodeAtNode(type) {
    return this.startNodeAt(type.loc.start);
  }
  finishNode(node, type) {
    return this.finishNodeAt(node, type, this.state.lastTokEndLoc);
  }
  finishNodeAt(node, type, endLoc) {
    if (process.env.NODE_ENV !== "production" && node.end > 0) {
      throw new Error("Do not call finishNode*() twice on the same node." + " Instead use resetEndLocation() or change type directly.");
    }
    node.type = type;
    node.end = endLoc.index;
    node.loc.end = endLoc;
    if (this.optionFlags & _options.OptionFlags.Ranges) node.range[1] = endLoc.index;
    if (this.optionFlags & _options.OptionFlags.AttachComment) {
      this.processComment(node);
    }
    return node;
  }
  resetStartLocation(node, startLoc) {
    node.start = startLoc.index;
    node.loc.start = startLoc;
    if (this.optionFlags & _options.OptionFlags.Ranges) node.range[0] = startLoc.index;
  }
  resetEndLocation(node, endLoc = this.state.lastTokEndLoc) {
    node.end = endLoc.index;
    node.loc.end = endLoc;
    if (this.optionFlags & _options.OptionFlags.Ranges) node.range[1] = endLoc.index;
  }
  resetStartLocationFromNode(node, locationNode) {
    this.resetStartLocation(node, locationNode.loc.start);
  }
}
exports.NodeUtils = NodeUtils;

//# sourceMappingURL=node.js.map
