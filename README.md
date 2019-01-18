# create-redux-actions

Easily create FSA compliant actions and provides an easier way of handling them in your reducers. Inspired by [redux-actions](https://github.com/redux-utilities/redux-actions).

# Creating Actions

You can easily create actions by using `createActions`.

### Example:

```
    import { createActions } from "create-redux-actions"

    // create action
    const action = createActions("your-namespace", {
        action1: (arg1, arg2) => [
            arg1, // this will be the payload,
            arg2, // this will be the meta
        ],
        action2: {} // default, payload and meta will be same as action1
    })

    export default action
```

-   The code above will generate 2 action, `action.action1` and `action.action2`
-   Both will share the same namespace in their type but to make them different, their key will be attached at the end separated by `/`.

```
   action.action1("sample-payload", "sample-meta")
   /*   action1 returns:
    *   {
    *        type: "your-namespace/action1"
    *        payload: "sample-payload,
    *        meta: "sample-meta""
    *   }
    */

    action.action2("sample-payload", "sample-meta")
   /*   action2 returns:
    *   {
    *        type: "your-namespace/action2"
    *        payload: "sample-payload,
    *        meta: "sample-meta""
    *   }
    */
```

# Handling Actions

You can easily handle created actions by using `handleActions`.

### Example:

```
    import { handleActions } from "create-redux-actions"
    import action from "./action"

    const initialState = { data: null }

    const reducer = handleActions({
        [action.action1]: (state, action) => ({ data: action.payload })
    }, initialState)

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
