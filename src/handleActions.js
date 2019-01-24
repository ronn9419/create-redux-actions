/* eslint-disable valid-jsdoc */

import objPath from './utils/objPath'
import isArray from './utils/isArray'
import merge from './utils/merge'
import mergeDeep from './utils/mergeDeep'
import includeAll from './utils/includeAll'
import action from './action'
import { isCustomKey, extractKey } from './modules/createCustomKey'
import {
    nestedHandler,
    key as nestedActionsKey
} from './modules/handleNestedActions'
import {
    multiHandler,
    key as multiActionsKey
} from './modules/handleMultiActions'
import { pathHandler, key as pathKey } from './modules/handleDynamicState'
import {
    apiRequestHandler,
    key as apiRequestKey
} from './modules/handleApiRequest'

const handlersKeyMap = {
    [nestedActionsKey]: nestedHandler,
    [multiActionsKey]: multiHandler,
    [pathKey]: pathHandler,
    [apiRequestKey]: apiRequestHandler
}

/**
 *
 * @param {*} handlers
 * @param {*} initialState
 * @return {*}
 */
export function baseHandleActions(handlers, initialState = {}) {
    return (state = initialState, action) => {
        const reducer = objPath([objPath(['type'], action)], handlers)

        if (!reducer) {
            return state
        }

        if (isArray(reducer)) {
            return reducer.reduce((newState, fn) => {
                return mergeDeep(
                    newState,
                    fn(mergeDeep(state, newState), action)
                )
            }, {})
        }

        return reducer(state, action)
    }
}

export default (handlers, initialState = {}) => {
    let otherHandlers = {}
    let otherInitialState = {}

    for (const key in handlers) {
        if (isCustomKey(key)) {
            const extracted = extractKey(key)

            if (!handlersKeyMap[extracted[0]]) {
                throw new Error('action handler not found')
            }

            const [
                appendHandlers = {},
                appendInitialState = {}
            ] = handlersKeyMap[extracted[0]](extracted, handlers[key])
            otherHandlers = includeAll(otherHandlers, appendHandlers)

            otherInitialState = merge(otherInitialState, appendInitialState)

            delete handlers[key]
        }
    }

    const finalInitialState = merge(otherInitialState, initialState)

    const mergedHandlers = includeAll(handlers, otherHandlers, {
        [action.clearState]: () => finalInitialState
    })

    const handlerFn = baseHandleActions(mergedHandlers, finalInitialState)

    handlerFn.getHandlers = () => mergedHandlers
    handlerFn.getInitialState = () => finalInitialState

    return handlerFn
}
