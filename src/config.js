import mergeDeep from './utils/mergeDeep'

const initialConfig = {
    initialState: {
        pending: false,
        error: false,
        data: []
    },
    requestKey: 'request',
    errorKey: 'error',
    successKey: 'success',
    cancelKey: 'cancel',
    abortKey: 'abort',
    onSuccess: (state, action, initialState) => ({
        ...state,
        ...initialState,
        data: action.payload
    }),
    onError: (state, action, initialState) => ({
        ...state,
        ...initialState,
        error: action.payload
    }),
    onRequest: (state, action, initialState) => ({
        ...state,
        ...initialState,
        pending: true
    }),
    onCancel: (state, action, initialState) => ({ ...state, ...initialState }),
    onAbort: (state, action, initialState) => ({ ...state, ...initialState })
}

let config = initialConfig

export const setConfig = newConfig => {
    config = mergeDeep(config, newConfig)
}

export const getConfig = () => config
export const resetConfig = () => setConfig(initialConfig)
