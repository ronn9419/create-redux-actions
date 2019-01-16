import { createStore, combineReducers } from 'redux'
import createActions from '../../createActions'
import handleActions from '../../handleActions'
import { extractKey } from '../../modules/createCustomKey'
import { nested } from '../../modules/handleNestedActions'
import {
    path,
    key,
    extractData,
    getLookup,
    clearData,
    getEmbedFn,
    embedFnKey
} from '../../modules/handleDynamicState'

describe('handleDynamicState module', () => {
    it('creates desired key for handleActions', () => {
        const result = path('path1', 'path2')
        const extracted = extractKey(result)

        clearData()
        expect(extracted).toEqual([key, ['path1', 'path2']])
    })

    it('with function', () => {
        const fn1 = (state, action) => action
        const fn2 = (state, action) => action

        const result = path('path1', 'path2', fn1, fn2)
        const extracted = extractKey(result)

        const data = extractData(extracted)

        expect(data).toEqual([
            'path1',
            'path2',
            [embedFnKey, 0],
            [embedFnKey, 1]
        ])
        expect(getLookup()).toHaveLength(2)
        expect(getEmbedFn(data[2])).toEqual(fn1)
        expect(getEmbedFn(data[3])).toEqual(fn2)
        clearData()
    })

    it('all function', () => {
        const fn1 = (state, action) => action
        const fn2 = (state, action) => action
        const fn3 = (state, action) => action

        const result = path(fn1, fn2, fn3)
        const extracted = extractKey(result)

        const data = extractData(extracted)

        expect(data).toEqual([
            [embedFnKey, 0],
            [embedFnKey, 1],
            [embedFnKey, 2]
        ])
        expect(getLookup()).toHaveLength(3)
        expect(getEmbedFn(data[0])).toEqual(fn1)
        expect(getEmbedFn(data[1])).toEqual(fn2)
        expect(getEmbedFn(data[2])).toEqual(fn3)
        clearData()
    })

    it('single function', () => {
        const fn1 = (state, action) => action

        const result = path(fn1)
        const extracted = extractKey(result)

        const data = extractData(extracted)

        expect(data).toEqual([[embedFnKey, 0]])
        expect(getLookup()).toHaveLength(1)
        expect(getEmbedFn(data[0])).toEqual(fn1)
        clearData()
    })

    it('single string', () => {
        const result = path('path1')
        const extracted = extractKey(result)

        const data = extractData(extracted)

        expect(data).toEqual(['path1'])
        expect(getLookup()).toHaveLength(0)
        clearData()
    })

    it('update state only in specified path', () => {
        const actionCreator = createActions('my-action')
        const initialState = {
            test: {
                data: {
                    data1: null
                },
                otherData: 123
            }
        }

        const reducer = handleActions(
            {
                [path('test', 'data')]: {
                    [actionCreator]: (state, action) => {
                        expect(state).toEqual({
                            data1: null
                        })

                        return {
                            data1: 321
                        }
                    }
                }
            },
            initialState
        )

        const store = createStore(
            combineReducers({
                sample: reducer
            })
        )

        store.dispatch(actionCreator())

        const state = store.getState()

        expect(
            state.sample.test.otherData === initialState.test.otherData
        ).toBe(true)

        expect(state).toEqual({
            sample: {
                test: {
                    data: {
                        data1: 321
                    },
                    otherData: 123
                }
            }
        })
        clearData()
    })

    it('update state only in specified path using function as path', () => {
        const actionCreator = createActions('my-action')
        const initialState = {
            sessions: {
                123: {
                    data: 'world'
                },
                456: {
                    data: 'hello'
                }
            }
        }

        const reducer = handleActions(
            {
                [path('sessions', (state, action) => {
                    return action.payload
                })]: {
                    [actionCreator]: (state, action, reducerState) => {
                        expect(state).toEqual({
                            data: 'world'
                        })

                        expect(reducerState).toEqual({
                            sessions: {
                                123: {
                                    data: 'world'
                                },
                                456: {
                                    data: 'hello'
                                }
                            }
                        })

                        return {
                            data: 'hello world',
                            otherData: 'test'
                        }
                    }
                }
            },
            initialState
        )

        const store = createStore(
            combineReducers({
                sample: reducer
            })
        )

        store.dispatch(actionCreator(123))

        const state = store.getState()

        expect(
            state.sample.sessions['456'] === initialState.sessions['456']
        ).toBe(true)

        expect(state).toEqual({
            sample: {
                sessions: {
                    123: {
                        data: 'hello world',
                        otherData: 'test'
                    },
                    456: {
                        data: 'hello'
                    }
                }
            }
        })
        clearData()
    })

    it('works in multiple action', () => {
        const actionCreator1 = createActions('my-action1')
        const actionCreator2 = createActions('my-action2')
        const initialState = {
            sessions: {
                123: {
                    data: 'world'
                },
                456: {
                    data: 'hello'
                }
            }
        }

        const reducer = handleActions(
            {
                [path('sessions', (state, action) => {
                    return action.payload
                })]: {
                    [actionCreator1]: (state, action, reducerState) => {
                        expect(state).toEqual({
                            data: 'world'
                        })

                        expect(reducerState).toEqual({
                            sessions: {
                                123: {
                                    data: 'world'
                                },
                                456: {
                                    data: 'hello'
                                }
                            }
                        })

                        return {
                            data: 'payload-1'
                        }
                    },
                    [actionCreator2]: (state, action, reducerState) => {
                        expect(state).toEqual({
                            data: 'hello'
                        })

                        expect(reducerState).toEqual({
                            sessions: {
                                123: {
                                    data: 'payload-1'
                                },
                                456: {
                                    data: 'hello'
                                }
                            }
                        })

                        return {
                            data: 'payload-2'
                        }
                    }
                }
            },
            initialState
        )

        const store = createStore(
            combineReducers({
                sample: reducer
            })
        )

        store.dispatch(actionCreator1(123))
        let state = store.getState()

        expect(state).toEqual({
            sample: {
                sessions: {
                    123: {
                        data: 'payload-1'
                    },
                    456: {
                        data: 'hello'
                    }
                }
            }
        })

        store.dispatch(actionCreator2(456))
        state = store.getState()

        expect(state).toEqual({
            sample: {
                sessions: {
                    123: {
                        data: 'payload-1'
                    },
                    456: {
                        data: 'payload-2'
                    }
                }
            }
        })
        clearData()
    })

    it('works in multiple action', () => {
        const actionCreator = createActions('my-action')
        const initialState = {
            sessions: {
                123: {
                    data: 'world'
                },
                456: {
                    data: 'hello'
                }
            }
        }

        const reducer = handleActions(
            {
                [path('sessions', (state, action) => {
                    return action.payload
                })]: {
                    [actionCreator]: (state, action, reducerState) => {
                        expect(state).toEqual({
                            data: 'world'
                        })

                        expect(reducerState).toEqual({
                            sessions: {
                                123: {
                                    data: 'world'
                                },
                                456: {
                                    data: 'hello'
                                }
                            }
                        })

                        return undefined
                    }
                }
            },
            initialState
        )

        const store = createStore(
            combineReducers({
                sample: reducer
            })
        )

        store.dispatch(actionCreator(123))
        const state = store.getState()

        expect(state).toEqual({
            sample: {
                sessions: {
                    456: {
                        data: 'hello'
                    }
                }
            }
        })
        clearData()
    })

    it('handle duplicate actions (Simple handler will execute first)', () => {
        const action = createActions('my-action')
        const handler1 = (state, { payload }, allState) => {
            expect(allState).toEqual({
                data: {
                    test: null,
                    data2: 1
                }
            })

            expect(state).toEqual({
                test: null,
                data2: 1
            })

            return { test: payload }
        }
        const handler2 = (state, { payload }) => {
            return {
                ...state,
                data: { ...state.data, data2: 1 }
            }
        }

        const reducer = handleActions(
            {
                [path(['data'])]: {
                    [action]: handler1
                },
                [action]: handler2
            },
            {
                data: {
                    test: null
                }
            }
        )

        const store = createStore(
            combineReducers({
                sample: reducer
            })
        )

        store.dispatch(action('payload'))

        expect(store.getState()).toEqual({
            sample: {
                data: {
                    data2: 1,
                    test: 'payload'
                }
            }
        })

        const handlers = reducer.getHandlers()

        expect(handlers[action]).toEqual(expect.any(Array))
        expect(handlers[action]).toHaveLength(2)
        expect(handlers[action][0] === handler2).toBe(true)
    })

    it('works with nested module', () => {
        const action = createActions('my-action', {
            test: {}
        })

        const reducer = handleActions(
            {
                [nested(action)]: {
                    test: (state, action) => {
                        return {
                            ...state,
                            data: {
                                ...state.data,
                                test: action.payload
                            }
                        }
                    }
                },
                [path(['data'])]: {
                    [action.test]: (state, action) => {
                        return { ...state, test2: action.payload }
                    }
                }
            },
            {
                data: {
                    test: null
                }
            }
        )

        const store = createStore(
            combineReducers({
                sample: reducer
            })
        )

        store.dispatch(action.test('payload'))

        expect(store.getState()).toEqual({
            sample: {
                data: {
                    test2: 'payload',
                    test: 'payload'
                }
            }
        })
    })
})
