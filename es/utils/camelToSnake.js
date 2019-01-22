"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(string) {
  return string.replace(/[\w]([A-Z])/g, function (m) {
    return m[0] + '_' + m[1];
  }).toUpperCase();
};

exports.default = _default;