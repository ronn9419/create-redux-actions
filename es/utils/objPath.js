"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* eslint-disable no-prototype-builtins */
var isObjectLike = function isObjectLike(obj) {
  return obj instanceof Object;
};

var _default = function _default(path, obj) {
  var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

  if (!isObjectLike(obj)) {
    return defaultValue;
  }

  var acc = obj;
  var len = path.length;

  for (var i = 0; i < len; i++) {
    if (i === len - 1) {
      return acc.hasOwnProperty && acc.hasOwnProperty(path[i]) ? acc[path[i]] : defaultValue;
    }

    if (!isObjectLike(acc[path[i]])) {
      return defaultValue;
    }

    acc = acc[path[i]];
  }
};

exports.default = _default;