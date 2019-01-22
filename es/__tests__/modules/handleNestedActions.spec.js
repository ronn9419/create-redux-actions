"use strict";

var _createActions = _interopRequireDefault(require("../../createActions"));

var _handleActions5 = _interopRequireDefault(require("../../handleActions"));

var _createCustomKey = require("../../modules/createCustomKey");

var _handleNestedActions = require("../../modules/handleNestedActions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

describe('HandleNestedActions module', function () {
  it('creates desired key for handleActions', function () {
    var action = (0, _createActions.default)('test-action', {
      test: {}
    });
    var result = (0, _handleNestedActions.nested)(action);
    var extracted = (0, _createCustomKey.extractKey)(result);
    expect(extracted).toEqual([_handleNestedActions.key, action.toString()]);
  });
  it('retrieves correct action', function () {
    var action = (0, _createActions.default)('my-action', {
      test: {}
    });
    var result = (0, _handleNestedActions.nested)(action);
    var data = (0, _handleNestedActions.extractData)((0, _createCustomKey.extractKey)(result));
    expect((0, _handleNestedActions.getNestedValue)(data)).toEqual(action);
  });
  it('retrieves correct action of nested action', function () {
    var action = (0, _createActions.default)('my-action', {
      test: {
        nest: {}
      }
    });
    var result = (0, _handleNestedActions.nested)(action.test);
    var data = (0, _handleNestedActions.extractData)((0, _createCustomKey.extractKey)(result));
    expect((0, _handleNestedActions.getNestedValue)(data)).toEqual(action.test);
  });
  it('adds correct handlers', function () {
    var action = (0, _createActions.default)('my-action', {
      test: {}
    });

    var testHandler = function testHandler(state, action) {
      return state;
    };

    var otherHandler = function otherHandler(state, action) {
      return state;
    };

    var handlers = (0, _handleActions5.default)(_defineProperty({}, (0, _handleNestedActions.nested)(action), {
      test: testHandler
    }), {
      data: null
    });
    expect(handlers.getHandlers()).toMatchObject(_defineProperty({}, action.test, testHandler));
  });
  it('supports function form', function () {
    var _expect$toMatchObject2;

    var action = (0, _createActions.default)('my-action', {
      test: {},
      other: {}
    });

    var testHandler = function testHandler(state, action) {
      return state;
    };

    var otherHandler = function otherHandler(state, action) {
      return state;
    };

    var handlers = (0, _handleActions5.default)(_defineProperty({}, (0, _handleNestedActions.nested)(action), {
      test: testHandler,
      other: otherHandler
    }), {
      data: null
    });
    expect(handlers.getHandlers()).toMatchObject((_expect$toMatchObject2 = {}, _defineProperty(_expect$toMatchObject2, action.test, testHandler), _defineProperty(_expect$toMatchObject2, action.other, otherHandler), _expect$toMatchObject2));
  });
  it('supports array form', function () {
    var _expect$toMatchObject3;

    var action = (0, _createActions.default)('my-action', {
      test: {
        other: {}
      }
    });

    var testHandler = function testHandler(state, action) {
      return state;
    };

    var otherHandler = function otherHandler(state, action) {
      return state;
    };

    var handlers = (0, _handleActions5.default)(_defineProperty({}, (0, _handleNestedActions.nested)(action), {
      test: [testHandler, {
        other: otherHandler
      }]
    }), {
      data: null
    });
    expect(handlers.getHandlers()).toMatchObject((_expect$toMatchObject3 = {}, _defineProperty(_expect$toMatchObject3, action.test, testHandler), _defineProperty(_expect$toMatchObject3, action.test.other, otherHandler), _expect$toMatchObject3));
  });
  it('supports object form', function () {
    var action = (0, _createActions.default)('my-action', {
      test: {
        other: {}
      }
    });

    var otherHandler = function otherHandler(state, action) {
      return state;
    };

    var handlers = (0, _handleActions5.default)(_defineProperty({}, (0, _handleNestedActions.nested)(action), {
      test: {
        other: otherHandler
      }
    }), {
      data: null
    });
    expect(handlers.getHandlers()).toMatchObject(_defineProperty({}, action.test.other, otherHandler));
  });
});