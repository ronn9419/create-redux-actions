"use strict";

var _overridePath = _interopRequireDefault(require("../../utils/overridePath"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('overridePath util', function () {
  it('overrides the value of the path', function () {
    var state = {
      a: {
        b: 0
      }
    };
    var newState = (0, _overridePath.default)(['a', 'b'], state, 123);
    expect(newState).toEqual({
      a: {
        b: 123
      }
    });
  });
  it('preserve other sibling path', function () {
    var state = {
      a: {
        b: 0,
        c: {
          d: 1
        }
      }
    };
    var newState = (0, _overridePath.default)(['a', 'b'], state, 123);
    expect(newState).toEqual({
      a: {
        b: 123,
        c: {
          d: 1
        }
      }
    });
    expect(newState.a.c === state.a.c).toBe(true);
  });
  it('overrides path even if object', function () {
    var state = {
      a: {
        b: {
          e: 1,
          f: 1
        },
        c: {
          d: 1
        }
      }
    };
    var newState = (0, _overridePath.default)(['a', 'b'], state, {
      e: 2
    });
    expect(newState).toEqual({
      a: {
        b: {
          e: 2
        },
        c: {
          d: 1
        }
      }
    });
    expect(newState.a.c === state.a.c).toBe(true);
  });
  it('does not modify original object', function () {
    var state = {
      a: {
        b: {
          e: 1,
          f: 1
        },
        c: {
          d: 1
        }
      }
    };
    var newState = (0, _overridePath.default)(['a', 'b'], state, {
      e: 2
    });
    expect(newState).toEqual({
      a: {
        b: {
          e: 2
        },
        c: {
          d: 1
        }
      }
    });
    expect(newState.a.c === state.a.c).toBe(true);
    expect(state).toEqual({
      a: {
        b: {
          e: 1,
          f: 1
        },
        c: {
          d: 1
        }
      }
    });
  });
  it('deletes path when value is undefined', function () {
    var state = {
      a: {
        b: {
          c: 1
        },
        d: {}
      }
    };
    var newState = (0, _overridePath.default)(['a', 'b'], state, undefined);
    expect(newState).toEqual({
      a: {
        d: {}
      }
    });
  });
});