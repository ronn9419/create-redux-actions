/* eslint-disable no-undef */
import pathToObj from '../../utils/pathToObj'
import objPath from '../../utils/objPath'

require('jasmine-check').install()

describe('pathToObj util', () => {
    it('generates nested object by path', () => {
        const obj = pathToObj(['a', 'b', 'c'], 'value')

        expect(obj).toEqual({
            a: {
                b: {
                    c: 'value'
                }
            }
        })
    })

    check.it(
        'pass random path and value',
        gen.array(gen.string, { minSize: 1, maxSize: 10 }),
        gen.string,
        (path, value) => {
            const obj = pathToObj(path, value)

            expect(objPath(path, obj)).toEqual(value)
        }
    )
})
