"use strict";

var _createActions = _interopRequireDefault(require("../createActions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-nocheck
function testActionCreator(actionCreator, type) {
  expect(actionCreator).toEqual(expect.any(Function));
  expect(actionCreator.toString()).toBe(type);
}

describe('createActions module', function () {
  describe('createAction', function () {
    it('action name only', function () {
      var type = 'open';
      var payload = 'payload-data';
      var actionCreator = (0, _createActions.default)(type);
      testActionCreator(actionCreator, type);
      var action = actionCreator(payload);
      expect(action).toEqual({
        type: 'open',
        payload: payload
      });
      expect(action).not.toHaveProperty('meta');
      expect(action).not.toHaveProperty('error');
    });
    it('type only', function () {
      var type = 'open';
      var actionCreator = (0, _createActions.default)(type, function () {
        return [];
      });
      testActionCreator(actionCreator, type);
      var action = actionCreator('data');
      expect(action).toEqual({
        type: 'open'
      });
      expect(action).not.toHaveProperty('payload');
      expect(action).not.toHaveProperty('meta');
      expect(action).not.toHaveProperty('error');
    });
    it('adds payload', function () {
      var type = 'open';
      var payload = 'payload-data';
      var actionCreator = (0, _createActions.default)(type, function (arg1) {
        return [arg1];
      });
      testActionCreator(actionCreator, type);
      var action = actionCreator(payload);
      expect(action).toEqual({
        type: 'open',
        payload: payload
      });
      expect(action).not.toHaveProperty('meta');
      expect(action).not.toHaveProperty('error');
    });
    it('adds meta', function () {
      var type = 'open';
      var meta = 'meta-data';
      var payload = 'payload-data';
      var actionCreator = (0, _createActions.default)(type, function (arg1) {
        return [arg1, meta];
      });
      testActionCreator(actionCreator, type);
      var action = actionCreator(payload);
      expect(action).toEqual({
        type: 'open',
        payload: payload,
        meta: meta
      });
      expect(action).not.toHaveProperty('error');
    });
    it('adds error', function () {
      var type = 'open';
      var meta = 'meta-data';
      var payload = 'payload-data';
      var actionCreator = (0, _createActions.default)(type, function (arg1) {
        return [arg1, meta, true];
      });
      testActionCreator(actionCreator, type);
      var action = actionCreator(payload);
      expect(action).toEqual({
        type: 'open',
        payload: payload,
        meta: meta,
        error: true
      });
    });
    it('action name and payload creator', function () {
      var type = 'action';
      var actionCreator = (0, _createActions.default)(type, function (payload) {
        return payload + 1;
      });
      testActionCreator(actionCreator, type);
      var action = actionCreator(100);
      expect(action).toEqual({
        type: 'action',
        payload: 101,
        meta: undefined
      });
    });
    it('action name and payload-meta creator', function () {
      var type = 'payload-meta';
      var actionCreator = (0, _createActions.default)(type, function (payload) {
        return [payload + 1, payload - 1];
      });
      testActionCreator(actionCreator, type);
      var action = actionCreator(100);
      expect(action).toEqual({
        type: 'payload-meta',
        payload: 101,
        meta: 99
      });
    });
  });
  describe('createActions', function () {
    it('creates a namespace', function () {
      var namespace = 'my-namespace';
      var options = {
        suffix: '',
        prefix: '',
        separator: '/'
      };
      var actionCreators = (0, _createActions.default)(namespace, {
        dialog: {}
      }, options);
      var type = "".concat(options.prefix).concat(namespace).concat(options.suffix).concat(options.separator).concat(options.prefix, "dialog").concat(options.suffix);
      expect(actionCreators).toHaveProperty('dialog');
      testActionCreator(actionCreators.dialog, type);
      expect(actionCreators.dialog('payload', 123)).toEqual({
        type: type,
        payload: 'payload',
        meta: 123
      });
    });
    it('creates root action', function () {
      var namespace = 'my-namespace';
      var options = {
        suffix: '',
        prefix: '',
        separator: '/'
      };
      var actionCreators = (0, _createActions.default)(namespace, {
        dialog: {}
      }, options);
      testActionCreator(actionCreators, namespace);
      expect(actionCreators('payload', 123)).toEqual({
        type: namespace,
        payload: 'payload',
        meta: 123
      });
    });
    it('creates an action using function', function () {
      var namespace = 'my-action';
      var options = {
        suffix: ']',
        prefix: '[',
        separator: '/'
      };
      var type = "".concat(options.prefix).concat(namespace).concat(options.suffix).concat(options.separator).concat(options.prefix, "dialog").concat(options.suffix);
      var actionCreators = (0, _createActions.default)(namespace, {
        dialog: function dialog() {
          return [123, 456];
        }
      }, options);
      expect(actionCreators).toHaveProperty('dialog');
      testActionCreator(actionCreators.dialog, type);
      expect(actionCreators.dialog('abc')).toEqual({
        type: type,
        payload: 123,
        meta: 456
      });
    });
    it('creates an action using array', function () {
      var namespace = 'my-action';
      var options1 = {
        suffix: ']',
        prefix: '[',
        separator: '/'
      };
      var options2 = {
        suffix: '>',
        prefix: '<',
        separator: '-'
      };
      var type = "".concat(options1.prefix).concat(namespace).concat(options1.suffix).concat(options2.separator).concat(options2.prefix, "dialog").concat(options2.suffix);
      var type2 = "".concat(options1.prefix).concat(namespace).concat(options1.suffix).concat(options2.separator).concat(options2.prefix, "alert").concat(options2.suffix);
      var actionCreators = (0, _createActions.default)(namespace, [{
        dialog: function dialog() {
          return [111, 222];
        },
        alert: function alert(payload) {
          return [payload, 444];
        }
      }, options2], options1);
      expect(actionCreators).toHaveProperty('dialog');
      expect(actionCreators).toHaveProperty('alert');
      testActionCreator(actionCreators.dialog, type);
      testActionCreator(actionCreators.alert, type2);
      expect(actionCreators.dialog('abc')).toEqual({
        type: type,
        payload: 111,
        meta: 222
      });
      expect(actionCreators.alert('foo')).toEqual({
        type: type2,
        payload: 'foo',
        meta: 444
      });
    });
    it('creates nested actions', function () {
      var namespace = 'my-namespace';
      var options = {
        suffix: '',
        prefix: '',
        separator: '/'
      };
      var actionCreators = (0, _createActions.default)(namespace, {
        dialog: {
          open: {},
          toggle: function toggle(payload) {
            return [payload, false];
          }
        }
      }, options);
      var type = "".concat(options.prefix).concat(namespace).concat(options.suffix).concat(options.separator).concat(options.prefix, "dialog").concat(options.suffix);
      expect(actionCreators).toHaveProperty('dialog');
      expect(actionCreators.dialog).toHaveProperty('open');
      expect(actionCreators.dialog).toHaveProperty('toggle');
      testActionCreator(actionCreators.dialog, type);
      testActionCreator(actionCreators.dialog.open, "".concat(type).concat(options.separator, "open"));
      testActionCreator(actionCreators.dialog.toggle, "".concat(type).concat(options.separator, "toggle"));
      expect(actionCreators.dialog('payload', 123)).toEqual({
        type: type,
        payload: 'payload',
        meta: 123
      });
      expect(actionCreators.dialog.open('open', 456)).toEqual({
        type: "".concat(type).concat(options.separator, "open"),
        payload: 'open',
        meta: 456
      });
      expect(actionCreators.dialog.toggle('toggle', 789)).toEqual({
        type: "".concat(type).concat(options.separator, "toggle"),
        payload: 'toggle',
        meta: false
      });
    });
  });
});