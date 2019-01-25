"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineActionsHandler = exports.extractData = exports.isMulti = exports.multi = exports.key = void 0;

var _isFunction = _interopRequireDefault(require("../utils/isFunction"));

var _createCustomKey = require("./createCustomKey");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable array-callback-return,no-else-return */
var key = '__multi__';
exports.key = key;
var multi = (0, _createCustomKey.createKey)(function () {
  for (var _len = arguments.length, actions = new Array(_len), _key = 0; _key < _len; _key++) {
    actions[_key] = arguments[_key];
  }

  var strActions = actions.map(function (action) {
    return action.toString();
  });
  return [key, strActions];
});
exports.multi = multi;

var isMulti = function iscombineActionsdata) {
  return data[0] === key;
};

exports.isMulti = isMulti;

var extractData = function extractData(key) {
  if (key && !iscombineActionskey)) {
    return null;
  }

  return key[1];
};

exports.extractData = extractData;

var combineActionsHandler = function combineActionsHandler(key, value) {
  if (!(0, _isFunction.default)(value)) {
    throw new Error('Multi handler value must be a function');
  }

  var data = extractData(key);
  return [data.reduce(function (acc, cur) {
    acc[cur] = value;
    return acc;
  }, {})];
};

exports.combineActionsHandler = combineActionsHandler;