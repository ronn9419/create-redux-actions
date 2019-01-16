"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var pathToObj = function pathToObj(path, value) {
  if (path.length === 0) {
    return value;
  }

  return _defineProperty({}, path.shift(), pathToObj(path, value));
};

var _default = function _default() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var value = arguments.length > 1 ? arguments[1] : undefined;
  return pathToObj(path.concat(), value);
};

exports.default = _default;