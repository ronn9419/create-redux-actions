"use strict";

var _includeAll = _interopRequireDefault(require("../../utils/includeAll"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('includeAll util', function () {
  it('merge objs', function () {
    var obj1 = {
      a: 1,
      b: 2
    };
    var obj2 = {
      a: 3,
      c: 4
    };
    var all = (0, _includeAll.default)(obj1, obj2);
    expect(all).toEqual({
      a: [1, 3],
      b: 2,
      c: 4
    });
  });
  it('merge objs level-2', function () {
    var obj1 = {
      a: {
        a: 1
      },
      b: 2,
      c: {
        d: 3
      }
    };
    var obj2 = {
      a: {
        b: 2
      },
      c: 4
    };
    var obj3 = {
      a: {
        c: 3
      }
    };
    var all = (0, _includeAll.default)(obj1, obj2, obj3);
    expect(all).toEqual({
      a: [{
        a: 1
      }, {
        b: 2
      }, {
        c: 3
      }],
      b: 2,
      c: [{
        d: 3
      }, 4]
    });
  });
});