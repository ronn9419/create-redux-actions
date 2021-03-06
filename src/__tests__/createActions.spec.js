// @ts-nocheck
import createActions from '../createActions'

function testActionCreator(actionCreator, type) {
    expect(actionCreator).toEqual(expect.any(Function))
    expect(actionCreator.toString()).toBe(type)
}

describe('createActions module', () => {
    describe('createAction', () => {
        it('action name only', () => {
            const type = 'open'
            const payload = 'payload-data'
            const actionCreator = createActions(type)

            testActionCreator(actionCreator, type)

            let action = actionCreator(payload)

            expect(action).toEqual({
                type: 'open',
                payload
            })
            expect(action).not.toHaveProperty('meta')
            expect(action).not.toHaveProperty('error')
        })

        it('type only', () => {
            const type = 'open'
            const actionCreator = createActions(type, () => [])

            testActionCreator(actionCreator, type)

            let action = actionCreator('data')

            expect(action).toEqual({
                type: 'open'
            })
            expect(action).not.toHaveProperty('payload')
            expect(action).not.toHaveProperty('meta')
            expect(action).not.toHaveProperty('error')
        })

        it('adds payload', () => {
            const type = 'open'
            const payload = 'payload-data'
            const actionCreator = createActions(type, arg1 => [arg1])

            testActionCreator(actionCreator, type)

            let action = actionCreator(payload)

            expect(action).toEqual({
                type: 'open',
                payload
            })
            expect(action).not.toHaveProperty('meta')
            expect(action).not.toHaveProperty('error')
        })

        it('adds meta', () => {
            const type = 'open'
            const meta = 'meta-data'
            const payload = 'payload-data'
            const actionCreator = createActions(type, arg1 => [arg1, meta])

            testActionCreator(actionCreator, type)

            let action = actionCreator(payload)

            expect(action).toEqual({
                type: 'open',
                payload,
                meta
            })
            expect(action).not.toHaveProperty('error')
        })

        it('adds error', () => {
            const type = 'open'
            const meta = 'meta-data'
            const payload = 'payload-data'
            const actionCreator = createActions(type, arg1 => [
                arg1,
                meta,
                true
            ])

            testActionCreator(actionCreator, type)

            let action = actionCreator(payload)

            expect(action).toEqual({
                type: 'open',
                payload,
                meta,
                error: true
            })
        })

        it('action name and payload creator', () => {
            const type = 'action'
            const actionCreator = createActions(type, payload => payload + 1)

            testActionCreator(actionCreator, type)

            let action = actionCreator(100)

            expect(action).toEqual({
                type: 'action',
                payload: 101,
                meta: undefined
            })
        })

        it('action name and payload-meta creator', () => {
            const type = 'payload-meta'
            const actionCreator = createActions(type, payload => [
                payload + 1,
                payload - 1
            ])

            testActionCreator(actionCreator, type)

            let action = actionCreator(100)

            expect(action).toEqual({
                type: 'payload-meta',
                payload: 101,
                meta: 99
            })
        })
    })

    describe('createActions', () => {
        it('creates a namespace', () => {
            const namespace = 'my-namespace'
            const options = {
                suffix: '',
                prefix: '',
                separator: '/'
            }
            const actionCreators = createActions(
                namespace,
                {
                    dialog: {}
                },
                options
            )

            const type = `${options.prefix}${namespace}${options.suffix}${
                options.separator
            }${options.prefix}dialog${options.suffix}`

            expect(actionCreators).toHaveProperty('dialog')
            testActionCreator(actionCreators.dialog, type)

            expect(actionCreators.dialog('payload', 123)).toEqual({
                type,
                payload: 'payload',
                meta: 123
            })
        })

        it('creates root action', () => {
            const namespace = 'my-namespace'
            const options = {
                suffix: '',
                prefix: '',
                separator: '/'
            }
            const actionCreators = createActions(
                namespace,
                {
                    dialog: {}
                },
                options
            )

            testActionCreator(actionCreators, namespace)

            expect(actionCreators('payload', 123)).toEqual({
                type: namespace,
                payload: 'payload',
                meta: 123
            })
        })

        it('creates an action using function', () => {
            const namespace = 'my-action'
            const options = {
                suffix: ']',
                prefix: '['
            }
            const type = `${namespace}/${options.prefix}dialog${options.suffix}`

            const actionCreators = createActions(
                namespace,
                {
                    dialog: () => [123, 456],
                    _options: options
                },
                {
                    separator: '/'
                }
            )

            expect(actionCreators).toHaveProperty('dialog')
            testActionCreator(actionCreators.dialog, type)

            expect(actionCreators.dialog('abc')).toEqual({
                type,
                payload: 123,
                meta: 456
            })
        })

        it('creates actions using array', () => {
            const action = createActions('namespace', {
                dialog: [
                    (arg1, arg2) => [{ arg1, arg2 }, arg2],
                    {
                        open: {},
                        close: [
                            (arg1, arg2) => [{ data: arg1 }, { data: arg2 }],
                            {
                                do: {},
                                _options: {
                                    suffix: '>',
                                    transform: key => key.toUpperCase()
                                }
                            }
                        ],
                        _options: {
                            prefix: '<',
                            separator: '*',
                            transform: key => `xxx${key}xxx`
                        }
                    }
                ],
                _options: {
                    separator: '='
                }
            })

            expect(action.dialog(1, 2)).toEqual({
                type: 'namespace/dialog',
                payload: { arg1: 1, arg2: 2 },
                meta: 2
            })

            expect(action.dialog.close(1, 2)).toEqual({
                type: 'namespace/dialog=<xxxclosexxx',
                payload: { data: 1 },
                meta: { data: 2 }
            })

            expect(action.dialog.close.do(1, 2)).toEqual({
                type: 'namespace/dialog=<xxxclosexxx*<DO>',
                payload: 1,
                meta: 2
            })
        })

        it('creates nested actions', () => {
            const namespace = 'my-namespace'
            const options = {
                suffix: '',
                prefix: '',
                separator: '/'
            }
            const actionCreators = createActions(
                namespace,
                {
                    dialog: {
                        open: {},
                        toggle: payload => [payload, false]
                    }
                },
                options
            )

            const type = `${namespace}${options.separator}${
                options.prefix
            }dialog${options.suffix}`

            expect(actionCreators).toHaveProperty('dialog')
            expect(actionCreators.dialog).toHaveProperty('open')
            expect(actionCreators.dialog).toHaveProperty('toggle')
            testActionCreator(actionCreators.dialog, type)
            testActionCreator(
                actionCreators.dialog.open,
                `${type}${options.separator}open`
            )
            testActionCreator(
                actionCreators.dialog.toggle,
                `${type}${options.separator}toggle`
            )

            expect(actionCreators.dialog('payload', 123)).toEqual({
                type,
                payload: 'payload',
                meta: 123
            })

            expect(actionCreators.dialog.open('open', 456)).toEqual({
                type: `${type}${options.separator}open`,
                payload: 'open',
                meta: 456
            })

            expect(actionCreators.dialog.toggle('toggle', 789)).toEqual({
                type: `${type}${options.separator}toggle`,
                payload: 'toggle',
                meta: false
            })
        })

        it('support _options', () => {
            const namespace = 'my-namespace'

            const actionCreators = createActions(
                namespace,
                {
                    dialog: {
                        open: {},
                        close: {
                            deepAction: {},
                            _options: {
                                prefix: '-',
                                suffix: '+',
                                separator: '\\',
                                transform: key => `$${key}`
                            }
                        },
                        _options: {
                            prefix: '[',
                            separator: '/',
                            transform: key => key.toUpperCase()
                        }
                    },
                    other: {
                        test: {}
                    },
                    _options: {
                        prefix: '<',
                        separator: '=',
                        suffix: '>',
                        transform: key => `key:${key}`
                    }
                },
                {
                    separator: ':'
                }
            )

            expect(actionCreators()).toEqual({
                type: 'my-namespace'
            })

            expect(actionCreators.dialog()).toEqual({
                type: 'my-namespace:<key:dialog>'
            })

            expect(actionCreators.dialog.open()).toEqual({
                type: 'my-namespace:<key:dialog>=[OPEN>'
            })

            expect(actionCreators.dialog.close.deepAction()).toEqual({
                type: 'my-namespace:<key:dialog>=[CLOSE>/-$deepAction+'
            })

            expect(actionCreators.other()).toEqual({
                type: 'my-namespace:<key:other>'
            })

            expect(actionCreators.other.test()).toEqual({
                type: 'my-namespace:<key:other>=<key:test>'
            })
        })
    })
})
