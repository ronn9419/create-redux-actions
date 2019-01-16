require('jasmine-check').install()
import { createKey, customKey, extractKey } from '../../modules/createCustomKey'

describe('createCustomKey module', () => {
    check.it(
        `creates a custom handler with ${customKey} prefix`,
        gen.string,
        gen.string,
        (str1, str2) => {
            const generatedKey = [str1, str2]

            const key = createKey(() => generatedKey)()

            expect(key.indexOf(customKey)).toBe(0)

            const result = extractKey(key)

            expect(result).toEqual(generatedKey)
        }
    )

    check.it(
        `creates a custom handler with ${customKey} prefix. non-array`,
        gen.string,
        str1 => {
            const generatedKey = str1

            const key = createKey(() => generatedKey)()

            expect(key.indexOf(customKey)).toBe(0)

            const result = extractKey(key)

            expect(result).toEqual(generatedKey)
        }
    )
})
