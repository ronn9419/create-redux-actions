/* eslint-disable import/no-named-as-default */
import { createStore, combineReducers } from 'redux'
import handleApiActions from '../handleApiActions'
import { path } from '../modules/handleDynamicState'
import createActions from '../createActions'

describe('handleApiActions', () => {
    it('returns correct handlers', () => {
        const actions = createActions('my-action', {
            request: {},
            error: {},
            success: {},
            cancel: {},
            abort: {}
        })

        const reducer = handleApiActions(actions, {})

        const handlers = reducer.getHandlers()

        expect(handlers[actions.request]).toEqual(expect.any(Function))
        expect(handlers[actions.success]).toEqual(expect.any(Function))
        expect(handlers[actions.error]).toEqual(expect.any(Function))
        expect(handlers[actions.cancel]).toEqual(expect.any(Function))
        expect(handlers[actions.abort]).toEqual(expect.any(Function))
    })

    it('returns correct initialState', () => {
        const actions = createActions('my-action', {
            request: {},
            error: {},
            success: {},
            cancel: {},
            abort: {}
        })

        const reducer = handleApiActions(actions, {})

        const initialState = reducer.getInitialState()

        expect(initialState).toEqual({
            pending: false,
            error: false,
            data: []
        })
    })

    it('overrides initialState', () => {
        const actions = createActions('my-action', {
            request: {},
            error: {},
            success: {},
            cancel: {},
            abort: {}
        })

        const reducer = handleApiActions(
            actions,
            {},
            {
                other: false,
                data: null
            }
        )

        const initialState = reducer.getInitialState()

        expect(initialState).toEqual({
            pending: false,
            error: false,
            data: null,
            other: false
        })
    })

    it('handles actions', () => {
        const actions = createActions('my-action', {
            request: {},
            error: {},
            success: {},
            cancel: {},
            abort: {}
        })

        const myReducer = handleApiActions(
            actions,
            {},
            {
                otherData: true
            }
        )

        const store = createStore(
            combineReducers({
                myReducer
            })
        )

        expect(store.getState()).toEqual({
            myReducer: {
                pending: false,
                error: false,
                data: [],
                otherData: true
            }
        })

        store.dispatch(actions.request())

        expect(store.getState()).toEqual({
            myReducer: {
                pending: true,
                error: false,
                data: [],
                otherData: true
            }
        })

        store.dispatch(actions.success('payload'))

        expect(store.getState()).toEqual({
            myReducer: {
                pending: false,
                error: false,
                data: 'payload',
                otherData: true
            }
        })

        store.dispatch(actions.error(true))

        expect(store.getState()).toEqual({
            myReducer: {
                pending: false,
                error: true,
                data: [],
                otherData: true
            }
        })

        store.dispatch(actions.cancel())

        expect(store.getState()).toEqual({
            myReducer: {
                pending: false,
                error: false,
                data: [],
                otherData: true
            }
        })

        store.dispatch(actions.abort())

        expect(store.getState()).toEqual({
            myReducer: {
                pending: false,
                error: false,
                data: [],
                otherData: true
            }
        })
    })

    it('handles custom reducers', () => {
        const actions = createActions('my-action', {
            request: {},
            error: {},
            success: {},
            cancel: {},
            abort: {}
        })

        const myReducer = handleApiActions(
            actions,
            {
                success: (state, action, nextState) => {
                    expect(state).toEqual({
                        error: false,
                        pending: false,
                        data: [],
                        otherData: true
                    })

                    expect(nextState).toEqual({
                        error: false,
                        pending: false,
                        data: 'payload',
                        otherData: true
                    })

                    return {
                        ...nextState,
                        otherData: false
                    }
                }
            },
            {
                otherData: true
            }
        )

        const store = createStore(
            combineReducers({
                myReducer
            })
        )

        expect(store.getState()).toEqual({
            myReducer: {
                pending: false,
                error: false,
                data: [],
                otherData: true
            }
        })

        store.dispatch(actions.success('payload'))

        expect(store.getState()).toEqual({
            myReducer: {
                pending: false,
                error: false,
                data: 'payload',
                otherData: false
            }
        })
    })

    it('handles other action', () => {
        const actions = createActions('my-action', {
            request: {},
            error: {},
            success: {},
            cancel: {},
            abort: {}
        })

        const otherAction = createActions('other-action')

        const myReducer = handleApiActions(
            actions,
            {
                success: (state, action, nextState) => {
                    expect(state).toEqual({
                        error: false,
                        pending: false,
                        data: [],
                        otherData: true
                    })

                    expect(nextState).toEqual({
                        error: false,
                        pending: false,
                        data: 'payload',
                        otherData: true
                    })

                    return {
                        ...nextState,
                        otherData: false
                    }
                },
                [otherAction]: (state, action) => {
                    return {
                        ...state,
                        otherData: action.payload
                    }
                }
            },
            {
                otherData: true
            }
        )

        const store = createStore(
            combineReducers({
                myReducer
            })
        )

        expect(store.getState()).toEqual({
            myReducer: {
                pending: false,
                error: false,
                data: [],
                otherData: true
            }
        })

        store.dispatch(actions.success('payload'))

        expect(store.getState()).toEqual({
            myReducer: {
                pending: false,
                error: false,
                data: 'payload',
                otherData: false
            }
        })

        store.dispatch(otherAction('my-other-payload'))

        expect(store.getState()).toEqual({
            myReducer: {
                pending: false,
                error: false,
                data: 'payload',
                otherData: 'my-other-payload'
            }
        })
    })

    it('works together with other module', () => {
        const actions = createActions('my-action', {
            request: {},
            error: {},
            success: {},
            cancel: {},
            abort: {}
        })

        const otherAction = createActions('other-action')

        const myReducer = handleApiActions(
            actions,
            {
                request: (state, action, nextState) => {
                    return {
                        ...state,
                        ...nextState,
                        pending: 1
                    }
                },
                [path('otherData')]: {
                    [otherAction]: (state, action) => {
                        return {
                            ...state,
                            data: action.payload
                        }
                    }
                }
            },
            {
                otherData: {
                    data: null
                }
            }
        )

        const store = createStore(
            combineReducers({
                myReducer
            })
        )

        expect(store.getState()).toEqual({
            myReducer: {
                pending: false,
                error: false,
                data: [],
                otherData: {
                    data: null
                }
            }
        })

        store.dispatch(actions.request())

        expect(store.getState()).toEqual({
            myReducer: {
                pending: 1,
                error: false,
                data: [],
                otherData: {
                    data: null
                }
            }
        })

        store.dispatch(otherAction('payload'))

        expect(store.getState()).toEqual({
            myReducer: {
                pending: 1,
                error: false,
                data: [],
                otherData: {
                    data: 'payload'
                }
            }
        })
    })
})
