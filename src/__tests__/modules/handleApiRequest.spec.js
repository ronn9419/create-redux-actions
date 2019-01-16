import { createStore, combineReducers } from 'redux'
import createActions from '../../createActions'
import handleActions from '../../handleActions'
import { extractKey } from '../../modules/createCustomKey'
import {
    apiRequest,
    extractData,
    clearLookup
} from '../../modules/handleApiRequest'

const initialConfig = {
    initialState: {
        pending: false,
        error: false,
        data: []
    }
}

describe('apiRequest module', () => {
    describe('key', () => {
        it('correct key', () => {
            const action = createActions('my-action')
            const apiRequestKey = apiRequest('my-state', action)

            const key = extractKey(apiRequestKey)
            const [prop, extractedAction, extractedInitialState] = extractData(
                key
            )

            expect(extractedAction === action).toBe(true)
            expect(prop).toBe('my-state')
            expect(extractedInitialState).toEqual(initialConfig.initialState)

            clearLookup()
        })

        it('correct key with correct initialState', () => {
            const action = createActions('my-action')
            const apiRequestKey = apiRequest('my-state', action, {
                error: null,
                data: null,
                pending: 0
            })

            const key = extractKey(apiRequestKey)
            const [prop, extractedAction, extractedInitialState] = extractData(
                key
            )

            expect(extractedAction === action).toBe(true)
            expect(prop).toBe('my-state')
            expect(extractedInitialState).toEqual({
                error: null,
                data: null,
                pending: 0
            })

            clearLookup()
        })
    })

    describe('handlers and initialState', () => {
        it('creates correct handler', () => {
            const action = createActions('my-action', {
                success: {},
                request: {},
                error: {},
                abort: {},
                cancel: {}
            })

            const myReducer = handleActions(
                {
                    [apiRequest('myRequest', action)]: {}
                },
                {
                    someState: {}
                }
            )

            const handlers = myReducer.getHandlers()

            expect(handlers[action.request]).toEqual(expect.any(Function))
            expect(handlers[action.success]).toEqual(expect.any(Function))
            expect(handlers[action.error]).toEqual(expect.any(Function))
            expect(handlers[action.cancel]).toEqual(expect.any(Function))
            expect(handlers[action.abort]).toEqual(expect.any(Function))
            expect(myReducer.getInitialState()).toEqual({
                myRequest: { pending: false, error: false, data: [] },
                someState: {}
            })

            clearLookup()
        })

        it('creates correct handler with multiple action', () => {
            const action1 = createActions('my-action', {
                success: {},
                request: {},
                error: {},
                abort: {},
                cancel: {}
            })

            const action2 = createActions('my-action2', {
                success: {},
                request: {},
                error: {},
                abort: {},
                cancel: {}
            })

            const myReducer = handleActions(
                {
                    [apiRequest('myRequest1', action1)]: {},
                    [apiRequest('myRequest2', action2)]: {}
                },
                {
                    someState: {}
                }
            )

            const handlers = myReducer.getHandlers()

            expect(handlers[action1.request]).toEqual(expect.any(Function))
            expect(handlers[action1.success]).toEqual(expect.any(Function))
            expect(handlers[action1.error]).toEqual(expect.any(Function))
            expect(handlers[action1.cancel]).toEqual(expect.any(Function))
            expect(handlers[action1.abort]).toEqual(expect.any(Function))

            expect(handlers[action2.request]).toEqual(expect.any(Function))
            expect(handlers[action2.success]).toEqual(expect.any(Function))
            expect(handlers[action2.error]).toEqual(expect.any(Function))
            expect(handlers[action2.cancel]).toEqual(expect.any(Function))
            expect(handlers[action2.abort]).toEqual(expect.any(Function))

            expect(myReducer.getInitialState()).toEqual({
                myRequest1: { pending: false, error: false, data: [] },
                myRequest2: { pending: false, error: false, data: [] },
                someState: {}
            })

            clearLookup()
        })

        it('creates correct initialState', () => {
            const action = createActions('my-action', {
                success: {},
                request: {},
                error: {},
                abort: {},
                cancel: {}
            })

            const myReducer = handleActions(
                {
                    [apiRequest('myRequest', action, {
                        error: null,
                        data: null,
                        pending: 0
                    })]: {}
                },
                {
                    someState: {}
                }
            )

            const handlers = myReducer.getHandlers()

            expect(handlers[action.request]).toEqual(expect.any(Function))
            expect(handlers[action.success]).toEqual(expect.any(Function))
            expect(handlers[action.error]).toEqual(expect.any(Function))
            expect(handlers[action.cancel]).toEqual(expect.any(Function))
            expect(handlers[action.abort]).toEqual(expect.any(Function))

            expect(myReducer.getInitialState()).toEqual({
                myRequest: { error: null, data: null, pending: 0 },
                someState: {}
            })

            clearLookup()
        })

        it('creates correct initialState with multiple apiRequest', () => {
            const action1 = createActions('my-action1', {
                success: {},
                request: {},
                error: {},
                abort: {},
                cancel: {}
            })

            const action2 = createActions('my-action2', {
                success: {},
                request: {},
                error: {},
                abort: {},
                cancel: {}
            })

            const myReducer = handleActions(
                {
                    [apiRequest('myRequest1', action1, {
                        error: null,
                        data: null,
                        pending: 0
                    })]: {},
                    [apiRequest('myRequest2', action2, {
                        error: [],
                        data: false,
                        pending: []
                    })]: {}
                },
                {
                    someState: {}
                }
            )

            const handlers = myReducer.getHandlers()

            expect(handlers[action1.request]).toEqual(expect.any(Function))
            expect(handlers[action1.success]).toEqual(expect.any(Function))
            expect(handlers[action1.error]).toEqual(expect.any(Function))
            expect(handlers[action1.cancel]).toEqual(expect.any(Function))
            expect(handlers[action1.abort]).toEqual(expect.any(Function))

            expect(handlers[action2.request]).toEqual(expect.any(Function))
            expect(handlers[action2.success]).toEqual(expect.any(Function))
            expect(handlers[action2.error]).toEqual(expect.any(Function))
            expect(handlers[action2.cancel]).toEqual(expect.any(Function))
            expect(handlers[action2.abort]).toEqual(expect.any(Function))

            expect(myReducer.getInitialState()).toEqual({
                myRequest1: { error: null, data: null, pending: 0 },
                myRequest2: { error: [], data: false, pending: [] },
                someState: {}
            })

            clearLookup()
        })

        it('correct state', () => {
            const action = createActions('my-action', {
                success: {},
                request: {},
                error: {},
                abort: {},
                cancel: {}
            })

            const myReducer = handleActions(
                {
                    [apiRequest('myRequest', action)]: {}
                },
                {}
            )

            const store = createStore(
                combineReducers({
                    myReducer
                })
            )

            expect(store.getState()).toEqual({
                myReducer: {
                    myRequest: {
                        pending: false,
                        error: false,
                        data: []
                    }
                }
            })

            store.dispatch(action.request())

            expect(store.getState()).toEqual({
                myReducer: {
                    myRequest: {
                        pending: true,
                        error: false,
                        data: []
                    }
                }
            })

            store.dispatch(action.success('payload'))

            expect(store.getState()).toEqual({
                myReducer: {
                    myRequest: {
                        pending: false,
                        error: false,
                        data: 'payload'
                    }
                }
            })

            store.dispatch(action.error(true))

            expect(store.getState()).toEqual({
                myReducer: {
                    myRequest: {
                        pending: false,
                        error: true,
                        data: []
                    }
                }
            })

            store.dispatch(action.cancel())

            expect(store.getState()).toEqual({
                myReducer: {
                    myRequest: {
                        pending: false,
                        error: false,
                        data: []
                    }
                }
            })

            store.dispatch(action.request())
            store.dispatch(action.abort())

            expect(store.getState()).toEqual({
                myReducer: {
                    myRequest: {
                        pending: false,
                        error: false,
                        data: []
                    }
                }
            })

            clearLookup()
        })

        it('correct state with custom initial state', () => {
            const action = createActions('my-action', {
                success: {},
                request: {},
                error: {},
                abort: {},
                cancel: {}
            })

            const myReducer = handleActions(
                {
                    [apiRequest('myRequest', action, {
                        error: null,
                        pending: 0,
                        data: null
                    })]: {}
                },
                {}
            )

            const store = createStore(
                combineReducers({
                    myReducer
                })
            )

            expect(store.getState()).toEqual({
                myReducer: {
                    myRequest: {
                        pending: 0,
                        error: null,
                        data: null
                    }
                }
            })

            store.dispatch(action.request())

            expect(store.getState()).toEqual({
                myReducer: {
                    myRequest: {
                        pending: true,
                        error: null,
                        data: null
                    }
                }
            })

            clearLookup()
        })

        it('correct state with custom initial state', () => {
            const action = createActions('my-action', {
                success: {},
                request: {},
                error: {},
                abort: {},
                cancel: {}
            })

            const myReducer = handleActions(
                {
                    [apiRequest('myRequest', action, {
                        error: null,
                        pending: 0,
                        data: null
                    })]: {}
                },
                {}
            )

            const store = createStore(
                combineReducers({
                    myReducer
                })
            )

            expect(store.getState()).toEqual({
                myReducer: {
                    myRequest: {
                        pending: 0,
                        error: null,
                        data: null
                    }
                }
            })

            store.dispatch(action.request())

            expect(store.getState()).toEqual({
                myReducer: {
                    myRequest: {
                        pending: true,
                        error: null,
                        data: null
                    }
                }
            })

            clearLookup()
        })

        it('correct state with multiple action', () => {
            const action1 = createActions('my-action1', {
                success: {},
                request: {},
                error: {},
                abort: {},
                cancel: {}
            })

            const action2 = createActions('my-action2', {
                success: {},
                request: {},
                error: {},
                abort: {},
                cancel: {}
            })

            const myReducer = handleActions(
                {
                    [apiRequest('myRequest1', action1)]: {},
                    [apiRequest('myRequest2', action2)]: {}
                },
                {}
            )

            const store = createStore(
                combineReducers({
                    myReducer
                })
            )

            expect(store.getState()).toEqual({
                myReducer: {
                    myRequest1: {
                        pending: false,
                        error: false,
                        data: []
                    },
                    myRequest2: {
                        pending: false,
                        error: false,
                        data: []
                    }
                }
            })

            store.dispatch(action1.request())

            expect(store.getState()).toEqual({
                myReducer: {
                    myRequest1: {
                        pending: true,
                        error: false,
                        data: []
                    },
                    myRequest2: {
                        pending: false,
                        error: false,
                        data: []
                    }
                }
            })

            store.dispatch(action2.request())

            expect(store.getState()).toEqual({
                myReducer: {
                    myRequest1: {
                        pending: true,
                        error: false,
                        data: []
                    },
                    myRequest2: {
                        pending: true,
                        error: false,
                        data: []
                    }
                }
            })

            clearLookup()
        })

        it('custom handler', () => {
            const action = createActions('my-action', {
                success: {},
                request: {},
                error: {},
                abort: {},
                cancel: {}
            })

            const myReducer = handleActions(
                {
                    [apiRequest('myRequest', action)]: {
                        request: (state, action, nextState) => {
                            expect(nextState).toEqual({
                                pending: true,
                                error: false,
                                data: []
                            })

                            return {
                                ...nextState,
                                pending: 1
                            }
                        },
                        error: (state, action, nextState) => {
                            expect(nextState).toEqual({
                                pending: false,
                                error: 'error',
                                data: []
                            })

                            return {
                                ...nextState,
                                error: {
                                    error: action.payload
                                }
                            }
                        },
                        cancel: (state, action, nextState) => {
                            expect(nextState).toEqual({
                                pending: false,
                                error: false,
                                data: []
                            })

                            return {
                                ...nextState,
                                error: 'cancelled'
                            }
                        },
                        abort: (state, action, nextState) => {
                            expect(nextState).toEqual({
                                pending: false,
                                error: false,
                                data: []
                            })

                            return {
                                ...nextState,
                                error: 'aborted'
                            }
                        }
                    }
                },
                {}
            )

            const store = createStore(
                combineReducers({
                    myReducer
                })
            )

            expect(store.getState()).toEqual({
                myReducer: {
                    myRequest: {
                        pending: false,
                        error: false,
                        data: []
                    }
                }
            })

            store.dispatch(action.request())

            expect(store.getState()).toEqual({
                myReducer: {
                    myRequest: {
                        pending: 1,
                        error: false,
                        data: []
                    }
                }
            })

            store.dispatch(action.success('data'))

            expect(store.getState()).toEqual({
                myReducer: {
                    myRequest: {
                        pending: false,
                        error: false,
                        data: 'data'
                    }
                }
            })

            store.dispatch(action.error('error'))

            expect(store.getState()).toEqual({
                myReducer: {
                    myRequest: {
                        pending: false,
                        error: {
                            error: 'error'
                        },
                        data: []
                    }
                }
            })

            store.dispatch(action.cancel())

            expect(store.getState()).toEqual({
                myReducer: {
                    myRequest: {
                        pending: false,
                        error: 'cancelled',
                        data: []
                    }
                }
            })

            store.dispatch(action.abort())

            expect(store.getState()).toEqual({
                myReducer: {
                    myRequest: {
                        pending: false,
                        error: 'aborted',
                        data: []
                    }
                }
            })

            clearLookup()
        })
    })
})
