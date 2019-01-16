/* eslint-disable valid-jsdoc */

import isObject from './utils/isObject'
import isArray from './utils/isArray'
import isString from './utils/isString'
import isFunction from './utils/isFunction'

const defaultPayloadMetaCreator = (arg1, arg2, arg3) => [arg1, arg2, arg3]

/**
 * Create an FSA compliant action creator with payload-meta creator
 * @param {String} actionName
 * @param {Function} [payloadMetaCreator]
 * @return {*}
 */
export function createAction(
    actionName,
    payloadMetaCreator = defaultPayloadMetaCreator
) {
    const actionCreator = (...args) => {
        const result = payloadMetaCreator(...args)
        let payload = result
        let meta
        let error

        if (Array.isArray(result)) {
            payload = result[0]
            meta = result[1]
            error = result[2]
        }

        return {
            type: actionName,
            ...(payload !== undefined && { payload }),
            ...(meta !== undefined && { meta }),
            ...(error !== undefined && { error })
        }
    }

    actionCreator.toString = () => actionName

    return actionCreator
}

/**
 *
 * @param {*} type
 * @param {*} actionsCreator
 */
const createActionWithActions = (type, actionsCreator) => {
    const fn = createAction(type)

    const funcProps = actionsCreator()

    Object.keys(funcProps).map(propKey => {
        fn[propKey] = funcProps[propKey]
        return null
    })

    return fn
}

/**
 *
 * @param {*} actions
 * @param {*} namespace
 * @param {*} options
 * @return {*}
 */
function recursiveCreateActions(namespace, actions, options, rootAction) {
    return Object.keys(actions).reduce(
        (acc, type) => {
            if (isArray(actions[type])) {
                acc[type] = recursiveCreateActions(
                    `${options.separator}${type}`,
                    actions[type][0],
                    actions[type][1] || options,
                    actions
                )
            } else if (isObject(actions[type])) {
                const formattedType = `${namespace}${options.separator}${
                    options.prefix
                }${type}${options.suffix}`
                acc[type] = createActionWithActions(formattedType, () => {
                    return recursiveCreateActions(
                        formattedType,
                        actions[type],
                        options,
                        actions
                    )
                })
            } else if (isFunction(actions[type])) {
                const formattedType = `${namespace}${options.separator}${
                    options.prefix
                }${type}${options.suffix}`
                acc[type] = createAction(formattedType, actions[type])
            }

            return acc
        },
        isFunction(rootAction) ? rootAction : {}
    )
}

const defaultOptions = {
    suffix: '',
    prefix: '',
    separator: '/'
}

/**
 * Creates a nested FSA compliant action creators with namespace, and options
 * @param {string} namespace
 * @param {Object.<string, any>} actions
 * @param {Object} [options]
 * @return {*}
 */
export function createActions(namespace, actions, options = defaultOptions) {
    const formattedNamespace = `${options.prefix}${namespace}${options.suffix}`

    const rootAction = createAction(formattedNamespace)

    if (isArray(actions)) {
        return recursiveCreateActions(
            formattedNamespace,
            actions[0],
            actions[1] || options,
            rootAction
        )
    }

    return recursiveCreateActions(
        formattedNamespace,
        actions,
        options,
        rootAction
    )
}

export default (arg1, arg2, arg3) => {
    if (
        (isString(arg1) && !arg2 && !arg3) ||
        (isString(arg1) && isFunction(arg2) && !arg3)
    ) {
        return createAction(arg1, arg2)
    }

    if (isString(arg1) && (isObject(arg2) || isArray(arg2))) {
        return createActions(arg1, arg2, arg3)
    }
}
