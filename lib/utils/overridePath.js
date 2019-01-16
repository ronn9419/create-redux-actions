"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable no-fallthrough */
var overridePath = function overridePath(path, target, value) {
  switch (path.length) {
    case 0:
      return value;

    case 1:
      if (value === undefined) {
        var p = path.shift();

        var newState = _objectSpread({}, target, _defineProperty({}, p, undefined));

        delete newState[p];
        return newState;
      }

    default:
      {
        var _p = path.shift();

        return _objectSpread({}, target, _defineProperty({}, _p, overridePath(path, target[_p], value)));
      }
  }
};

var _default = overridePath;
exports.default = _default;