import { createStore, combineReducers } from 'redux'
import createActions from '../createActions'
import handleActions from '../handleActions'

describe('handleActions module', () => {
    it('handle actions', () => {
        const action = createActions('test-namespace', {
            test: {}
        })

        const reducer = handleActions(
            {
                [action.test]: (state, { payload }) => ({ data: payload })
            },
            { data: null }
        )

        const rootReducer = combineReducers({
            test: reducer
        })

        const store = createStore(rootReducer)

        store.dispatch(action.test('abc'))

        expect(store.getState()).toEqual({
            test: {
                data: 'abc'
            }
        })
    })
})
