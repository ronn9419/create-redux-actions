import objPath from '../../utils/objPath'

describe('objPath util', () => {
    describe.each([
        [['a', 'b'], { a: { b: 1 } }, 1],
        [['a', 'c'], { a: { b: 1 } }],
        [['a', 'c'], { a: { b: 1 } }, 123, 123],
        [['a'], { a: { b: 1 } }, { b: 1 }]
    ])('should work', (path, obj, expected, defaultValue) => {
        it(`path: ${path} obj: ${JSON.stringify(
            obj
        )} expected: ${JSON.stringify(
            expected
        )} defaultValue: ${defaultValue}`, () => {
            expect(objPath(path, obj, defaultValue)).toEqual(expected)
        })
    })

    it('returns a reference to obj', () => {
        const x = {
            a: {
                b: {
                    c: 1
                }
            }
        }

        const obj = objPath(['a', 'b'], x)

        expect(obj).toEqual(x.a.b)
    })
})
