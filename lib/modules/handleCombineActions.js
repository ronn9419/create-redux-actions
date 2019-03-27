"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineActionsHandler = exports.extractData = exports.isCombined = exports.combineActions = exports.key = void 0;

var _isFunction = _interopRequireDefault(require("../utils/isFunction"));

var _createCustomKey = require("./createCustomKey");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable array-callback-return,no-else-return */
var key = '__combine__';
exports.key = key;
var combineActions = (0, _createCustomKey.createKey)(function () {
  for (var _len = arguments.length, actions = new Array(_len), _key = 0; _key < _len; _key++) {
    actions[_key] = arguments[_key];
  }

  var strActions = actions.map(function (action) {
    return action.toString();
  });
  return [key, strActions];
});
exports.combineActions = combineActions;

var isCombined = function isCombined(data) {
  return data[0] === key;
};

exports.isCombined = isCombined;

var extractData = function extractData(key) {
  if (key && !isCombined(key)) {
    return null;
  }

  return key[1];
};

exports.extractData = extractData;

var combineActionsHandler = function combineActionsHandler(key, value) {
  if (!(0, _isFunction.default)(value)) {
    throw new Error('CombineActions handler value must be a function');
  }

  var data = extractData(key);
  return [data.reduce(function (acc, cur) {
    acc[cur] = value;
    return acc;
  }, {})];
};

exports.combineActionsHandler = combineActionsHandler;