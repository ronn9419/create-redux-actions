import { createStore, combineReducers } from 'redux'
import createActions from '../../createActions'
import handleActions from '../../handleActions'
import undoableReducer, {
    undo,
    redo,
    saveState,
    clearHistory,
    pastSelector,
    futureSelector,
    pastCountSelector,
    futureCountSelector
} from '../../enhancers/undoableReducer'

const reducerKey = 'test'

const action = createActions('test-namespace', {
    test: {}
})

const createTestStore = options => {
    const reducer = handleActions(
        {
            [action.test]: (state, { payload }) => ({
                ...state,
                data: payload
            })
        },
        { data: null }
    )

    reducer.key = reducerKey

    const rootReducer = combineReducers({
        [reducerKey]: undoableReducer(reducer, options)
    })

    return createStore(rootReducer)
}

describe('undoable reducer', () => {
    it('saves state', () => {
        const store = createTestStore()

        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [],
      "past": Array [],
    },
    "data": null,
  },
}
`)

        store.dispatch(action.test('abc'))

        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [],
      "past": Array [],
    },
    "data": "abc",
  },
}
`)
        // saveState before overriding it
        store.dispatch(saveState(reducerKey))
        store.dispatch(action.test('123'))

        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [],
      "past": Array [
        Object {
          "data": "abc",
        },
      ],
    },
    "data": "123",
  },
}
`)
    })

    it('undo and redo', () => {
        const store = createTestStore()

        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [],
      "past": Array [],
    },
    "data": null,
  },
}
`)
        store.dispatch(saveState(reducerKey))
        store.dispatch(action.test('1'))

        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [],
      "past": Array [
        Object {
          "data": null,
        },
      ],
    },
    "data": "1",
  },
}
`)

        store.dispatch(saveState(reducerKey))
        store.dispatch(action.test('2'))

        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [],
      "past": Array [
        Object {
          "data": null,
        },
        Object {
          "data": "1",
        },
      ],
    },
    "data": "2",
  },
}
`)

        store.dispatch(saveState(reducerKey))
        store.dispatch(action.test('3'))

        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [],
      "past": Array [
        Object {
          "data": null,
        },
        Object {
          "data": "1",
        },
        Object {
          "data": "2",
        },
      ],
    },
    "data": "3",
  },
}
`)

        store.dispatch(undo(reducerKey))
        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [
        Object {
          "data": "3",
        },
      ],
      "past": Array [
        Object {
          "data": null,
        },
        Object {
          "data": "1",
        },
      ],
    },
    "data": "2",
  },
}
`)

        store.dispatch(undo(reducerKey))
        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [
        Object {
          "data": "2",
        },
        Object {
          "data": "3",
        },
      ],
      "past": Array [
        Object {
          "data": null,
        },
      ],
    },
    "data": "1",
  },
}
`)

        store.dispatch(undo(reducerKey))
        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [
        Object {
          "data": "1",
        },
        Object {
          "data": "2",
        },
        Object {
          "data": "3",
        },
      ],
      "past": Array [],
    },
    "data": null,
  },
}
`)

        store.dispatch(undo(reducerKey))
        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [
        Object {
          "data": "1",
        },
        Object {
          "data": "2",
        },
        Object {
          "data": "3",
        },
      ],
      "past": Array [],
    },
    "data": null,
  },
}
`)

        store.dispatch(redo(reducerKey))
        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [
        Object {
          "data": "2",
        },
        Object {
          "data": "3",
        },
      ],
      "past": Array [
        Object {
          "data": null,
        },
      ],
    },
    "data": "1",
  },
}
`)

        store.dispatch(redo(reducerKey))
        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [
        Object {
          "data": "3",
        },
      ],
      "past": Array [
        Object {
          "data": null,
        },
        Object {
          "data": "1",
        },
      ],
    },
    "data": "2",
  },
}
`)

        store.dispatch(redo(reducerKey))
        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [],
      "past": Array [
        Object {
          "data": null,
        },
        Object {
          "data": "1",
        },
        Object {
          "data": "2",
        },
      ],
    },
    "data": "3",
  },
}
`)

        store.dispatch(redo(reducerKey))
        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [],
      "past": Array [
        Object {
          "data": null,
        },
        Object {
          "data": "1",
        },
        Object {
          "data": "2",
        },
      ],
    },
    "data": "3",
  },
}
`)
    })

    it('overrides future states', () => {
        const store = createTestStore()

        store.dispatch(saveState(reducerKey))
        store.dispatch(action.test('1'))

        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [],
      "past": Array [
        Object {
          "data": null,
        },
      ],
    },
    "data": "1",
  },
}
`)

        store.dispatch(saveState(reducerKey))
        store.dispatch(action.test('2'))
        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [],
      "past": Array [
        Object {
          "data": null,
        },
        Object {
          "data": "1",
        },
      ],
    },
    "data": "2",
  },
}
`)

        store.dispatch(undo(reducerKey))
        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [
        Object {
          "data": "2",
        },
      ],
      "past": Array [
        Object {
          "data": null,
        },
      ],
    },
    "data": "1",
  },
}
`)

        store.dispatch(saveState(reducerKey))
        store.dispatch(action.test('2'))
        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [],
      "past": Array [
        Object {
          "data": null,
        },
        Object {
          "data": "1",
        },
      ],
    },
    "data": "2",
  },
}
`)
    })

    it('clears state history', () => {
        const store = createTestStore()

        store.dispatch(saveState(reducerKey))
        store.dispatch(action.test('1'))
        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [],
      "past": Array [
        Object {
          "data": null,
        },
      ],
    },
    "data": "1",
  },
}
`)

        store.dispatch(saveState(reducerKey))
        store.dispatch(action.test('2'))
        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [],
      "past": Array [
        Object {
          "data": null,
        },
        Object {
          "data": "1",
        },
      ],
    },
    "data": "2",
  },
}
`)

        store.dispatch(undo(reducerKey))
        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [
        Object {
          "data": "2",
        },
      ],
      "past": Array [
        Object {
          "data": null,
        },
      ],
    },
    "data": "1",
  },
}
`)

        store.dispatch(clearHistory(reducerKey))
        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [],
      "past": Array [],
    },
    "data": "1",
  },
}
`)
    })

    it('sets limit in FIFO order', () => {
        const store = createTestStore({ limit: 3 })

        store.dispatch(saveState(reducerKey))
        store.dispatch(action.test('1'))

        store.dispatch(saveState(reducerKey))
        store.dispatch(action.test('2'))

        store.dispatch(saveState(reducerKey))
        store.dispatch(action.test('3'))

        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [],
      "past": Array [
        Object {
          "data": "1",
        },
        Object {
          "data": "2",
        },
      ],
    },
    "data": "3",
  },
}
`)

        store.dispatch(saveState(reducerKey))
        store.dispatch(action.test('4'))

        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [],
      "past": Array [
        Object {
          "data": "2",
        },
        Object {
          "data": "3",
        },
      ],
    },
    "data": "4",
  },
}
`)

        store.dispatch(saveState(reducerKey))
        store.dispatch(action.test('5'))

        expect(store.getState()).toMatchInlineSnapshot(`
Object {
  "test": Object {
    "_history": Object {
      "future": Array [],
      "past": Array [
        Object {
          "data": "3",
        },
        Object {
          "data": "4",
        },
      ],
    },
    "data": "5",
  },
}
`)
    })

    it('selectors', () => {
        const store = createTestStore()

        store.dispatch(saveState(reducerKey))
        store.dispatch(action.test('1'))

        store.dispatch(saveState(reducerKey))
        store.dispatch(action.test('2'))

        store.dispatch(saveState(reducerKey))
        store.dispatch(action.test('3'))

        store.dispatch(undo(reducerKey))

        expect(pastSelector(store.getState()[reducerKey]))
            .toMatchInlineSnapshot(`
Array [
  Object {
    "data": null,
  },
  Object {
    "data": "1",
  },
]
`)
        expect(futureSelector(store.getState()[reducerKey]))
            .toMatchInlineSnapshot(`
Array [
  Object {
    "data": "3",
  },
]
`)
        expect(
            pastCountSelector(store.getState()[reducerKey])
        ).toMatchInlineSnapshot(`2`)
        expect(
            futureCountSelector(store.getState()[reducerKey])
        ).toMatchInlineSnapshot(`1`)
    })
})
