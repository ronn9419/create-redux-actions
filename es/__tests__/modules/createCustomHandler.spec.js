"use strict";

var _createCustomKey = require("../../modules/createCustomKey");

require('jasmine-check').install();

describe('createCustomKey module', function () {
  check.it("creates a custom handler with ".concat(_createCustomKey.customKey, " prefix"), gen.string, gen.string, function (str1, str2) {
    var generatedKey = [str1, str2];
    var key = (0, _createCustomKey.createKey)(function () {
      return generatedKey;
    })();
    expect(key.indexOf(_createCustomKey.customKey)).toBe(0);
    var result = (0, _createCustomKey.extractKey)(key);
    expect(result).toEqual(generatedKey);
  });
  check.it("creates a custom handler with ".concat(_createCustomKey.customKey, " prefix. non-array"), gen.string, function (str1) {
    var generatedKey = str1;
    var key = (0, _createCustomKey.createKey)(function () {
      return generatedKey;
    })();
    expect(key.indexOf(_createCustomKey.customKey)).toBe(0);
    var result = (0, _createCustomKey.extractKey)(key);
    expect(result).toEqual(generatedKey);
  });
});