/* eslint-disable array-callback-return,no-else-return */

import isFunction from '../utils/isFunction'
import isArray from '../utils/isArray'
import isObject from '../utils/isObject'
import { createKey } from './createCustomKey'

let lookup = {}

export const key = '__nested__'

export const nested = createKey(action => {
    lookup[action.toString()] = action
    return [key, action.toString()]
})

export const isNested = data => data[0] === key

export const extractData = key => {
    if (key && !isNested(key)) {
        return null
    }

    return key[1]
}

export const getNestedValue = data => lookup[data]

const recursiveMapping = (value, action, handlers = {}) => {
    return Object.keys(value).reduce((acc, v) => {
        if (isArray(value[v])) {
            acc[action[v]] = value[v][0]
            return recursiveMapping(value[v][1], action[v], acc)
        } else if (isObject(value[v])) {
            return recursiveMapping(value[v], action[v], acc)
        } else if (isFunction(value[v])) {
            acc[action[v]] = value[v]
            return acc
        }
    }, handlers)
}

export const nestedHandler = (key, value) => {
    const data = extractData(key)

    const action = getNestedValue(data)
    const handlers = recursiveMapping(value, action)

    return [handlers]
}

export const clearData = () => {
    lookup = {}
}
