"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAction = createAction;
exports.createActions = createActions;
exports.default = void 0;

var _isObject = _interopRequireDefault(require("./utils/isObject"));

var _isArray = _interopRequireDefault(require("./utils/isArray"));

var _isString = _interopRequireDefault(require("./utils/isString"));

var _isFunction = _interopRequireDefault(require("./utils/isFunction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultPayloadMetaCreator = function defaultPayloadMetaCreator(arg1, arg2, arg3) {
  return [arg1, arg2, arg3];
};
/**
 * Create an FSA compliant action creator with payload-meta creator
 * @param {String} actionName
 * @param {Function} [payloadMetaCreator]
 * @return {*}
 */


function createAction(actionName) {
  var payloadMetaCreator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultPayloadMetaCreator;

  var actionCreator = function actionCreator() {
    var result = payloadMetaCreator.apply(void 0, arguments);
    var payload = result;
    var meta;
    var error;

    if (Array.isArray(result)) {
      payload = result[0];
      meta = result[1];
      error = result[2];
    }

    return _objectSpread({
      type: actionName
    }, payload !== undefined && {
      payload: payload
    }, meta !== undefined && {
      meta: meta
    }, error !== undefined && {
      error: error
    });
  };

  actionCreator.toString = function () {
    return actionName;
  };

  return actionCreator;
}
/**
 *
 * @param {*} type
 * @param {*} actionsCreator
 */


var createActionWithActions = function createActionWithActions(type, actionsCreator) {
  var fn = createAction(type);
  var funcProps = actionsCreator();
  Object.keys(funcProps).map(function (propKey) {
    fn[propKey] = funcProps[propKey];
    return null;
  });
  return fn;
};
/**
 *
 * @param {*} actions
 * @param {*} namespace
 * @param {*} options
 * @return {*}
 */


function recursiveCreateActions(namespace, actions, options, rootAction) {
  return Object.keys(actions).reduce(function (acc, type) {
    if ((0, _isArray.default)(actions[type])) {
      acc[type] = recursiveCreateActions("".concat(options.separator).concat(type), actions[type][0], actions[type][1] || options, actions);
    } else if ((0, _isObject.default)(actions[type])) {
      var formattedType = "".concat(namespace).concat(options.separator).concat(options.prefix).concat(type).concat(options.suffix);
      acc[type] = createActionWithActions(formattedType, function () {
        return recursiveCreateActions(formattedType, actions[type], options, actions);
      });
    } else if ((0, _isFunction.default)(actions[type])) {
      var _formattedType = "".concat(namespace).concat(options.separator).concat(options.prefix).concat(type).concat(options.suffix);

      acc[type] = createAction(_formattedType, actions[type]);
    }

    return acc;
  }, (0, _isFunction.default)(rootAction) ? rootAction : {});
}

var defaultOptions = {
  suffix: '',
  prefix: '',
  separator: '/'
  /**
   * Creates a nested FSA compliant action creators with namespace, and options
   * @param {string} namespace
   * @param {Object.<string, any>} actions
   * @param {Object} [options]
   * @return {*}
   */

};

function createActions(namespace, actions) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultOptions;
  var formattedNamespace = "".concat(options.prefix).concat(namespace).concat(options.suffix);
  var rootAction = createAction(formattedNamespace);

  if ((0, _isArray.default)(actions)) {
    return recursiveCreateActions(formattedNamespace, actions[0], actions[1] || options, rootAction);
  }

  return recursiveCreateActions(formattedNamespace, actions, options, rootAction);
}

var _default = function _default(arg1, arg2, arg3) {
  if ((0, _isString.default)(arg1) && !arg2 && !arg3 || (0, _isString.default)(arg1) && (0, _isFunction.default)(arg2) && !arg3) {
    return createAction(arg1, arg2);
  }

  if ((0, _isString.default)(arg1) && ((0, _isObject.default)(arg2) || (0, _isArray.default)(arg2))) {
    return createActions(arg1, arg2, arg3);
  }
};

exports.default = _default;