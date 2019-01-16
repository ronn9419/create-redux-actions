/* eslint-disable no-new-object */

export default value => {
    if (Array.isArray(value) || typeof value === 'function') {
        return false
    }

    return new Object(value) === value
}
