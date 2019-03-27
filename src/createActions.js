/* eslint-disable valid-jsdoc */

import isObject from './utils/isObject'
import isArray from './utils/isArray'
import isString from './utils/isString'
import isFunction from './utils/isFunction'
import merge from './utils/merge'

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
const createActionWithActions = (
    type,
    actionsCreator,
    payloadMetaCreator = defaultPayloadMetaCreator
) => {
    const fn = createAction(type, payloadMetaCreator)

    const funcProps = actionsCreator()

    Object.keys(funcProps).map(propKey => {
        fn[propKey] = funcProps[propKey]
        return null
    })

    return fn
}

/**
 *
 * @param {*} namespace
 * @param {*} actions
 * @param {*} options
 * @param {*} rootAction
 * @return {*}
 */
function recursiveCreateActions(namespace, actions, options, rootAction) {
    return Object.keys(actions).reduce(
        (acc, type) => {
            if (type === '_options') {
                return acc
            }

            const _type = options.transform(type)

            const formattedType = `${namespace}${options.prefix}${_type}${
                options.suffix
            }`

            if (isArray(actions[type])) {
                acc[type] = createActionWithActions(
                    formattedType,
                    () => {
                        return recursiveCreateActions(
                            `${formattedType}${options.separator}`,
                            actions[type][1],
                            merge(
                                options,
                                actions._options || {},
                                actions[type][1]._options || {}
                            ),
                            actions
                        )
                    },
                    actions[type][0]
                )
            } else if (isObject(actions[type])) {
                acc[type] = createActionWithActions(formattedType, () => {
                    return recursiveCreateActions(
                        `${formattedType}${options.separator}`,
                        actions[type],
                        merge(
                            options,
                            actions._options || {},
                            actions[type]._options || {}
                        ),
                        actions
                    )
                })
            } else if (isFunction(actions[type])) {
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
    separator: '/',
    transform: key => key
}

/**
 * Creates a nested FSA compliant action creators with namespace, and options
 * @param {string} namespace
 * @param {Object.<string, any>} actions
 * @param {Object} [options]
 * @return {*}
 */
export function createActions(namespace, actions, options = defaultOptions) {
    const formattedNamespace = `${options.prefix}${options.transform(
        namespace
    )}${options.suffix}`

    const rootAction = createAction(formattedNamespace)

    return recursiveCreateActions(
        `${formattedNamespace}${options.separator}`,
        actions,
        merge(options, actions._options || {}),
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
        return createActions(arg1, arg2, merge(defaultOptions, arg3 || {}))
    }
}
