"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createKey = exports.extractKey = exports.isCustomKey = exports.customKey = void 0;

/* eslint-disable valid-jsdoc */

/**
 * @type {string}
 */
var customKey = '__custom:';
/**
 * @param {string} key
 * @return {boolean} isCustomKey
 */

exports.customKey = customKey;

var isCustomKey = function isCustomKey(key) {
  return key.indexOf(customKey) === 0;
};

exports.isCustomKey = isCustomKey;

var extractKey = function extractKey(key) {
  if (!isCustomKey(key)) {
    return null;
  }

  return JSON.parse(key.slice(customKey.length));
};
/**
 * @param {function} creator
 * @return {function} customKey
 */


exports.extractKey = extractKey;

var createKey = function createKey(creator) {
  return function () {
    return "".concat(customKey).concat(JSON.stringify(creator.apply(void 0, arguments)));
  };
};

exports.createKey = createKey;