import Observable from './observable/base.js';
import {assign} from '../utils/index.js';


/**
 * Creates an observable function that
 * invokes the nested inner function.
 *
 * The inner function may call `emit`.
 *
 * @example
 * let mul = createAction(emit => function (x, y) {
 *   emit(x * y)
 * });
 * mul.subscribe(result => console.log("Result:", result));
 *
 * //> Result: 25
 * mul(5, 5);
 * @param {function(emit: function): function} getRunner
 * @returns {function}
 */
export function createAction(getRunner) {
  let runner = getRunner(payload => action.emit(payload))
  let action = (...args) => {
    runner(...args)
  }

  action = assign(action, Observable.prototype)
  action._listeners = []

  return action
}
