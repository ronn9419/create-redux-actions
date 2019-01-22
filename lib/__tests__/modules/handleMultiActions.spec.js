"use strict";

var _createActions = _interopRequireDefault(require("../../createActions"));

var _handleActions3 = _interopRequireDefault(require("../../handleActions"));

var _createCustomKey = require("../../modules/createCustomKey");

var _handleMultiActions = require("../../modules/handleMultiActions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

describe('HandleNestedActions module', function () {
  it('creates desired key for handleActions', function () {
    var action = (0, _createActions.default)('test-action', {
      test: {}
    });
    var result = (0, _handleMultiActions.multi)(action);
    var extracted = (0, _createCustomKey.extractKey)(result);
    expect(extracted).toEqual([_handleMultiActions.key, [action.toString()]]);
  });
  it('creates desired key for multiple input', function () {
    var action = (0, _createActions.default)('test-action', {
      test1: {},
      test2: {},
      test3: {}
    });
    var result = (0, _handleMultiActions.multi)(action.test1, action.test2, action.test3);
    var extracted = (0, _createCustomKey.extractKey)(result);
    expect(extracted).toEqual([_handleMultiActions.key, [action.test1.toString(), action.test2.toString(), action.test3.toString()]]);
  });
  it('adds correct handlers', function () {
    var _expect$toMatchObject;

    var action = (0, _createActions.default)('my-action', {
      test1: {},
      test2: {},
      test3: {}
    });

    var testHandler = function testHandler(state, action) {
      return state;
    };

    var handlers = (0, _handleActions3.default)(_defineProperty({}, (0, _handleMultiActions.multi)(action.test1, action.test2, action.test3), testHandler), {});
    expect(handlers.getHandlers()).toMatchObject((_expect$toMatchObject = {}, _defineProperty(_expect$toMatchObject, action.test1, testHandler), _defineProperty(_expect$toMatchObject, action.test2, testHandler), _defineProperty(_expect$toMatchObject, action.test3, testHandler), _expect$toMatchObject));
  });
  it('throws error when passed non-function value', function () {
    var action = (0, _createActions.default)('my-action', {
      test1: {},
      test2: {},
      test3: {}
    });
    var testHandler = {};
    expect(function () {
      return (0, _handleActions3.default)(_defineProperty({}, (0, _handleMultiActions.multi)(action.test1, action.test2, action.test3), testHandler), {});
    }).toThrowErrorMatchingInlineSnapshot("\"Multi handler value must be a function\"");
  });
});