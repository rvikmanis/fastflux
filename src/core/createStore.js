import Observable from './Observable.js'
import {isIntent} from './utils.js'

function createReducer(reducers) {
  return (state, intent) => {
    if (intent.type in reducers) {
      return reducers[intent.type](state, intent)
    }
  }
}

/**
 * {@link Store} factory
 * @function
 * @param {function|Object<function>} reducer
 * @param {*} [initialState]
 * @returns {Store}
 * @example
 * const reducers = {
 *   add(state, intent) { return state + intent.amount }
 * }
 * const app = createStore(reducers, 0)
 * assert(app.state.getState() === 0)
 *
 * app.dispatch({type: "add", amount: 1})
 * app.dispatch({type: "add", amount: 2})
 * assert(app.state.getState() === 3)
 */
export default function createStore(reducer, initialState) {
  if (reducer != null && typeof reducer === "object") {
    reducer = createReducer(reducer)
  }

  if (typeof reducer !== "function") {
    throw new Error("createStore: invalid reducer, expected function or Object")
  }

  const dispatch = Observable.method((emit, intent) => {
    if (!isIntent(intent)) throw new Error(
      "dispatch: argument is not a valid Intent"
    )
    emit(intent)
  })

  return {
    dispatch,
    state: dispatch
      .reduce(reducer, initialState)
      .materialize()
  }
}
