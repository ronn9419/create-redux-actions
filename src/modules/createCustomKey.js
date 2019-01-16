/* eslint-disable valid-jsdoc */

/**
 * @type {string}
 */
export const customKey = '__custom:'

/**
 * @param {string} key
 * @return {boolean} isCustomKey
 */
export const isCustomKey = key => key.indexOf(customKey) === 0

export const extractKey = key => {
    if (!isCustomKey(key)) {
        return null
    }

    return JSON.parse(key.slice(customKey.length))
}

/**
 * @param {function} creator
 * @return {function} customKey
 */
export const createKey = creator => (...args) =>
    `${customKey}${JSON.stringify(creator(...args))}`
