import { getConfig } from './config'
import merge from './utils/merge'
import mergeDeep from './utils/mergeDeep'
import handleActions from './handleActions'

const baseCreateApiHandler = (customHandler, configHandler, initialState) => (
    state,
    action
) => {
    const newState = configHandler(state, action, initialState)

    if (!customHandler) {
        return merge(state, newState)
    }

    return merge(state, customHandler(state, action, newState))
}

export default (action, handlers, initialState = {}) => {
    const config = getConfig()
    const apiInitialState = {
        error:
            initialState.error === undefined
                ? config.initialState.error
                : initialState.error,
        data:
            initialState.data === undefined
                ? config.initialState.data
                : initialState.data,
        pending:
            initialState.pending === undefined
                ? config.initialState.pending
                : initialState.pending
    }

    handlers[action[config.requestKey]] = baseCreateApiHandler(
        handlers[config.requestKey],
        config.onRequest,
        apiInitialState
    )
    handlers[action[config.successKey]] = baseCreateApiHandler(
        handlers[config.successKey],
        config.onSuccess,
        apiInitialState
    )
    handlers[action[config.errorKey]] = baseCreateApiHandler(
        handlers[config.errorKey],
        config.onError,
        apiInitialState
    )
    handlers[action[config.cancelKey]] = baseCreateApiHandler(
        handlers[config.cancelKey],
        config.onCancel,
        apiInitialState
    )
    handlers[action[config.abortKey]] = baseCreateApiHandler(
        handlers[config.abortKey],
        config.onAbort,
        apiInitialState
    )

    delete handlers[config.requestKey]
    delete handlers[config.successKey]
    delete handlers[config.errorKey]
    delete handlers[config.cancelKey]
    delete handlers[config.abortKey]

    return handleActions(handlers, mergeDeep(config.initialState, initialState))
}
