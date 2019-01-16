import deepClone from '../utils/deepClone'
import { getConfig } from '../config'
import merge from '../utils/merge'
import { createKey } from './createCustomKey'

export const key = '__api_request__'

let lookup = {}

const saveAction = action => {
    const actionKey = action.toString()
    lookup[actionKey] = action

    return actionKey
}

const getAction = action => {
    return lookup[action] || null
}

export const isApiRequest = data => data[0] === key

export const extractData = key => {
    if (key && !isApiRequest(key)) {
        return null
    }

    const prop = key[1]
    const actionKey = key[2]
    const initialState = key[3]

    return [prop, getAction(actionKey), initialState]
}

export const apiRequest = createKey(
    (
        stateKey,
        apiAction,
        initialState = deepClone(getConfig().initialState)
    ) => {
        return [key, stateKey, saveAction(apiAction), initialState]
    }
)

const baseCreateApiHandler = (stateKey, initialState) => (
    customHandler,
    configHandler
) => {
    return (state, action) => {
        const newState = configHandler(state[stateKey], action, initialState)
        if (!customHandler) {
            return merge(state, { [stateKey]: newState })
        }

        return merge(state, {
            [stateKey]: customHandler(state[stateKey], action, newState)
        })
    }
}

export const apiRequestHandler = (key, value) => {
    const [prop, action, initialState] = extractData(key)

    const createApiHandler = baseCreateApiHandler(prop, initialState)
    const config = getConfig()

    const handlers = {
        [action[config.requestKey]]: createApiHandler(
            value[config.requestKey],
            config.onRequest
        ),
        [action[config.successKey]]: createApiHandler(
            value[config.successKey],
            config.onSuccess
        ),
        [action[config.errorKey]]: createApiHandler(
            value[config.errorKey],
            config.onError
        ),
        [action[config.cancelKey]]: createApiHandler(
            value[config.cancelKey],
            config.onCancel
        ),
        [action[config.abortKey]]: createApiHandler(
            value[config.abortKey],
            config.onAbort
        )
    }

    return [
        handlers,
        {
            [prop]: initialState
        }
    ]
}

export const clearLookup = () => {
    lookup = {}
}
