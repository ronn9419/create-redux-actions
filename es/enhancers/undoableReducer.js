"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undoableReducer;
exports.futureCountSelector = exports.pastCountSelector = exports.futureSelector = exports.pastSelector = exports.clearHistory = exports.saveState = exports.redo = exports.undo = void 0;

var _mergeDeep2 = _interopRequireDefault(require("../utils/mergeDeep"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }

function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var undo = function undo(key) {
  return {
    type: "".concat(key, "_UNDO")
  };
};

exports.undo = undo;

var redo = function redo(key) {
  return {
    type: "".concat(key, "_REDO")
  };
};

exports.redo = redo;

var saveState = function saveState(key) {
  return {
    type: "".concat(key, "_SAVE_UNDOABLE")
  };
};

exports.saveState = saveState;

var clearHistory = function clearHistory(key) {
  return {
    type: "".concat(key, "_CLEAR_UNDOABLE")
  };
};

exports.clearHistory = clearHistory;
var initialState = {
  past: [],
  future: []
};
var historyKey = '_history';

var pastSelector = function pastSelector(reducerState) {
  return reducerState[historyKey].past;
};

exports.pastSelector = pastSelector;

var futureSelector = function futureSelector(reducerState) {
  return reducerState[historyKey].future;
};

exports.futureSelector = futureSelector;

var pastCountSelector = function pastCountSelector(reducerState) {
  return pastSelector(reducerState).length;
};

exports.pastCountSelector = pastCountSelector;

var futureCountSelector = function futureCountSelector(reducerState) {
  return futureSelector(reducerState).length;
};

exports.futureCountSelector = futureCountSelector;

function undoableReducer(reducer) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$key = _ref.key,
      key = _ref$key === void 0 ? null : _ref$key,
      _ref$limit = _ref.limit,
      limit = _ref$limit === void 0 ? 0 : _ref$limit;

  var reducerKey = key || reducer.key;
  var undoType = undo(reducerKey).type;
  var redoType = redo(reducerKey).type;
  var saveStateType = saveState(reducerKey).type;
  var clearType = clearHistory(reducerKey).type;
  return function (state, action) {
    if (!state) {
      return _objectSpread({}, reducer(state, action), _defineProperty({}, historyKey, initialState));
    }

    if (reducerKey) {
      switch (action.type) {
        case undoType:
          var history_U = state[historyKey],
              currentState_U = _objectWithoutProperties(state, [historyKey].map(_toPropertyKey));

          if (!state[historyKey].past.length) {
            return state;
          }

          return (0, _mergeDeep2.default)(state, _objectSpread(_defineProperty({}, historyKey, {
            past: state[historyKey].past.slice(0, state[historyKey].past.length - 1),
            future: [currentState_U].concat(_toConsumableArray(state[historyKey].future))
          }), state[historyKey].past.slice(state[historyKey].past.length - 1)[0]));

        case redoType:
          var history_R = state[historyKey],
              currentState_R = _objectWithoutProperties(state, [historyKey].map(_toPropertyKey));

          if (!state[historyKey].future.length) {
            return state;
          }

          return (0, _mergeDeep2.default)(state, _objectSpread(_defineProperty({}, historyKey, {
            future: state[historyKey].future.slice(1),
            past: [].concat(_toConsumableArray(state[historyKey].past), [currentState_R])
          }), state[historyKey].future[0]));

        case saveStateType:
          var history = state[historyKey],
              currentState = _objectWithoutProperties(state, [historyKey].map(_toPropertyKey));

          var past = [].concat(_toConsumableArray(state[historyKey].past), [currentState]);

          if (limit > 0 && past.length >= limit) {
            past = past.slice(1);
          }

          return (0, _mergeDeep2.default)(state, _defineProperty({}, historyKey, {
            past: past,
            future: []
          }));

        case clearType:
          return _objectSpread({}, state, _defineProperty({}, historyKey, initialState));
      }
    }

    return reducer(state, action);
  };
}