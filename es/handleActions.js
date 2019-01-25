"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.baseHandleActions = baseHandleActions;
exports.default = void 0;

var _objPath = _interopRequireDefault(require("./utils/objPath"));

var _isArray = _interopRequireDefault(require("./utils/isArray"));

var _merge = _interopRequireDefault(require("./utils/merge"));

var _mergeDeep = _interopRequireDefault(require("./utils/mergeDeep"));

var _includeAll2 = _interopRequireDefault(require("./utils/includeAll"));

var _action = _interopRequireDefault(require("./action"));

var _createCustomKey = require("./modules/createCustomKey");

var _handleNestedActions = require("./modules/handleNestedActions");

var _handleCombineActions = require("./modules/handleCombineActions");

var _handleDynamicState = require("./modules/handleDynamicState");

var _handleApiRequest = require("./modules/handleApiRequest");

var _handlersKeyMap;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var handlersKeyMap = (_handlersKeyMap = {}, _defineProperty(_handlersKeyMap, _handleNestedActions.key, _handleNestedActions.nestedHandler), _defineProperty(_handlersKeyMap, _handleCombineActions.key, _handleCombineActions.combineActionsHandler), _defineProperty(_handlersKeyMap, _handleDynamicState.key, _handleDynamicState.pathHandler), _defineProperty(_handlersKeyMap, _handleApiRequest.key, _handleApiRequest.apiRequestHandler), _handlersKeyMap);
/**
 *
 * @param {*} handlers
 * @param {*} initialState
 * @return {*}
 */

function baseHandleActions(handlers) {
  var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var reducer = (0, _objPath.default)([(0, _objPath.default)(['type'], action)], handlers);

    if (!reducer) {
      return state;
    }

    if ((0, _isArray.default)(reducer)) {
      return reducer.reduce(function (newState, fn) {
        return (0, _mergeDeep.default)(newState, fn((0, _mergeDeep.default)(state, newState), action));
      }, {});
    }

    return reducer(state, action);
  };
}

var _default = function _default(handlers) {
  var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var otherHandlers = {};
  var otherInitialState = {};

  for (var key in handlers) {
    if ((0, _createCustomKey.isCustomKey)(key)) {
      var extracted = (0, _createCustomKey.extractKey)(key);

      if (!handlersKeyMap[extracted[0]]) {
        throw new Error('action handler not found');
      }

      var _handlersKeyMap$extra = handlersKeyMap[extracted[0]](extracted, handlers[key]),
          _handlersKeyMap$extra2 = _slicedToArray(_handlersKeyMap$extra, 2),
          _handlersKeyMap$extra3 = _handlersKeyMap$extra2[0],
          appendHandlers = _handlersKeyMap$extra3 === void 0 ? {} : _handlersKeyMap$extra3,
          _handlersKeyMap$extra4 = _handlersKeyMap$extra2[1],
          appendInitialState = _handlersKeyMap$extra4 === void 0 ? {} : _handlersKeyMap$extra4;

      otherHandlers = (0, _includeAll2.default)(otherHandlers, appendHandlers);
      otherInitialState = (0, _merge.default)(otherInitialState, appendInitialState);
      delete handlers[key];
    }
  }

  var finalInitialState = (0, _merge.default)(otherInitialState, initialState);
  var mergedHandlers = (0, _includeAll2.default)(handlers, otherHandlers, _defineProperty({}, _action.default.clearState, function () {
    return finalInitialState;
  }));
  var handlerFn = baseHandleActions(mergedHandlers, finalInitialState);

  handlerFn.getHandlers = function () {
    return mergedHandlers;
  };

  handlerFn.getInitialState = function () {
    return finalInitialState;
  };

  return handlerFn;
};

exports.default = _default;