# create-redux-actions

Easily create FSA compliant actions and provides an easier way of handling them in your reducers. Inspired by [redux-actions](https://github.com/redux-utilities/redux-actions).

# Creating Actions

You can easily create actions by using `createActions`.

### Example:

```js
import { createActions } from 'create-redux-actions'

// create action
const action = createActions('your-namespace', {
    action1: {},
    action2: {
        nestedAction: {}
    }
})

export default action
```

-   The code above will create 3 actions, `action.action1`, `action.action2`, and `action.action2.nestedAction`
-   All will share the same namespace in their type, to make them different, their key will be attached at the end separated by `/`. This is useful if you want to group actions.

```js
action.action1('sample-payload', 'sample-meta')
/*   {
 *        type: "your-namespace/action1"
 *        payload: "sample-payload,
 *        meta: "sample-meta""
 *   }
 */

action.action2('sample-payload', 'sample-meta')
/*   {
 *        type: "your-namespace/action2"
 *        payload: "sample-payload,
 *        meta: "sample-meta""
 *   }
 */

action.action2.nestedAction('sample-payload', 'sample-meta')
/*   {
 *        type: "your-namespace/action2/nestedAction"
 *        payload: "sample-payload,
 *        meta: "sample-meta""
 *   }
 */
```
- Note that `action.action2` is also an action. This allows for flexibility,  easier code refactoring.

## Creating Single Action

You can also create a single action.

```js
const singleAction = createActions('my-action', (arg1, arg2) => [
    { arg1, arg2 },
    arg2
])

singleAction('data1', 'data2')
/*  {
 *      type: 'my-action',
 *      payload: {
 *          arg1: 'data1',
 *          arg2: 'data2'
 *      },
 *      meta: 'data2'
 *  }
 */
```

# Customizing Action

By default, the 1st argument will be the payload, and the 2nd argument will be the meta.
You can customize this by assigning a function instead of an empty object.

```js
const action = createActions('AUTHORIZATION', {
    login: (username, password) => [            // create a function that will return an array
        {username, password} // 1st element     // <Any> payload
        // 2nd element                          // <Any> meta
        // 3rd element                          // <Boolean> error
    ]
})

action.login('user', '123456')
/*  {
 *      type: "AUTHORIZATION/login",
 *      payload: {
 *          username: 'user',
 *          password: '123456'
 *      }
 *  }
 * /
```

# Customizing Action with Nested Action
You can also customize action with nested action by assigning an array to the action instead of an object.
```js
const action = createActions('myNamespace', {
    action1: [
        (arg1, arg2) => [{arg1, arg2}, arg2, false], // payload creator
        {
            action2: {},                             // nested actions
            action3: {}
        }
    ]
})

action.action1('foo', 'bar')
/* {
 *      type: 'myNamespace',
 *      payload: {
 *          arg1: 'foo',
 *          arg2: 'bar'
 *      },
 *      meta: 'bar',
 *      error: false
 * }
 */
```

# Handling Actions

You can easily handle created actions by using `handleActions`.

### Example:

```js
import { handleActions } from 'create-redux-actions'
import action from './action'

const initialState = { data: null }

const reducer = handleActions(
    {
        [action.action1]: (state, action) => ({ data: action.payload })
    },
    initialState
)
```

-   This will create a reducer that handles your action

# Installation

```
npm i create-redux-actions
```

# Advanced Usage

## Customizing action type

You can make your actions more readable by customizing the action type.

```js
import { createActions } from 'create-redux-actions'

const action = createActions(
    'auth',
    {
        login: {
            success: {},
            error: {},
            _options: {
                prefix: '[',
                suffix: ']'
            }
        },
        _options: {
            separator: ' = '
        }
    },
    { separator: ' | ', transform: key => key.toUpperCase() }
)
// you can also pass options as third argument

/*  defaultOptions = {
 *      suffix: '',             // <String> added at the end of the key
 *      prefix: '',             // <String> added at the beginning of the key
 *      separator: '/',         // <String> added after the suffix
 *      transform: key => key   // (key) => <String> transform current key
 *  }
 */

action.login.success()
/*  {
 *      type: 'AUTH | LOGIN = [SUCCESS]'
 *  }
 */

action.login.error()
/*  {
 *      type: 'AUTH | LOGIN = [ERROR]'
 *  }
 */
```

-   You can pass options at any level of action hierarchy under `_options` property
-   You can also pass options as third argument of createActions
-   Options will take effect at the current level where you declare it and all under it.
-   Options will merge to other options as it traverse your action hierarchy. Deeper option will be prioritized.

## Handle Action Helpers

### Combine Actions

Combines 2 or more actions for a single reducer using `combineActions`

```js
    import { createActions, handleActions, combineActions } from 'create-redux-actions'

    const { action1, action2, action3 } = createActions("namespace", {
        action1: {},
        action2: {},
        action3: {}
    })

    const reducer = handleActions({
        [combineActions(action1, action2, action3)]: (state, action) => ({
            data: action.payload
        )}
    }, { data: null})

```

### Dynamic State

Dynamically select a state for the reducer using `path`.

```js
import { createActions, handleActions, path } from 'create-redux-actions'

const action = createActions('my-namespace', {
    action1: {},
    action2: {}
})

const initialState = {
    items: {
        id1: {
            message: 'hello'
        },
        id2: {
            message: 'hi'
        }
    }
}

const reducer = handleActions(
    {
        [path('items')]: {
            [action1]: (state, action) => ({
                // state will be whatever in the path specified
                ...state,
                id3: {
                    message: 'hello world'
                }
            }) // it only update the items state
        },
        [path('items', (state, action) => action.payload.id)]: {
            // specify path dynamically
            [action2]: (state, action) => ({
                ...state,
                message: action.payload.message
            }) // it will only update the item specified by the action payload
        }
    },
    initialState
)
```

### Todos

-   Write MORE Tests
-   Write docs
-   Support nested handleActions
-   WithCondition handler
-   Actions custom display name

## License

MIT
