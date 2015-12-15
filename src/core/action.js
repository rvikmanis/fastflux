import Observable from './observable/base.js';


/**
 * Creates an observable function that
 * asynchronously invokes the nested inner function.
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
  let observable = new Observable;

  let runner = getRunner(payload => observable.emit(payload));
  let action = (...args) => {
    setTimeout(() => runner(...args))
  };

  Object.defineProperties(action, {
    subscribe: {value: callback => observable.subscribe(callback)},
    unsubscribe: {value: callback => observable.unsubscribe(callback)},
    map: {value: mapper => observable.map(mapper)},
    filter: {value: predicate => observable.filter(predicate)},
    reduce: {value: (accumulator, reducer) => observable.reduce(accumulator, reducer)}
  });

  return action
}
