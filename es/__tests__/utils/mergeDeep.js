"use strict";

var _ramda = require("ramda");

var _mergeDeep = _interopRequireDefault(require("../../utils/mergeDeep"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-undef */
require('jasmine-check').install();

describe('mergeDeep module', function () {
  it('merge deep level-1', function () {
    var state = {
      a: {
        b: 123
      }
    };
    var addState = {
      c: {
        data: 456
      }
    };
    var mergedState = (0, _mergeDeep.default)(state, addState);
    expect(mergedState.a === state.a).toBeTruthy();
    expect(mergedState.c === addState.c).toBeTruthy();
    expect(mergedState).toEqual((0, _ramda.mergeDeepRight)(state, addState));
  });
  it('merge deep level-2', function () {
    var state = {
      a: {
        b: {
          data: 123
        }
      }
    };
    var addState = {
      a: {
        c: {
          data: 456
        }
      }
    };
    var mergedState = (0, _mergeDeep.default)(state, addState);
    expect(mergedState.a.b === state.a.b).toBeTruthy();
    expect(mergedState.a.c === addState.a.c).toBeTruthy();
    expect(mergedState).toEqual((0, _ramda.mergeDeepRight)(state, addState));
  });
  it('merge deep level-3', function () {
    var state = {
      a: {
        b: {
          data: 123,
          f: {
            g: 'def'
          }
        },
        c: {
          data: 456
        }
      }
    };
    var addState = {
      a: {
        b: {
          data: 789,
          d: {
            e: 'abc'
          }
        }
      }
    };
    var mergedState = (0, _mergeDeep.default)(state, addState);
    expect(mergedState.a.b === state.a.b).toBeFalsy();
    expect(mergedState.a.b.f === state.a.b.f).toBeTruthy();
    expect(mergedState.a.b.d === addState.a.b.d).toBeTruthy();
    expect(mergedState.a.c === state.a.c).toBeTruthy();
    expect(mergedState.a === state.a).toBeFalsy();
    expect(mergedState).toEqual((0, _ramda.mergeDeepRight)(state, addState));
  });
  check.it('merge random objects level-1', gen.object(gen.int, {
    size: 5
  }), gen.object(gen.int, {
    size: 5
  }), function (obj1, obj2) {
    expect((0, _mergeDeep.default)(obj1, obj2)).toEqual((0, _ramda.mergeDeepRight)(obj1, obj2));
  });
  check.it('merge random objects level-2', gen.object(gen.object(gen.int, {
    size: 2
  }), {
    size: 3
  }), gen.object(gen.object(gen.int, {
    size: 2
  }), {
    size: 3
  }), function (obj1, obj2) {
    expect((0, _mergeDeep.default)(obj1, obj2)).toEqual((0, _ramda.mergeDeepRight)(obj1, obj2));
  });
  check.it('merge random objects level-3', gen.object(gen.object(gen.object(gen.int, {
    size: 1
  }), {
    size: 2
  }), {
    size: 3
  }), gen.object(gen.object(gen.object(gen.int, {
    size: 1
  }), {
    size: 2
  }), {
    size: 3
  }), function (obj1, obj2) {
    expect((0, _mergeDeep.default)(obj1, obj2)).toEqual((0, _ramda.mergeDeepRight)(obj1, obj2));
  });
  it('merge deep level-1 (3 params)', function () {
    var state = {
      a: {
        b: 123
      }
    };
    var state2 = {
      c: {
        data: 456
      }
    };
    var state3 = {
      c: {
        data: 789
      },
      d: {
        data: 101112
      }
    };
    var mergedState = (0, _mergeDeep.default)(state, state2, state3);
    expect(mergedState.a === state.a).toBeTruthy();
    expect(mergedState.c === state2.c).toBeFalsy();
    expect(mergedState.d === state3.d).toBeTruthy();
    expect(mergedState).toEqual((0, _ramda.mergeDeepRight)(state, (0, _ramda.mergeDeepRight)(state2, state3)));
  });
  it('merge deep level-2 (3 params)', function () {
    var state = {
      a: {
        a: 1,
        b: 2
      },
      c: {
        d: 3
      }
    };
    var state2 = {
      a: {
        a: 2,
        c: 3
      },
      b: {
        a: 1
      }
    };
    var state3 = {
      a: {
        c: 4,
        d: {
          e: 5
        }
      },
      b: {
        c: 2
      }
    };
    var mergedState = (0, _mergeDeep.default)(state, state2, state3);
    expect(mergedState.b === state2.b).toBeFalsy();
    expect(mergedState.b === state3.b).toBeFalsy();
    expect(mergedState.b.a === state2.b.a).toBeTruthy();
    expect(mergedState.b.c === state3.b.c).toBeTruthy();
    expect(mergedState.c === state.c).toBeTruthy();
    expect(mergedState.c === state.c).toBeTruthy();
    expect(mergedState.a === state.a).toBeFalsy();
    expect(mergedState.a === state2.a).toBeFalsy();
    expect(mergedState.a === state3.a).toBeFalsy();
    expect(mergedState.a.a === state2.a.a).toBeTruthy();
    expect(mergedState.a.b === state.a.b).toBeTruthy();
    expect(mergedState.a.c === state3.a.c).toBeTruthy();
    expect(mergedState.a.d === state3.a.d).toBeTruthy();
    expect(mergedState).toEqual((0, _ramda.mergeDeepRight)(state, (0, _ramda.mergeDeepRight)(state2, state3)));
  });
  it('merges empty object', function () {
    var config = {
      initialState: {
        error: false,
        pending: false,
        data: []
      }
    };
    var newObj = (0, _mergeDeep.default)(config, {
      initialState: {}
    });
    expect(newObj).toEqual({
      initialState: {}
    });
  });
});