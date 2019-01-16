/* eslint-disable no-fallthrough */

const overridePath = (path, target, value) => {
    switch (path.length) {
        case 0:
            return value
        case 1:
            if (value === undefined) {
                const p = path.shift()
                const newState = {
                    ...target,
                    [p]: undefined
                }

                delete newState[p]
                return newState
            }
        default: {
            const p = path.shift()

            return {
                ...target,
                [p]: overridePath(path, target[p], value)
            }
        }
    }
}

export default overridePath
