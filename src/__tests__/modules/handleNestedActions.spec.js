import createActions from '../../createActions'
import handleActions from '../../handleActions'
import { extractKey } from '../../modules/createCustomKey'
import {
    nested,
    key,
    extractData,
    getNestedValue
} from '../../modules/handleNestedActions'

describe('HandleNestedActions module', () => {
    it('creates desired key for handleActions', () => {
        const action = createActions('test-action', {
            test: {}
        })

        const result = nested(action)
        const extracted = extractKey(result)

        expect(extracted).toEqual([key, action.toString()])
    })

    it('retrieves correct action', () => {
        const action = createActions('my-action', {
            test: {}
        })

        const result = nested(action)
        const data = extractData(extractKey(result))

        expect(getNestedValue(data)).toEqual(action)
    })

    it('retrieves correct action of nested action', () => {
        const action = createActions('my-action', {
            test: {
                nest: {}
            }
        })

        const result = nested(action.test)
        const data = extractData(extractKey(result))

        expect(getNestedValue(data)).toEqual(action.test)
    })

    it('adds correct handlers', () => {
        const action = createActions('my-action', {
            test: {}
        })

        const testHandler = (state, action) => state
        const otherHandler = (state, action) => state

        const handlers = handleActions(
            {
                [nested(action)]: {
                    test: testHandler
                }
            },
            { data: null }
        )

        expect(handlers.getHandlers()).toMatchObject({
            [action.test]: testHandler
        })
    })

    it('supports function form', () => {
        const action = createActions('my-action', {
            test: {},
            other: {}
        })

        const testHandler = (state, action) => state
        const otherHandler = (state, action) => state

        const handlers = handleActions(
            {
                [nested(action)]: {
                    test: testHandler,
                    other: otherHandler
                }
            },
            { data: null }
        )

        expect(handlers.getHandlers()).toMatchObject({
            [action.test]: testHandler,
            [action.other]: otherHandler
        })
    })

    it('supports array form', () => {
        const action = createActions('my-action', {
            test: {
                other: {}
            }
        })

        const testHandler = (state, action) => state
        const otherHandler = (state, action) => state

        const handlers = handleActions(
            {
                [nested(action)]: {
                    test: [
                        testHandler,
                        {
                            other: otherHandler
                        }
                    ]
                }
            },
            { data: null }
        )

        expect(handlers.getHandlers()).toMatchObject({
            [action.test]: testHandler,
            [action.test.other]: otherHandler
        })
    })

    it('supports object form', () => {
        const action = createActions('my-action', {
            test: {
                other: {}
            }
        })

        const otherHandler = (state, action) => state

        const handlers = handleActions(
            {
                [nested(action)]: {
                    test: {
                        other: otherHandler
                    }
                }
            },
            { data: null }
        )

        expect(handlers.getHandlers()).toMatchObject({
            [action.test.other]: otherHandler
        })
    })
})
