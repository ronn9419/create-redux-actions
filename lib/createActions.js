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

var _merge = _interopRequireDefault(require("./utils/merge"));

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
  var payloadMetaCreator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultPayloadMetaCreator;
  var fn = createAction(type, payloadMetaCreator);
  var funcProps = actionsCreator();
  Object.keys(funcProps).map(function (propKey) {
    fn[propKey] = funcProps[propKey];
    return null;
  });
  return fn;
};
/**
 *
 * @param {*} namespace
 * @param {*} actions
 * @param {*} options
 * @param {*} rootAction
 * @return {*}
 */


function recursiveCreateActions(namespace, actions, options, rootAction) {
  return Object.keys(actions).reduce(function (acc, type) {
    if (type === '_options') {
      return acc;
    }

    var _type = options.transform(type);

    var formattedType = "".concat(namespace).concat(options.prefix).concat(_type).concat(options.suffix);

    if ((0, _isArray.default)(actions[type])) {
      acc[type] = createActionWithActions(formattedType, function () {
        return recursiveCreateActions("".concat(formattedType).concat(options.separator), actions[type][1], (0, _merge.default)(options, actions._options || {}, actions[type][1]._options || {}), actions);
      }, actions[type][0]);
    } else if ((0, _isObject.default)(actions[type])) {
      acc[type] = createActionWithActions(formattedType, function () {
        return recursiveCreateActions("".concat(formattedType).concat(options.separator), actions[type], (0, _merge.default)(options, actions._options || {}, actions[type]._options || {}), actions);
      });
    } else if ((0, _isFunction.default)(actions[type])) {
      acc[type] = createAction(formattedType, actions[type]);
    }

    return acc;
  }, (0, _isFunction.default)(rootAction) ? rootAction : {});
}

var defaultOptions = {
  suffix: '',
  prefix: '',
  separator: '/',
  transform: function transform(key) {
    return key;
  }
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
  var formattedNamespace = "".concat(options.prefix).concat(options.transform(namespace)).concat(options.suffix);
  var rootAction = createAction(formattedNamespace);
  return recursiveCreateActions("".concat(formattedNamespace).concat(options.separator), actions, (0, _merge.default)(options, actions._options || {}), rootAction);
}

var _default = function _default(arg1, arg2, arg3) {
  if ((0, _isString.default)(arg1) && !arg2 && !arg3 || (0, _isString.default)(arg1) && (0, _isFunction.default)(arg2) && !arg3) {
    return createAction(arg1, arg2);
  }

  if ((0, _isString.default)(arg1) && ((0, _isObject.default)(arg2) || (0, _isArray.default)(arg2))) {
    return createActions(arg1, arg2, (0, _merge.default)(defaultOptions, arg3 || {}));
  }
};

exports.default = _default;