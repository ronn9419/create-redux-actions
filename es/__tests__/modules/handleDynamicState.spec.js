"use strict";

var _redux = require("redux");

var _createActions = _interopRequireDefault(require("../../createActions"));

var _handleActions7 = _interopRequireDefault(require("../../handleActions"));

var _createCustomKey = require("../../modules/createCustomKey");

var _handleNestedActions = require("../../modules/handleNestedActions");

var _handleDynamicState = require("../../modules/handleDynamicState");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

describe('handleDynamicState module', function () {
  it('creates desired key for handleActions', function () {
    var result = (0, _handleDynamicState.path)('path1', 'path2');
    var extracted = (0, _createCustomKey.extractKey)(result);
    (0, _handleDynamicState.clearData)();
    expect(extracted).toEqual([_handleDynamicState.key, ['path1', 'path2']]);
  });
  it('with function', function () {
    var fn1 = function fn1(state, action) {
      return action;
    };

    var fn2 = function fn2(state, action) {
      return action;
    };

    var result = (0, _handleDynamicState.path)('path1', 'path2', fn1, fn2);
    var extracted = (0, _createCustomKey.extractKey)(result);
    var data = (0, _handleDynamicState.extractData)(extracted);
    expect(data).toEqual(['path1', 'path2', [_handleDynamicState.embedFnKey, 0], [_handleDynamicState.embedFnKey, 1]]);
    expect((0, _handleDynamicState.getLookup)()).toHaveLength(2);
    expect((0, _handleDynamicState.getEmbedFn)(data[2])).toEqual(fn1);
    expect((0, _handleDynamicState.getEmbedFn)(data[3])).toEqual(fn2);
    (0, _handleDynamicState.clearData)();
  });
  it('all function', function () {
    var fn1 = function fn1(state, action) {
      return action;
    };

    var fn2 = function fn2(state, action) {
      return action;
    };

    var fn3 = function fn3(state, action) {
      return action;
    };

    var result = (0, _handleDynamicState.path)(fn1, fn2, fn3);
    var extracted = (0, _createCustomKey.extractKey)(result);
    var data = (0, _handleDynamicState.extractData)(extracted);
    expect(data).toEqual([[_handleDynamicState.embedFnKey, 0], [_handleDynamicState.embedFnKey, 1], [_handleDynamicState.embedFnKey, 2]]);
    expect((0, _handleDynamicState.getLookup)()).toHaveLength(3);
    expect((0, _handleDynamicState.getEmbedFn)(data[0])).toEqual(fn1);
    expect((0, _handleDynamicState.getEmbedFn)(data[1])).toEqual(fn2);
    expect((0, _handleDynamicState.getEmbedFn)(data[2])).toEqual(fn3);
    (0, _handleDynamicState.clearData)();
  });
  it('single function', function () {
    var fn1 = function fn1(state, action) {
      return action;
    };

    var result = (0, _handleDynamicState.path)(fn1);
    var extracted = (0, _createCustomKey.extractKey)(result);
    var data = (0, _handleDynamicState.extractData)(extracted);
    expect(data).toEqual([[_handleDynamicState.embedFnKey, 0]]);
    expect((0, _handleDynamicState.getLookup)()).toHaveLength(1);
    expect((0, _handleDynamicState.getEmbedFn)(data[0])).toEqual(fn1);
    (0, _handleDynamicState.clearData)();
  });
  it('single string', function () {
    var result = (0, _handleDynamicState.path)('path1');
    var extracted = (0, _createCustomKey.extractKey)(result);
    var data = (0, _handleDynamicState.extractData)(extracted);
    expect(data).toEqual(['path1']);
    expect((0, _handleDynamicState.getLookup)()).toHaveLength(0);
    (0, _handleDynamicState.clearData)();
  });
  it('update state only in specified path', function () {
    var actionCreator = (0, _createActions.default)('my-action');
    var initialState = {
      test: {
        data: {
          data1: null
        },
        otherData: 123
      }
    };
    var reducer = (0, _handleActions7.default)(_defineProperty({}, (0, _handleDynamicState.path)('test', 'data'), _defineProperty({}, actionCreator, function (state, action) {
      expect(state).toEqual({
        data1: null
      });
      return {
        data1: 321
      };
    })), initialState);
    var store = (0, _redux.createStore)((0, _redux.combineReducers)({
      sample: reducer
    }));
    store.dispatch(actionCreator());
    var state = store.getState();
    expect(state.sample.test.otherData === initialState.test.otherData).toBe(true);
    expect(state).toEqual({
      sample: {
        test: {
          data: {
            data1: 321
          },
          otherData: 123
        }
      }
    });
    (0, _handleDynamicState.clearData)();
  });
  it('update state only in specified path using function as path', function () {
    var actionCreator = (0, _createActions.default)('my-action');
    var initialState = {
      sessions: {
        123: {
          data: 'world'
        },
        456: {
          data: 'hello'
        }
      }
    };
    var reducer = (0, _handleActions7.default)(_defineProperty({}, (0, _handleDynamicState.path)('sessions', function (state, action) {
      return action.payload;
    }), _defineProperty({}, actionCreator, function (state, action, reducerState) {
      expect(state).toEqual({
        data: 'world'
      });
      expect(reducerState).toEqual({
        sessions: {
          123: {
            data: 'world'
          },
          456: {
            data: 'hello'
          }
        }
      });
      return {
        data: 'hello world',
        otherData: 'test'
      };
    })), initialState);
    var store = (0, _redux.createStore)((0, _redux.combineReducers)({
      sample: reducer
    }));
    store.dispatch(actionCreator(123));
    var state = store.getState();
    expect(state.sample.sessions['456'] === initialState.sessions['456']).toBe(true);
    expect(state).toEqual({
      sample: {
        sessions: {
          123: {
            data: 'hello world',
            otherData: 'test'
          },
          456: {
            data: 'hello'
          }
        }
      }
    });
    (0, _handleDynamicState.clearData)();
  });
  it('works in multiple action', function () {
    var _path3;

    var actionCreator1 = (0, _createActions.default)('my-action1');
    var actionCreator2 = (0, _createActions.default)('my-action2');
    var initialState = {
      sessions: {
        123: {
          data: 'world'
        },
        456: {
          data: 'hello'
        }
      }
    };
    var reducer = (0, _handleActions7.default)(_defineProperty({}, (0, _handleDynamicState.path)('sessions', function (state, action) {
      return action.payload;
    }), (_path3 = {}, _defineProperty(_path3, actionCreator1, function (state, action, reducerState) {
      expect(state).toEqual({
        data: 'world'
      });
      expect(reducerState).toEqual({
        sessions: {
          123: {
            data: 'world'
          },
          456: {
            data: 'hello'
          }
        }
      });
      return {
        data: 'payload-1'
      };
    }), _defineProperty(_path3, actionCreator2, function (state, action, reducerState) {
      expect(state).toEqual({
        data: 'hello'
      });
      expect(reducerState).toEqual({
        sessions: {
          123: {
            data: 'payload-1'
          },
          456: {
            data: 'hello'
          }
        }
      });
      return {
        data: 'payload-2'
      };
    }), _path3)), initialState);
    var store = (0, _redux.createStore)((0, _redux.combineReducers)({
      sample: reducer
    }));
    store.dispatch(actionCreator1(123));
    var state = store.getState();
    expect(state).toEqual({
      sample: {
        sessions: {
          123: {
            data: 'payload-1'
          },
          456: {
            data: 'hello'
          }
        }
      }
    });
    store.dispatch(actionCreator2(456));
    state = store.getState();
    expect(state).toEqual({
      sample: {
        sessions: {
          123: {
            data: 'payload-1'
          },
          456: {
            data: 'payload-2'
          }
        }
      }
    });
    (0, _handleDynamicState.clearData)();
  });
  it('works in multiple action', function () {
    var actionCreator = (0, _createActions.default)('my-action');
    var initialState = {
      sessions: {
        123: {
          data: 'world'
        },
        456: {
          data: 'hello'
        }
      }
    };
    var reducer = (0, _handleActions7.default)(_defineProperty({}, (0, _handleDynamicState.path)('sessions', function (state, action) {
      return action.payload;
    }), _defineProperty({}, actionCreator, function (state, action, reducerState) {
      expect(state).toEqual({
        data: 'world'
      });
      expect(reducerState).toEqual({
        sessions: {
          123: {
            data: 'world'
          },
          456: {
            data: 'hello'
          }
        }
      });
      return undefined;
    })), initialState);
    var store = (0, _redux.createStore)((0, _redux.combineReducers)({
      sample: reducer
    }));
    store.dispatch(actionCreator(123));
    var state = store.getState();
    expect(state).toEqual({
      sample: {
        sessions: {
          456: {
            data: 'hello'
          }
        }
      }
    });
    (0, _handleDynamicState.clearData)();
  });
  it('handle duplicate actions (Simple handler will execute first)', function () {
    var _handleActions5;

    var action = (0, _createActions.default)('my-action');

    var handler1 = function handler1(state, _ref, allState) {
      var payload = _ref.payload;
      expect(allState).toEqual({
        data: {
          test: null,
          data2: 1
        }
      });
      expect(state).toEqual({
        test: null,
        data2: 1
      });
      return {
        test: payload
      };
    };

    var handler2 = function handler2(state, _ref2) {
      var payload = _ref2.payload;
      return _objectSpread({}, state, {
        data: _objectSpread({}, state.data, {
          data2: 1
        })
      });
    };

    var reducer = (0, _handleActions7.default)((_handleActions5 = {}, _defineProperty(_handleActions5, (0, _handleDynamicState.path)(['data']), _defineProperty({}, action, handler1)), _defineProperty(_handleActions5, action, handler2), _handleActions5), {
      data: {
        test: null
      }
    });
    var store = (0, _redux.createStore)((0, _redux.combineReducers)({
      sample: reducer
    }));
    store.dispatch(action('payload'));
    expect(store.getState()).toEqual({
      sample: {
        data: {
          data2: 1,
          test: 'payload'
        }
      }
    });
    var handlers = reducer.getHandlers();
    expect(handlers[action]).toEqual(expect.any(Array));
    expect(handlers[action]).toHaveLength(2);
    expect(handlers[action][0] === handler2).toBe(true);
  });
  it('works with nested module', function () {
    var _handleActions6;

    var action = (0, _createActions.default)('my-action', {
      test: {}
    });
    var reducer = (0, _handleActions7.default)((_handleActions6 = {}, _defineProperty(_handleActions6, (0, _handleNestedActions.nested)(action), {
      test: function test(state, action) {
        return _objectSpread({}, state, {
          data: _objectSpread({}, state.data, {
            test: action.payload
          })
        });
      }
    }), _defineProperty(_handleActions6, (0, _handleDynamicState.path)(['data']), _defineProperty({}, action.test, function (state, action) {
      return _objectSpread({}, state, {
        test2: action.payload
      });
    })), _handleActions6), {
      data: {
        test: null
      }
    });
    var store = (0, _redux.createStore)((0, _redux.combineReducers)({
      sample: reducer
    }));
    store.dispatch(action.test('payload'));
    expect(store.getState()).toEqual({
      sample: {
        data: {
          test2: 'payload',
          test: 'payload'
        }
      }
    });
  });
});