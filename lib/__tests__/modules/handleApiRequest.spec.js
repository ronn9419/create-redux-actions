"use strict";

var _redux = require("redux");

var _createActions = _interopRequireDefault(require("../../createActions"));

var _handleActions10 = _interopRequireDefault(require("../../handleActions"));

var _createCustomKey = require("../../modules/createCustomKey");

var _handleApiRequest = require("../../modules/handleApiRequest");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var initialConfig = {
  initialState: {
    pending: false,
    error: false,
    data: []
  }
};
describe('apiRequest module', function () {
  describe('key', function () {
    it('correct key', function () {
      var action = (0, _createActions.default)('my-action');
      var apiRequestKey = (0, _handleApiRequest.apiRequest)('my-state', action);
      var key = (0, _createCustomKey.extractKey)(apiRequestKey);

      var _extractData = (0, _handleApiRequest.extractData)(key),
          _extractData2 = _slicedToArray(_extractData, 3),
          prop = _extractData2[0],
          extractedAction = _extractData2[1],
          extractedInitialState = _extractData2[2];

      expect(extractedAction === action).toBe(true);
      expect(prop).toBe('my-state');
      expect(extractedInitialState).toEqual(initialConfig.initialState);
      (0, _handleApiRequest.clearLookup)();
    });
    it('correct key with correct initialState', function () {
      var action = (0, _createActions.default)('my-action');
      var apiRequestKey = (0, _handleApiRequest.apiRequest)('my-state', action, {
        error: null,
        data: null,
        pending: 0
      });
      var key = (0, _createCustomKey.extractKey)(apiRequestKey);

      var _extractData3 = (0, _handleApiRequest.extractData)(key),
          _extractData4 = _slicedToArray(_extractData3, 3),
          prop = _extractData4[0],
          extractedAction = _extractData4[1],
          extractedInitialState = _extractData4[2];

      expect(extractedAction === action).toBe(true);
      expect(prop).toBe('my-state');
      expect(extractedInitialState).toEqual({
        error: null,
        data: null,
        pending: 0
      });
      (0, _handleApiRequest.clearLookup)();
    });
  });
  describe('handlers and initialState', function () {
    it('creates correct handler', function () {
      var action = (0, _createActions.default)('my-action', {
        success: {},
        request: {},
        error: {},
        abort: {},
        cancel: {}
      });
      var myReducer = (0, _handleActions10.default)(_defineProperty({}, (0, _handleApiRequest.apiRequest)('myRequest', action), {}), {
        someState: {}
      });
      var handlers = myReducer.getHandlers();
      expect(handlers[action.request]).toEqual(expect.any(Function));
      expect(handlers[action.success]).toEqual(expect.any(Function));
      expect(handlers[action.error]).toEqual(expect.any(Function));
      expect(handlers[action.cancel]).toEqual(expect.any(Function));
      expect(handlers[action.abort]).toEqual(expect.any(Function));
      expect(myReducer.getInitialState()).toEqual({
        myRequest: {
          pending: false,
          error: false,
          data: []
        },
        someState: {}
      });
      (0, _handleApiRequest.clearLookup)();
    });
    it('creates correct handler with multiple action', function () {
      var _handleActions2;

      var action1 = (0, _createActions.default)('my-action', {
        success: {},
        request: {},
        error: {},
        abort: {},
        cancel: {}
      });
      var action2 = (0, _createActions.default)('my-action2', {
        success: {},
        request: {},
        error: {},
        abort: {},
        cancel: {}
      });
      var myReducer = (0, _handleActions10.default)((_handleActions2 = {}, _defineProperty(_handleActions2, (0, _handleApiRequest.apiRequest)('myRequest1', action1), {}), _defineProperty(_handleActions2, (0, _handleApiRequest.apiRequest)('myRequest2', action2), {}), _handleActions2), {
        someState: {}
      });
      var handlers = myReducer.getHandlers();
      expect(handlers[action1.request]).toEqual(expect.any(Function));
      expect(handlers[action1.success]).toEqual(expect.any(Function));
      expect(handlers[action1.error]).toEqual(expect.any(Function));
      expect(handlers[action1.cancel]).toEqual(expect.any(Function));
      expect(handlers[action1.abort]).toEqual(expect.any(Function));
      expect(handlers[action2.request]).toEqual(expect.any(Function));
      expect(handlers[action2.success]).toEqual(expect.any(Function));
      expect(handlers[action2.error]).toEqual(expect.any(Function));
      expect(handlers[action2.cancel]).toEqual(expect.any(Function));
      expect(handlers[action2.abort]).toEqual(expect.any(Function));
      expect(myReducer.getInitialState()).toEqual({
        myRequest1: {
          pending: false,
          error: false,
          data: []
        },
        myRequest2: {
          pending: false,
          error: false,
          data: []
        },
        someState: {}
      });
      (0, _handleApiRequest.clearLookup)();
    });
    it('creates correct initialState', function () {
      var action = (0, _createActions.default)('my-action', {
        success: {},
        request: {},
        error: {},
        abort: {},
        cancel: {}
      });
      var myReducer = (0, _handleActions10.default)(_defineProperty({}, (0, _handleApiRequest.apiRequest)('myRequest', action, {
        error: null,
        data: null,
        pending: 0
      }), {}), {
        someState: {}
      });
      var handlers = myReducer.getHandlers();
      expect(handlers[action.request]).toEqual(expect.any(Function));
      expect(handlers[action.success]).toEqual(expect.any(Function));
      expect(handlers[action.error]).toEqual(expect.any(Function));
      expect(handlers[action.cancel]).toEqual(expect.any(Function));
      expect(handlers[action.abort]).toEqual(expect.any(Function));
      expect(myReducer.getInitialState()).toEqual({
        myRequest: {
          error: null,
          data: null,
          pending: 0
        },
        someState: {}
      });
      (0, _handleApiRequest.clearLookup)();
    });
    it('creates correct initialState with multiple apiRequest', function () {
      var _handleActions4;

      var action1 = (0, _createActions.default)('my-action1', {
        success: {},
        request: {},
        error: {},
        abort: {},
        cancel: {}
      });
      var action2 = (0, _createActions.default)('my-action2', {
        success: {},
        request: {},
        error: {},
        abort: {},
        cancel: {}
      });
      var myReducer = (0, _handleActions10.default)((_handleActions4 = {}, _defineProperty(_handleActions4, (0, _handleApiRequest.apiRequest)('myRequest1', action1, {
        error: null,
        data: null,
        pending: 0
      }), {}), _defineProperty(_handleActions4, (0, _handleApiRequest.apiRequest)('myRequest2', action2, {
        error: [],
        data: false,
        pending: []
      }), {}), _handleActions4), {
        someState: {}
      });
      var handlers = myReducer.getHandlers();
      expect(handlers[action1.request]).toEqual(expect.any(Function));
      expect(handlers[action1.success]).toEqual(expect.any(Function));
      expect(handlers[action1.error]).toEqual(expect.any(Function));
      expect(handlers[action1.cancel]).toEqual(expect.any(Function));
      expect(handlers[action1.abort]).toEqual(expect.any(Function));
      expect(handlers[action2.request]).toEqual(expect.any(Function));
      expect(handlers[action2.success]).toEqual(expect.any(Function));
      expect(handlers[action2.error]).toEqual(expect.any(Function));
      expect(handlers[action2.cancel]).toEqual(expect.any(Function));
      expect(handlers[action2.abort]).toEqual(expect.any(Function));
      expect(myReducer.getInitialState()).toEqual({
        myRequest1: {
          error: null,
          data: null,
          pending: 0
        },
        myRequest2: {
          error: [],
          data: false,
          pending: []
        },
        someState: {}
      });
      (0, _handleApiRequest.clearLookup)();
    });
    it('correct state', function () {
      var action = (0, _createActions.default)('my-action', {
        success: {},
        request: {},
        error: {},
        abort: {},
        cancel: {}
      });
      var myReducer = (0, _handleActions10.default)(_defineProperty({}, (0, _handleApiRequest.apiRequest)('myRequest', action), {}), {});
      var store = (0, _redux.createStore)((0, _redux.combineReducers)({
        myReducer: myReducer
      }));
      expect(store.getState()).toEqual({
        myReducer: {
          myRequest: {
            pending: false,
            error: false,
            data: []
          }
        }
      });
      store.dispatch(action.request());
      expect(store.getState()).toEqual({
        myReducer: {
          myRequest: {
            pending: true,
            error: false,
            data: []
          }
        }
      });
      store.dispatch(action.success('payload'));
      expect(store.getState()).toEqual({
        myReducer: {
          myRequest: {
            pending: false,
            error: false,
            data: 'payload'
          }
        }
      });
      store.dispatch(action.error(true));
      expect(store.getState()).toEqual({
        myReducer: {
          myRequest: {
            pending: false,
            error: true,
            data: []
          }
        }
      });
      store.dispatch(action.cancel());
      expect(store.getState()).toEqual({
        myReducer: {
          myRequest: {
            pending: false,
            error: false,
            data: []
          }
        }
      });
      store.dispatch(action.request());
      store.dispatch(action.abort());
      expect(store.getState()).toEqual({
        myReducer: {
          myRequest: {
            pending: false,
            error: false,
            data: []
          }
        }
      });
      (0, _handleApiRequest.clearLookup)();
    });
    it('correct state with custom initial state', function () {
      var action = (0, _createActions.default)('my-action', {
        success: {},
        request: {},
        error: {},
        abort: {},
        cancel: {}
      });
      var myReducer = (0, _handleActions10.default)(_defineProperty({}, (0, _handleApiRequest.apiRequest)('myRequest', action, {
        error: null,
        pending: 0,
        data: null
      }), {}), {});
      var store = (0, _redux.createStore)((0, _redux.combineReducers)({
        myReducer: myReducer
      }));
      expect(store.getState()).toEqual({
        myReducer: {
          myRequest: {
            pending: 0,
            error: null,
            data: null
          }
        }
      });
      store.dispatch(action.request());
      expect(store.getState()).toEqual({
        myReducer: {
          myRequest: {
            pending: true,
            error: null,
            data: null
          }
        }
      });
      (0, _handleApiRequest.clearLookup)();
    });
    it('correct state with custom initial state', function () {
      var action = (0, _createActions.default)('my-action', {
        success: {},
        request: {},
        error: {},
        abort: {},
        cancel: {}
      });
      var myReducer = (0, _handleActions10.default)(_defineProperty({}, (0, _handleApiRequest.apiRequest)('myRequest', action, {
        error: null,
        pending: 0,
        data: null
      }), {}), {});
      var store = (0, _redux.createStore)((0, _redux.combineReducers)({
        myReducer: myReducer
      }));
      expect(store.getState()).toEqual({
        myReducer: {
          myRequest: {
            pending: 0,
            error: null,
            data: null
          }
        }
      });
      store.dispatch(action.request());
      expect(store.getState()).toEqual({
        myReducer: {
          myRequest: {
            pending: true,
            error: null,
            data: null
          }
        }
      });
      (0, _handleApiRequest.clearLookup)();
    });
    it('correct state with multiple action', function () {
      var _handleActions8;

      var action1 = (0, _createActions.default)('my-action1', {
        success: {},
        request: {},
        error: {},
        abort: {},
        cancel: {}
      });
      var action2 = (0, _createActions.default)('my-action2', {
        success: {},
        request: {},
        error: {},
        abort: {},
        cancel: {}
      });
      var myReducer = (0, _handleActions10.default)((_handleActions8 = {}, _defineProperty(_handleActions8, (0, _handleApiRequest.apiRequest)('myRequest1', action1), {}), _defineProperty(_handleActions8, (0, _handleApiRequest.apiRequest)('myRequest2', action2), {}), _handleActions8), {});
      var store = (0, _redux.createStore)((0, _redux.combineReducers)({
        myReducer: myReducer
      }));
      expect(store.getState()).toEqual({
        myReducer: {
          myRequest1: {
            pending: false,
            error: false,
            data: []
          },
          myRequest2: {
            pending: false,
            error: false,
            data: []
          }
        }
      });
      store.dispatch(action1.request());
      expect(store.getState()).toEqual({
        myReducer: {
          myRequest1: {
            pending: true,
            error: false,
            data: []
          },
          myRequest2: {
            pending: false,
            error: false,
            data: []
          }
        }
      });
      store.dispatch(action2.request());
      expect(store.getState()).toEqual({
        myReducer: {
          myRequest1: {
            pending: true,
            error: false,
            data: []
          },
          myRequest2: {
            pending: true,
            error: false,
            data: []
          }
        }
      });
      (0, _handleApiRequest.clearLookup)();
    });
    it('custom handler', function () {
      var action = (0, _createActions.default)('my-action', {
        success: {},
        request: {},
        error: {},
        abort: {},
        cancel: {}
      });
      var myReducer = (0, _handleActions10.default)(_defineProperty({}, (0, _handleApiRequest.apiRequest)('myRequest', action), {
        request: function request(state, action, nextState) {
          expect(nextState).toEqual({
            pending: true,
            error: false,
            data: []
          });
          return _objectSpread({}, nextState, {
            pending: 1
          });
        },
        error: function error(state, action, nextState) {
          expect(nextState).toEqual({
            pending: false,
            error: 'error',
            data: []
          });
          return _objectSpread({}, nextState, {
            error: {
              error: action.payload
            }
          });
        },
        cancel: function cancel(state, action, nextState) {
          expect(nextState).toEqual({
            pending: false,
            error: false,
            data: []
          });
          return _objectSpread({}, nextState, {
            error: 'cancelled'
          });
        },
        abort: function abort(state, action, nextState) {
          expect(nextState).toEqual({
            pending: false,
            error: false,
            data: []
          });
          return _objectSpread({}, nextState, {
            error: 'aborted'
          });
        }
      }), {});
      var store = (0, _redux.createStore)((0, _redux.combineReducers)({
        myReducer: myReducer
      }));
      expect(store.getState()).toEqual({
        myReducer: {
          myRequest: {
            pending: false,
            error: false,
            data: []
          }
        }
      });
      store.dispatch(action.request());
      expect(store.getState()).toEqual({
        myReducer: {
          myRequest: {
            pending: 1,
            error: false,
            data: []
          }
        }
      });
      store.dispatch(action.success('data'));
      expect(store.getState()).toEqual({
        myReducer: {
          myRequest: {
            pending: false,
            error: false,
            data: 'data'
          }
        }
      });
      store.dispatch(action.error('error'));
      expect(store.getState()).toEqual({
        myReducer: {
          myRequest: {
            pending: false,
            error: {
              error: 'error'
            },
            data: []
          }
        }
      });
      store.dispatch(action.cancel());
      expect(store.getState()).toEqual({
        myReducer: {
          myRequest: {
            pending: false,
            error: 'cancelled',
            data: []
          }
        }
      });
      store.dispatch(action.abort());
      expect(store.getState()).toEqual({
        myReducer: {
          myRequest: {
            pending: false,
            error: 'aborted',
            data: []
          }
        }
      });
      (0, _handleApiRequest.clearLookup)();
    });
  });
});