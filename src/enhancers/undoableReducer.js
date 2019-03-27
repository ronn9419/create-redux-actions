/* eslint-disable default-case, camelcase, no-case-declarations, unicorn/explicit-length-check */

import mergeDeep from '../utils/mergeDeep'

export const undo = key => ({
    type: `${key}_UNDO`
})
export const redo = key => ({
    type: `${key}_REDO`
})
export const saveState = key => ({
    type: `${key}_SAVE_UNDOABLE`
})
export const clearHistory = key => ({
    type: `${key}_CLEAR_UNDOABLE`
})

const initialState = {
    past: [],
    future: []
}

const historyKey = '_history'

export const pastSelector = reducerState => reducerState[historyKey].past
export const futureSelector = reducerState => reducerState[historyKey].future
export const pastCountSelector = reducerState =>
    pastSelector(reducerState).length
export const futureCountSelector = reducerState =>
    futureSelector(reducerState).length

export default function undoableReducer(
    reducer,
    { key = null, limit = 0 } = {}
) {
    const reducerKey = key || reducer.key

    const undoType = undo(reducerKey).type
    const redoType = redo(reducerKey).type
    const saveStateType = saveState(reducerKey).type
    const clearType = clearHistory(reducerKey).type

    return (state, action) => {
        if (!state) {
            return { ...reducer(state, action), [historyKey]: initialState }
        }

        if (reducerKey) {
            switch (action.type) {
                case undoType:
                    const { [historyKey]: history_U, ...currentState_U } = state

                    if (!state[historyKey].past.length) {
                        return state
                    }

                    return mergeDeep(state, {
                        [historyKey]: {
                            past: state[historyKey].past.slice(
                                0,
                                state[historyKey].past.length - 1
                            ),
                            future: [
                                currentState_U,
                                ...state[historyKey].future
                            ]
                        },
                        ...state[historyKey].past.slice(
                            state[historyKey].past.length - 1
                        )[0]
                    })
                case redoType:
                    const { [historyKey]: history_R, ...currentState_R } = state

                    if (!state[historyKey].future.length) {
                        return state
                    }

                    return mergeDeep(state, {
                        [historyKey]: {
                            future: state[historyKey].future.slice(1),
                            past: [...state[historyKey].past, currentState_R]
                        },
                        ...state[historyKey].future[0]
                    })
                case saveStateType:
                    const { [historyKey]: history, ...currentState } = state
                    let past = [...state[historyKey].past, currentState]

                    if (limit > 0 && past.length >= limit) {
                        past = past.slice(1)
                    }

                    return mergeDeep(state, {
                        [historyKey]: {
                            past,
                            future: []
                        }
                    })
                case clearType:
                    return { ...state, [historyKey]: initialState }
            }
        }

        return reducer(state, action)
    }
}
