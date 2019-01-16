/* eslint-disable no-prototype-builtins */
import isObject from './isObject'

const mergeDeep = (...objs) => {
    objs.reverse()
    return objs.reduce((newObj, current) => {
        const objKeys = Object.keys(newObj)
        for (let i = 0; i < objKeys.length; i++) {
            const prop = objKeys[i]

            if (current.hasOwnProperty(prop)) {
                if (
                    isObject(newObj[prop]) &&
                    isObject(current[prop]) &&
                    Object.keys(newObj[prop]).length > 0
                ) {
                    newObj[prop] = mergeDeep(current[prop], newObj[prop])
                }
            }
        }

        return { ...current, ...newObj }
    }, {})
}

export default mergeDeep
