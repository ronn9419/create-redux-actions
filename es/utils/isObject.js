"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* eslint-disable no-new-object */
var _default = function _default(value) {
  if (Array.isArray(value) || typeof value === 'function') {
    return false;
  }

  return new Object(value) === value;
};

exports.default = _default;