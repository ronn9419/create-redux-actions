/* eslint-disable array-callback-return,no-else-return */

import isFunction from '../utils/isFunction'
import objPath from '../utils/objPath'
import overridePath from '../utils/overridePath'
import { createKey } from './createCustomKey'

let lookup = []

export const key = '__path__'
export const embedFnKey = '__fn__'

const saveFn = fn => {
    lookup.push(fn)
    return lookup.length - 1
}

export const path = createKey((...paths) => {
    return [
        key,
        paths.map(p => {
            if (isFunction(p)) {
                return [embedFnKey, saveFn(p)]
            }

            return p
        })
    ]
})

export const isPath = data => data[0] === key
export const isEmbedFn = data => data[0] === embedFnKey

export const extractData = key => {
    if (key && !isPath(key)) {
        return null
    }

    return key[1]
}

export const getEmbedFn = data => {
    if (!isEmbedFn(data)) {
        return null
    }

    return lookup[data[1]]
}

const pathResolver = (data, state, action) => {
    return data.reduce((paths, p) => {
        const pathFn = getEmbedFn(p)
        let path = p
        if (pathFn !== null) {
            path = pathFn(state, action)
        }
        paths.push(path)

        return paths
    }, [])
}

export const pathHandler = (key, value) => {
    const data = extractData(key)

    const handlers = Object.keys(value).reduce((acc, cur) => {
        acc[cur] = (state, action) => {
            const path = pathResolver(data, state, action)

            const newState = value[cur](objPath(path, state), action, state)

            return overridePath(path, state, newState)
        }

        return acc
    }, {})

    return [handlers]
}

export const getLookup = () => lookup.concat()

export const clearData = () => {
    lookup = []
}
