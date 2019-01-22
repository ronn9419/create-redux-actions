"use strict";

var _objPath = _interopRequireDefault(require("../../utils/objPath"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('objPath util', function () {
  describe.each([[['a', 'b'], {
    a: {
      b: 1
    }
  }, 1], [['a', 'c'], {
    a: {
      b: 1
    }
  }], [['a', 'c'], {
    a: {
      b: 1
    }
  }, 123, 123], [['a'], {
    a: {
      b: 1
    }
  }, {
    b: 1
  }]])('should work', function (path, obj, expected, defaultValue) {
    it("path: ".concat(path, " obj: ").concat(JSON.stringify(obj), " expected: ").concat(JSON.stringify(expected), " defaultValue: ").concat(defaultValue), function () {
      expect((0, _objPath.default)(path, obj, defaultValue)).toEqual(expected);
    });
  });
  it('returns a reference to obj', function () {
    var x = {
      a: {
        b: {
          c: 1
        }
      }
    };
    var obj = (0, _objPath.default)(['a', 'b'], x);
    expect(obj).toEqual(x.a.b);
  });
});