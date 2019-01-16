"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetConfig = exports.getConfig = exports.setConfig = void 0;

var _mergeDeep = _interopRequireDefault(require("./utils/mergeDeep"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialConfig = {
  initialState: {
    pending: false,
    error: false,
    data: []
  },
  requestKey: 'request',
  errorKey: 'error',
  successKey: 'success',
  cancelKey: 'cancel',
  abortKey: 'abort',
  onSuccess: function onSuccess(state, action, initialState) {
    return _objectSpread({}, state, initialState, {
      data: action.payload
    });
  },
  onError: function onError(state, action, initialState) {
    return _objectSpread({}, state, initialState, {
      error: action.payload
    });
  },
  onRequest: function onRequest(state, action, initialState) {
    return _objectSpread({}, state, initialState, {
      pending: true
    });
  },
  onCancel: function onCancel(state, action, initialState) {
    return _objectSpread({}, state, initialState);
  },
  onAbort: function onAbort(state, action, initialState) {
    return _objectSpread({}, state, initialState);
  }
};
var config = initialConfig;

var setConfig = function setConfig(newConfig) {
  config = (0, _mergeDeep.default)(config, newConfig);
};

exports.setConfig = setConfig;

var getConfig = function getConfig() {
  return config;
};

exports.getConfig = getConfig;

var resetConfig = function resetConfig() {
  return setConfig(initialConfig);
};

exports.resetConfig = resetConfig;