/* eslint-disable array-callback-return,no-else-return */

import isFunction from '../utils/isFunction'
import { createKey } from './createCustomKey'

export const key = '__multi__'

export const multi = createKey((...actions) => {
    const strActions = actions.map(action => action.toString())
    return [key, strActions]
})

export const isMulti = data => data[0] === key

export const extractData = key => {
    if (key && !isMulti(key)) {
        return null
    }

    return key[1]
}

export const multiHandler = (key, value) => {
    if (!isFunction(value)) {
        throw new Error('Multi handler value must be a function')
    }

    const data = extractData(key)

    return [
        data.reduce((acc, cur) => {
            acc[cur] = value
            return acc
        }, {})
    ]
}
