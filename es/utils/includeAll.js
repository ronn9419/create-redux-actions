"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* eslint-disable no-prototype-builtins */
var _default = function _default() {
  for (var _len = arguments.length, objs = new Array(_len), _key = 0; _key < _len; _key++) {
    objs[_key] = arguments[_key];
  }

  return objs.reduce(function (all, current) {
    return Object.keys(current).reduce(function (all2, key) {
      if (all2.hasOwnProperty(key)) {
        if (Array.isArray(all2[key])) {
          all2[key].push(current[key]);
        } else {
          all2[key] = [all2[key], current[key]];
        }
      } else {
        all2[key] = current[key];
      }

      return all2;
    }, all);
  }, {});
};

exports.default = _default;