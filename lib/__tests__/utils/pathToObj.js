"use strict";

var _pathToObj = _interopRequireDefault(require("../../utils/pathToObj"));

var _objPath = _interopRequireDefault(require("../../utils/objPath"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-undef */
require('jasmine-check').install();

describe('pathToObj util', function () {
  it('generates nested object by path', function () {
    var obj = (0, _pathToObj.default)(['a', 'b', 'c'], 'value');
    expect(obj).toEqual({
      a: {
        b: {
          c: 'value'
        }
      }
    });
  });
  check.it('pass random path and value', gen.array(gen.string, {
    minSize: 1,
    maxSize: 10
  }), gen.string, function (path, value) {
    var obj = (0, _pathToObj.default)(path, value);
    expect((0, _objPath.default)(path, obj)).toEqual(value);
  });
});