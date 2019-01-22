"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = require("./config");

var _merge = _interopRequireDefault(require("./utils/merge"));

var _mergeDeep = _interopRequireDefault(require("./utils/mergeDeep"));

var _handleActions = _interopRequireDefault(require("./handleActions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var baseCreateApiHandler = function baseCreateApiHandler(customHandler, configHandler, initialState) {
  return function (state, action) {
    var newState = configHandler(state, action, initialState);

    if (!customHandler) {
      return (0, _merge.default)(state, newState);
    }

    return (0, _merge.default)(state, customHandler(state, action, newState));
  };
};

var _default = function _default(action, handlers) {
  var initialState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var config = (0, _config.getConfig)();
  var apiInitialState = {
    error: initialState.error === undefined ? config.initialState.error : initialState.error,
    data: initialState.data === undefined ? config.initialState.data : initialState.data,
    pending: initialState.pending === undefined ? config.initialState.pending : initialState.pending
  };
  handlers[action[config.requestKey]] = baseCreateApiHandler(handlers[config.requestKey], config.onRequest, apiInitialState);
  handlers[action[config.successKey]] = baseCreateApiHandler(handlers[config.successKey], config.onSuccess, apiInitialState);
  handlers[action[config.errorKey]] = baseCreateApiHandler(handlers[config.errorKey], config.onError, apiInitialState);
  handlers[action[config.cancelKey]] = baseCreateApiHandler(handlers[config.cancelKey], config.onCancel, apiInitialState);
  handlers[action[config.abortKey]] = baseCreateApiHandler(handlers[config.abortKey], config.onAbort, apiInitialState);
  delete handlers[config.requestKey];
  delete handlers[config.successKey];
  delete handlers[config.errorKey];
  delete handlers[config.cancelKey];
  delete handlers[config.abortKey];
  return (0, _handleActions.default)(handlers, (0, _mergeDeep.default)(config.initialState, initialState));
};

exports.default = _default;