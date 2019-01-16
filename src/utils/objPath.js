/* eslint-disable no-prototype-builtins */

const isObjectLike = obj => obj instanceof Object

export default (path, obj, defaultValue = undefined) => {
    if (!isObjectLike(obj)) {
        return defaultValue
    }

    let acc = obj
    const len = path.length

    for (let i = 0; i < len; i++) {
        if (i === len - 1) {
            return acc.hasOwnProperty && acc.hasOwnProperty(path[i])
                ? acc[path[i]]
                : defaultValue
        }

        if (!isObjectLike(acc[path[i]])) {
            return defaultValue
        }

        acc = acc[path[i]]
    }
}
