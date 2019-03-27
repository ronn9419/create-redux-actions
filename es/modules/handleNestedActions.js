"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearData = exports.nestedHandler = exports.getNestedValue = exports.extractData = exports.isNested = exports.nested = exports.key = void 0;

var _isFunction = _interopRequireDefault(require("../utils/isFunction"));

var _isArray = _interopRequireDefault(require("../utils/isArray"));

var _isObject = _interopRequireDefault(require("../utils/isObject"));

var _createCustomKey = require("./createCustomKey");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable array-callback-return,no-else-return */
var lookup = {};
var key = '__nested__';
exports.key = key;
var nested = (0, _createCustomKey.createKey)(function (action) {
  lookup[action.toString()] = action;
  return [key, action.toString()];
});
exports.nested = nested;

var isNested = function isNested(data) {
  return data[0] === key;
};

exports.isNested = isNested;

var extractData = function extractData(key) {
  if (key && !isNested(key)) {
    return null;
  }

  return key[1];
};

exports.extractData = extractData;

var getNestedValue = function getNestedValue(data) {
  return lookup[data];
};

exports.getNestedValue = getNestedValue;

var recursiveMapping = function recursiveMapping(value, action) {
  var handlers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return Object.keys(value).reduce(function (acc, v) {
    if ((0, _isArray.default)(value[v])) {
      acc[action[v]] = value[v][0];
      return recursiveMapping(value[v][1], action[v], acc);
    } else if ((0, _isObject.default)(value[v])) {
      return recursiveMapping(value[v], action[v], acc);
    } else if ((0, _isFunction.default)(value[v])) {
      acc[action[v]] = value[v];
      return acc;
    }
  }, handlers);
};

var nestedHandler = function nestedHandler(key, value) {
  var data = extractData(key);
  var action = getNestedValue(data);
  var handlers = recursiveMapping(value, action);
  return [handlers];
};

exports.nestedHandler = nestedHandler;

var clearData = function clearData() {
  lookup = {};
};

exports.clearData = clearData;