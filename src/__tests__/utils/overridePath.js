import overridePath from '../../utils/overridePath'

describe('overridePath util', () => {
    it('overrides the value of the path', () => {
        const state = {
            a: {
                b: 0
            }
        }

        const newState = overridePath(['a', 'b'], state, 123)

        expect(newState).toEqual({
            a: {
                b: 123
            }
        })
    })

    it('preserve other sibling path', () => {
        const state = {
            a: {
                b: 0,
                c: {
                    d: 1
                }
            }
        }

        const newState = overridePath(['a', 'b'], state, 123)

        expect(newState).toEqual({
            a: {
                b: 123,
                c: {
                    d: 1
                }
            }
        })

        expect(newState.a.c === state.a.c).toBe(true)
    })

    it('overrides path even if object', () => {
        const state = {
            a: {
                b: {
                    e: 1,
                    f: 1
                },
                c: {
                    d: 1
                }
            }
        }

        const newState = overridePath(['a', 'b'], state, { e: 2 })

        expect(newState).toEqual({
            a: {
                b: {
                    e: 2
                },
                c: {
                    d: 1
                }
            }
        })

        expect(newState.a.c === state.a.c).toBe(true)
    })

    it('does not modify original object', () => {
        const state = {
            a: {
                b: {
                    e: 1,
                    f: 1
                },
                c: {
                    d: 1
                }
            }
        }

        const newState = overridePath(['a', 'b'], state, { e: 2 })

        expect(newState).toEqual({
            a: {
                b: {
                    e: 2
                },
                c: {
                    d: 1
                }
            }
        })

        expect(newState.a.c === state.a.c).toBe(true)
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
        })
    })

    it('deletes path when value is undefined', () => {
        const state = {
            a: {
                b: {
                    c: 1
                },
                d: {}
            }
        }

        const newState = overridePath(['a', 'b'], state, undefined)

        expect(newState).toEqual({
            a: {
                d: {}
            }
        })
    })
})
