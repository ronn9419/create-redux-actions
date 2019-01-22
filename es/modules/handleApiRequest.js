"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearLookup = exports.apiRequestHandler = exports.apiRequest = exports.extractData = exports.isApiRequest = exports.key = void 0;

var _deepClone = _interopRequireDefault(require("../utils/deepClone"));

var _config = require("../config");

var _merge3 = _interopRequireDefault(require("../utils/merge"));

var _createCustomKey = require("./createCustomKey");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var key = '__api_request__';
exports.key = key;
var lookup = {};

var saveAction = function saveAction(action) {
  var actionKey = action.toString();
  lookup[actionKey] = action;
  return actionKey;
};

var getAction = function getAction(action) {
  return lookup[action] || null;
};

var isApiRequest = function isApiRequest(data) {
  return data[0] === key;
};

exports.isApiRequest = isApiRequest;

var extractData = function extractData(key) {
  if (key && !isApiRequest(key)) {
    return null;
  }

  var prop = key[1];
  var actionKey = key[2];
  var initialState = key[3];
  return [prop, getAction(actionKey), initialState];
};

exports.extractData = extractData;
var apiRequest = (0, _createCustomKey.createKey)(function (stateKey, apiAction) {
  var initialState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (0, _deepClone.default)((0, _config.getConfig)().initialState);
  return [key, stateKey, saveAction(apiAction), initialState];
});
exports.apiRequest = apiRequest;

var baseCreateApiHandler = function baseCreateApiHandler(stateKey, initialState) {
  return function (customHandler, configHandler) {
    return function (state, action) {
      var newState = configHandler(state[stateKey], action, initialState);

      if (!customHandler) {
        return (0, _merge3.default)(state, _defineProperty({}, stateKey, newState));
      }

      return (0, _merge3.default)(state, _defineProperty({}, stateKey, customHandler(state[stateKey], action, newState)));
    };
  };
};

var apiRequestHandler = function apiRequestHandler(key, value) {
  var _handlers;

  var _extractData = extractData(key),
      _extractData2 = _slicedToArray(_extractData, 3),
      prop = _extractData2[0],
      action = _extractData2[1],
      initialState = _extractData2[2];

  var createApiHandler = baseCreateApiHandler(prop, initialState);
  var config = (0, _config.getConfig)();
  var handlers = (_handlers = {}, _defineProperty(_handlers, action[config.requestKey], createApiHandler(value[config.requestKey], config.onRequest)), _defineProperty(_handlers, action[config.successKey], createApiHandler(value[config.successKey], config.onSuccess)), _defineProperty(_handlers, action[config.errorKey], createApiHandler(value[config.errorKey], config.onError)), _defineProperty(_handlers, action[config.cancelKey], createApiHandler(value[config.cancelKey], config.onCancel)), _defineProperty(_handlers, action[config.abortKey], createApiHandler(value[config.abortKey], config.onAbort)), _handlers);
  return [handlers, _defineProperty({}, prop, initialState)];
};

exports.apiRequestHandler = apiRequestHandler;

var clearLookup = function clearLookup() {
  lookup = {};
};

exports.clearLookup = clearLookup;