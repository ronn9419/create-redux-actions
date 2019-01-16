/* eslint-disable no-undef */
import { mergeDeepRight } from 'ramda'
import mergeDeep from '../../utils/mergeDeep'

require('jasmine-check').install()

describe('mergeDeep module', () => {
    it('merge deep level-1', () => {
        const state = {
            a: {
                b: 123
            }
        }

        const addState = {
            c: {
                data: 456
            }
        }

        const mergedState = mergeDeep(state, addState)

        expect(mergedState.a === state.a).toBeTruthy()
        expect(mergedState.c === addState.c).toBeTruthy()
        expect(mergedState).toEqual(mergeDeepRight(state, addState))
    })

    it('merge deep level-2', () => {
        const state = {
            a: {
                b: {
                    data: 123
                }
            }
        }

        const addState = {
            a: {
                c: {
                    data: 456
                }
            }
        }

        const mergedState = mergeDeep(state, addState)

        expect(mergedState.a.b === state.a.b).toBeTruthy()
        expect(mergedState.a.c === addState.a.c).toBeTruthy()
        expect(mergedState).toEqual(mergeDeepRight(state, addState))
    })

    it('merge deep level-3', () => {
        const state = {
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
        }

        const addState = {
            a: {
                b: {
                    data: 789,
                    d: {
                        e: 'abc'
                    }
                }
            }
        }

        const mergedState = mergeDeep(state, addState)

        expect(mergedState.a.b === state.a.b).toBeFalsy()
        expect(mergedState.a.b.f === state.a.b.f).toBeTruthy()
        expect(mergedState.a.b.d === addState.a.b.d).toBeTruthy()
        expect(mergedState.a.c === state.a.c).toBeTruthy()
        expect(mergedState.a === state.a).toBeFalsy()
        expect(mergedState).toEqual(mergeDeepRight(state, addState))
    })

    check.it(
        'merge random objects level-1',
        gen.object(gen.int, { size: 5 }),
        gen.object(gen.int, { size: 5 }),
        (obj1, obj2) => {
            expect(mergeDeep(obj1, obj2)).toEqual(mergeDeepRight(obj1, obj2))
        }
    )

    check.it(
        'merge random objects level-2',
        gen.object(gen.object(gen.int, { size: 2 }), { size: 3 }),
        gen.object(gen.object(gen.int, { size: 2 }), { size: 3 }),
        (obj1, obj2) => {
            expect(mergeDeep(obj1, obj2)).toEqual(mergeDeepRight(obj1, obj2))
        }
    )

    check.it(
        'merge random objects level-3',
        gen.object(gen.object(gen.object(gen.int, { size: 1 }), { size: 2 }), {
            size: 3
        }),
        gen.object(gen.object(gen.object(gen.int, { size: 1 }), { size: 2 }), {
            size: 3
        }),
        (obj1, obj2) => {
            expect(mergeDeep(obj1, obj2)).toEqual(mergeDeepRight(obj1, obj2))
        }
    )

    it('merge deep level-1 (3 params)', () => {
        const state = {
            a: {
                b: 123
            }
        }

        const state2 = {
            c: {
                data: 456
            }
        }

        const state3 = {
            c: {
                data: 789
            },
            d: {
                data: 101112
            }
        }

        const mergedState = mergeDeep(state, state2, state3)

        expect(mergedState.a === state.a).toBeTruthy()
        expect(mergedState.c === state2.c).toBeFalsy()
        expect(mergedState.d === state3.d).toBeTruthy()
        expect(mergedState).toEqual(
            mergeDeepRight(state, mergeDeepRight(state2, state3))
        )
    })

    it('merge deep level-2 (3 params)', () => {
        const state = {
            a: {
                a: 1,
                b: 2
            },
            c: {
                d: 3
            }
        }

        const state2 = {
            a: {
                a: 2,
                c: 3
            },
            b: {
                a: 1
            }
        }

        const state3 = {
            a: {
                c: 4,
                d: {
                    e: 5
                }
            },
            b: {
                c: 2
            }
        }

        const mergedState = mergeDeep(state, state2, state3)

        expect(mergedState.b === state2.b).toBeFalsy()
        expect(mergedState.b === state3.b).toBeFalsy()
        expect(mergedState.b.a === state2.b.a).toBeTruthy()
        expect(mergedState.b.c === state3.b.c).toBeTruthy()
        expect(mergedState.c === state.c).toBeTruthy()
        expect(mergedState.c === state.c).toBeTruthy()
        expect(mergedState.a === state.a).toBeFalsy()
        expect(mergedState.a === state2.a).toBeFalsy()
        expect(mergedState.a === state3.a).toBeFalsy()
        expect(mergedState.a.a === state2.a.a).toBeTruthy()
        expect(mergedState.a.b === state.a.b).toBeTruthy()
        expect(mergedState.a.c === state3.a.c).toBeTruthy()
        expect(mergedState.a.d === state3.a.d).toBeTruthy()
        expect(mergedState).toEqual(
            mergeDeepRight(state, mergeDeepRight(state2, state3))
        )
    })

    it('merges empty object', () => {
        const config = {
            initialState: {
                error: false,
                pending: false,
                data: []
            }
        }

        const newObj = mergeDeep(config, { initialState: {} })

        expect(newObj).toEqual({ initialState: {} })
    })
})
