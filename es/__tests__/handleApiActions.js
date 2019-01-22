"use strict";

var _redux = require("redux");

var _handleApiActions3 = _interopRequireDefault(require("../handleApiActions"));

var _handleDynamicState = require("../modules/handleDynamicState");

var _createActions = _interopRequireDefault(require("../createActions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

describe('handleApiActions', function () {
  it('returns correct handlers', function () {
    var actions = (0, _createActions.default)('my-action', {
      request: {},
      error: {},
      success: {},
      cancel: {},
      abort: {}
    });
    var reducer = (0, _handleApiActions3.default)(actions, {});
    var handlers = reducer.getHandlers();
    expect(handlers[actions.request]).toEqual(expect.any(Function));
    expect(handlers[actions.success]).toEqual(expect.any(Function));
    expect(handlers[actions.error]).toEqual(expect.any(Function));
    expect(handlers[actions.cancel]).toEqual(expect.any(Function));
    expect(handlers[actions.abort]).toEqual(expect.any(Function));
  });
  it('returns correct initialState', function () {
    var actions = (0, _createActions.default)('my-action', {
      request: {},
      error: {},
      success: {},
      cancel: {},
      abort: {}
    });
    var reducer = (0, _handleApiActions3.default)(actions, {});
    var initialState = reducer.getInitialState();
    expect(initialState).toEqual({
      pending: false,
      error: false,
      data: []
    });
  });
  it('overrides initialState', function () {
    var actions = (0, _createActions.default)('my-action', {
      request: {},
      error: {},
      success: {},
      cancel: {},
      abort: {}
    });
    var reducer = (0, _handleApiActions3.default)(actions, {}, {
      other: false,
      data: null
    });
    var initialState = reducer.getInitialState();
    expect(initialState).toEqual({
      pending: false,
      error: false,
      data: null,
      other: false
    });
  });
  it('handles actions', function () {
    var actions = (0, _createActions.default)('my-action', {
      request: {},
      error: {},
      success: {},
      cancel: {},
      abort: {}
    });
    var myReducer = (0, _handleApiActions3.default)(actions, {}, {
      otherData: true
    });
    var store = (0, _redux.createStore)((0, _redux.combineReducers)({
      myReducer: myReducer
    }));
    expect(store.getState()).toEqual({
      myReducer: {
        pending: false,
        error: false,
        data: [],
        otherData: true
      }
    });
    store.dispatch(actions.request());
    expect(store.getState()).toEqual({
      myReducer: {
        pending: true,
        error: false,
        data: [],
        otherData: true
      }
    });
    store.dispatch(actions.success('payload'));
    expect(store.getState()).toEqual({
      myReducer: {
        pending: false,
        error: false,
        data: 'payload',
        otherData: true
      }
    });
    store.dispatch(actions.error(true));
    expect(store.getState()).toEqual({
      myReducer: {
        pending: false,
        error: true,
        data: [],
        otherData: true
      }
    });
    store.dispatch(actions.cancel());
    expect(store.getState()).toEqual({
      myReducer: {
        pending: false,
        error: false,
        data: [],
        otherData: true
      }
    });
    store.dispatch(actions.abort());
    expect(store.getState()).toEqual({
      myReducer: {
        pending: false,
        error: false,
        data: [],
        otherData: true
      }
    });
  });
  it('handles custom reducers', function () {
    var actions = (0, _createActions.default)('my-action', {
      request: {},
      error: {},
      success: {},
      cancel: {},
      abort: {}
    });
    var myReducer = (0, _handleApiActions3.default)(actions, {
      success: function success(state, action, nextState) {
        expect(state).toEqual({
          error: false,
          pending: false,
          data: [],
          otherData: true
        });
        expect(nextState).toEqual({
          error: false,
          pending: false,
          data: 'payload',
          otherData: true
        });
        return _objectSpread({}, nextState, {
          otherData: false
        });
      }
    }, {
      otherData: true
    });
    var store = (0, _redux.createStore)((0, _redux.combineReducers)({
      myReducer: myReducer
    }));
    expect(store.getState()).toEqual({
      myReducer: {
        pending: false,
        error: false,
        data: [],
        otherData: true
      }
    });
    store.dispatch(actions.success('payload'));
    expect(store.getState()).toEqual({
      myReducer: {
        pending: false,
        error: false,
        data: 'payload',
        otherData: false
      }
    });
  });
  it('handles other action', function () {
    var actions = (0, _createActions.default)('my-action', {
      request: {},
      error: {},
      success: {},
      cancel: {},
      abort: {}
    });
    var otherAction = (0, _createActions.default)('other-action');
    var myReducer = (0, _handleApiActions3.default)(actions, _defineProperty({
      success: function success(state, action, nextState) {
        expect(state).toEqual({
          error: false,
          pending: false,
          data: [],
          otherData: true
        });
        expect(nextState).toEqual({
          error: false,
          pending: false,
          data: 'payload',
          otherData: true
        });
        return _objectSpread({}, nextState, {
          otherData: false
        });
      }
    }, otherAction, function (state, action) {
      return _objectSpread({}, state, {
        otherData: action.payload
      });
    }), {
      otherData: true
    });
    var store = (0, _redux.createStore)((0, _redux.combineReducers)({
      myReducer: myReducer
    }));
    expect(store.getState()).toEqual({
      myReducer: {
        pending: false,
        error: false,
        data: [],
        otherData: true
      }
    });
    store.dispatch(actions.success('payload'));
    expect(store.getState()).toEqual({
      myReducer: {
        pending: false,
        error: false,
        data: 'payload',
        otherData: false
      }
    });
    store.dispatch(otherAction('my-other-payload'));
    expect(store.getState()).toEqual({
      myReducer: {
        pending: false,
        error: false,
        data: 'payload',
        otherData: 'my-other-payload'
      }
    });
  });
  it('works together with other module', function () {
    var actions = (0, _createActions.default)('my-action', {
      request: {},
      error: {},
      success: {},
      cancel: {},
      abort: {}
    });
    var otherAction = (0, _createActions.default)('other-action');
    var myReducer = (0, _handleApiActions3.default)(actions, _defineProperty({
      request: function request(state, action, nextState) {
        return _objectSpread({}, state, nextState, {
          pending: 1
        });
      }
    }, (0, _handleDynamicState.path)('otherData'), _defineProperty({}, otherAction, function (state, action) {
      return _objectSpread({}, state, {
        data: action.payload
      });
    })), {
      otherData: {
        data: null
      }
    });
    var store = (0, _redux.createStore)((0, _redux.combineReducers)({
      myReducer: myReducer
    }));
    expect(store.getState()).toEqual({
      myReducer: {
        pending: false,
        error: false,
        data: [],
        otherData: {
          data: null
        }
      }
    });
    store.dispatch(actions.request());
    expect(store.getState()).toEqual({
      myReducer: {
        pending: 1,
        error: false,
        data: [],
        otherData: {
          data: null
        }
      }
    });
    store.dispatch(otherAction('payload'));
    expect(store.getState()).toEqual({
      myReducer: {
        pending: 1,
        error: false,
        data: [],
        otherData: {
          data: 'payload'
        }
      }
    });
  });
});