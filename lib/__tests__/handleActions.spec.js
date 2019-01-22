"use strict";

var _redux = require("redux");

var _createActions = _interopRequireDefault(require("../createActions"));

var _handleActions2 = _interopRequireDefault(require("../handleActions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

describe('handleActions module', function () {
  it('handle actions', function () {
    var action = (0, _createActions.default)('test-namespace', {
      test: {}
    });
    var reducer = (0, _handleActions2.default)(_defineProperty({}, action.test, function (state, _ref) {
      var payload = _ref.payload;
      return {
        data: payload
      };
    }), {
      data: null
    });
    var rootReducer = (0, _redux.combineReducers)({
      test: reducer
    });
    var store = (0, _redux.createStore)(rootReducer);
    store.dispatch(action.test('abc'));
    expect(store.getState()).toEqual({
      test: {
        data: 'abc'
      }
    });
  });
});