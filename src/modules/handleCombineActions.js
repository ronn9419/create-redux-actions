/* eslint-disable array-callback-return,no-else-return */

import isFunction from '../utils/isFunction'
import { createKey } from './createCustomKey'

export const key = '__combine__'

export const combineActions = createKey((...actions) => {
    const strActions = actions.map(action => action.toString())
    return [key, strActions]
})

export const isCombined = data => data[0] === key

export const extractData = key => {
    if (key && !isCombined(key)) {
        return null
    }

    return key[1]
}

export const combineActionsHandler = (key, value) => {
    if (!isFunction(value)) {
        throw new Error('CombineActions handler value must be a function')
    }

    const data = extractData(key)

    return [
        data.reduce((acc, cur) => {
            acc[cur] = value
            return acc
        }, {})
    ]
}
