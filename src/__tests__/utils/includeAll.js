import includeAll from '../../utils/includeAll'

describe('includeAll util', () => {
    it('merge objs', () => {
        const obj1 = {
            a: 1,
            b: 2
        }

        const obj2 = {
            a: 3,
            c: 4
        }

        const all = includeAll(obj1, obj2)
        expect(all).toEqual({
            a: [1, 3],
            b: 2,
            c: 4
        })
    })

    it('merge objs level-2', () => {
        const obj1 = {
            a: {
                a: 1
            },
            b: 2,
            c: {
                d: 3
            }
        }

        const obj2 = {
            a: {
                b: 2
            },
            c: 4
        }

        const obj3 = {
            a: {
                c: 3
            }
        }

        const all = includeAll(obj1, obj2, obj3)
        expect(all).toEqual({
            a: [{ a: 1 }, { b: 2 }, { c: 3 }],
            b: 2,
            c: [{ d: 3 }, 4]
        })
    })
})
