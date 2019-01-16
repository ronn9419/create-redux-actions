import merge from '../../utils/merge'

describe('merge util', () => {
    describe.each([
        [{ a: 1 }, { a: 1 }],
        [{ a: 1, b: 2 }, { a: 1 }, { b: 2 }],
        [{ a: 1, b: 2, c: 3 }, { a: 1 }, { b: 2 }, { c: 3 }],
        [{ a: { c: 2 } }, { a: { b: 1 } }, { a: { c: 2 } }]
    ])('should work', (expected, ...objs) => {
        it(`objs: ${JSON.stringify(objs)} expected: ${JSON.stringify(
            expected
        )}`, () => {
            expect(merge(...objs)).toEqual(expected)
        })
    })
})
