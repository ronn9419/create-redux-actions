import createActions from '../../createActions'
import handleActions from '../../handleActions'
import { extractKey } from '../../modules/createCustomKey'
import { multi, key, extractData } from '../../modules/handleMultiActions'

describe('HandleNestedActions module', () => {
    it('creates desired key for handleActions', () => {
        const action = createActions('test-action', {
            test: {}
        })

        const result = multi(action)
        const extracted = extractKey(result)

        expect(extracted).toEqual([key, [action.toString()]])
    })

    it('creates desired key for multiple input', () => {
        const action = createActions('test-action', {
            test1: {},
            test2: {},
            test3: {}
        })

        const result = multi(action.test1, action.test2, action.test3)
        const extracted = extractKey(result)

        expect(extracted).toEqual([
            key,
            [
                action.test1.toString(),
                action.test2.toString(),
                action.test3.toString()
            ]
        ])
    })

    it('adds correct handlers', () => {
        const action = createActions('my-action', {
            test1: {},
            test2: {},
            test3: {}
        })

        const testHandler = (state, action) => state

        const handlers = handleActions(
            {
                [multi(action.test1, action.test2, action.test3)]: testHandler
            },
            {}
        )

        expect(handlers.getHandlers()).toMatchObject({
            [action.test1]: testHandler,
            [action.test2]: testHandler,
            [action.test3]: testHandler
        })
    })

    it('throws error when passed non-function value', () => {
        const action = createActions('my-action', {
            test1: {},
            test2: {},
            test3: {}
        })

        const testHandler = {}

        expect(() =>
            handleActions(
                {
                    [multi(
                        action.test1,
                        action.test2,
                        action.test3
                    )]: testHandler
                },
                {}
            )
        ).toThrowErrorMatchingInlineSnapshot(
            `"Multi handler value must be a function"`
        )
    })
})
