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

// Create-redux-actions module name
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

// // use case 1
// // DEPRECATED: stick to original flow. just use mergeDeep to merge recursively
// const reducer = handleActions({
//     [creator]: (state, action) => {
//         // return only what was changed
//         return {
//             pending: false
//         }
//     }
// }, initialState)

// // use case 2
// // DONE
// // supports nested actions
// const reducer = handleActions({
//     [nested(creator)]: {
//          // function only
//         do: (state, action) => ({
//             done: false
//         }),
//          // function and nested
//         undo: [
//             (state, action) => ({
//                 done: false
//             }),
//             {
//                 latest: (state, action) => ({
//                     latest: true
//                 }),
//             }
//         ],
//          // nested only
//         redo: {
//             first: () => ({

//             })
//         }
//     }
// }, initialState)

// use case 3
// handles action.request, success, abort, error, etc
// defaultInitialState =
// {
//     error: false,
//     data: [],
//     pending: false
// }
// optional, will be merged to defaultInitialState
// const overrideInitialState = {
//     error: null,
//     data: null,
//     pending: true,
//     // ...other
// }
// const reducer = handleWebApiActions(fetchProfile, {
//     // override default on api request handler, optional
//     [fetchProfile]: {
//         // nextState will only be available for api request actions
//         request: (state, action, nextState) => ({
//             ...nextState,
//         }),
//         success: (state, action, nextState) => ({
//             ...nextState,
//         }),
//         error: (state, action, nextState) => ({
//             ...nextState,
//         }),
//     },
//     [otherAction]: (state, action) => ({
//         ...state
//     })
// }, overrideInitialState)

// // use case 4
// // DONE
// // multiple action
// const reducer = handleActions({
//     // will be called if either one of them was dispatched
//     [multi('action1', 'action2')]: (state, action) => ({
//         isOpen: false
//     })
// }, initialState)

// // use case 5
// // dynamic state
// const reducer = handleActions({
//     [path(['sessions', 'selected'])]: {
//         // state is whatever on sessions.selected
//         [action1]: (state, action) => ({
//             selected: null
//         })
//     },
//     [path(['sessions', action => action.meta.id])]: {
//         // state is whatever on sessions[action.meta.id]
//         // return of undefined must delete the last path from state
//         [action2]: (state, action) => undefined
//     }
// }, initialState)

// // use case 6
// // apiRequest actions
// const reducer = handleActions(
//     {
//         // 'key', actionCreator, overrideApiInitialState = { error: false, pending: false, data: []}
//         [apiRequest('profile', fetchProfile, overrideApiInitialState)]: {
//             // overrides default success handler, optional
//             // same params to handleWebApiActions
//             success: (state, action, nextState) => ({
//                 ...nextState,
//                 data: action.payload.data
//             })
//         },
//         // empty object. default, error, pending, success handler
//         [apiRequest('images', fetchImages, overrideApiInitialState)]: {},
//         // optional, can edit root reducer state
//         [fetchImages.request]: (state, action) => ({
//             ...nextState
//         })
//     },
//     initialState
// )

// Must support nested custom handlers
// ex.
// {
//      [path('session', 'selected')]: {
//          multi('')
//      }
//
//      [nested(action)]: {
//          [path('hey', 'boy')]: {
//                {
//
//                }
//          }
//      }
// }
