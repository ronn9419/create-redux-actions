"use strict";

var _merge = _interopRequireDefault(require("../../utils/merge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('merge util', function () {
  describe.each([[{
    a: 1
  }, {
    a: 1
  }], [{
    a: 1,
    b: 2
  }, {
    a: 1
  }, {
    b: 2
  }], [{
    a: 1,
    b: 2,
    c: 3
  }, {
    a: 1
  }, {
    b: 2
  }, {
    c: 3
  }], [{
    a: {
      c: 2
    }
  }, {
    a: {
      b: 1
    }
  }, {
    a: {
      c: 2
    }
  }]])('should work', function (expected) {
    for (var _len = arguments.length, objs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      objs[_key - 1] = arguments[_key];
    }

    it("objs: ".concat(JSON.stringify(objs), " expected: ").concat(JSON.stringify(expected)), function () {
      expect(_merge.default.apply(void 0, objs)).toEqual(expected);
    });
  });
});