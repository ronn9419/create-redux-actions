"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearData = exports.getLookup = exports.pathHandler = exports.getEmbedFn = exports.extractData = exports.isEmbedFn = exports.isPath = exports.path = exports.embedFnKey = exports.key = void 0;

var _isFunction = _interopRequireDefault(require("../utils/isFunction"));

var _objPath = _interopRequireDefault(require("../utils/objPath"));

var _overridePath = _interopRequireDefault(require("../utils/overridePath"));

var _createCustomKey = require("./createCustomKey");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable array-callback-return,no-else-return */
var lookup = [];
var key = '__path__';
exports.key = key;
var embedFnKey = '__fn__';
exports.embedFnKey = embedFnKey;

var saveFn = function saveFn(fn) {
  lookup.push(fn);
  return lookup.length - 1;
};

var path = (0, _createCustomKey.createKey)(function () {
  for (var _len = arguments.length, paths = new Array(_len), _key = 0; _key < _len; _key++) {
    paths[_key] = arguments[_key];
  }

  return [key, paths.map(function (p) {
    if ((0, _isFunction.default)(p)) {
      return [embedFnKey, saveFn(p)];
    }

    return p;
  })];
});
exports.path = path;

var isPath = function isPath(data) {
  return data[0] === key;
};

exports.isPath = isPath;

var isEmbedFn = function isEmbedFn(data) {
  return data[0] === embedFnKey;
};

exports.isEmbedFn = isEmbedFn;

var extractData = function extractData(key) {
  if (key && !isPath(key)) {
    return null;
  }

  return key[1];
};

exports.extractData = extractData;

var getEmbedFn = function getEmbedFn(data) {
  if (!isEmbedFn(data)) {
    return null;
  }

  return lookup[data[1]];
};

exports.getEmbedFn = getEmbedFn;

var pathResolver = function pathResolver(data, state, action) {
  return data.reduce(function (paths, p) {
    var pathFn = getEmbedFn(p);
    var path = p;

    if (pathFn !== null) {
      path = pathFn(state, action);
    }

    paths.push(path);
    return paths;
  }, []);
};

var pathHandler = function pathHandler(key, value) {
  var data = extractData(key);
  var handlers = Object.keys(value).reduce(function (acc, cur) {
    acc[cur] = function (state, action) {
      var path = pathResolver(data, state, action);
      var newState = value[cur]((0, _objPath.default)(path, state), action, state);
      return (0, _overridePath.default)(path, state, newState);
    };

    return acc;
  }, {});
  return [handlers];
};

exports.pathHandler = pathHandler;

var getLookup = function getLookup() {
  return lookup.concat();
};

exports.getLookup = getLookup;

var clearData = function clearData() {
  lookup = [];
};

exports.clearData = clearData;