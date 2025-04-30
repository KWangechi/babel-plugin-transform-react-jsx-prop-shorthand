"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SourceLocation = exports.Position = void 0;
exports.createPositionWithColumnOffset = createPositionWithColumnOffset;
class Position {
  line;
  column;
  index;
  constructor(line, col, index) {
    this.line = line;
    this.column = col;
    this.index = index;
  }
}
exports.Position = Position;
class SourceLocation {
  start;
  end;
  filename;
  identifierName;
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}
exports.SourceLocation = SourceLocation;
function createPositionWithColumnOffset(position, columnOffset) {
  const {
    line,
    column,
    index
  } = position;
  return new Position(line, column + columnOffset, index + columnOffset);
}

//# sourceMappingURL=location.js.map
