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

# Customizing Action

-   By default, the 1st argument will be the payload, and the 2nd argument will be the meta.
-   You can customize this by assigning a function instead of an empty object

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

### Todos

-   Write MORE Tests
-   Write docs
-   Support nested handleActions
-   WithCondition handler
-   Actions custom display name

## License

MIT
