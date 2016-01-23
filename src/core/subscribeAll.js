import Observable from './Observable.js'

/**
 * @example
 * import {initialState, reducers} from './model'
 * import Actions from './actions'
 *
 * const store = createStore(reducers, initialState)
 * subscribeAll(Actions, store.dispatch)
 *
 * @param {Observable|Array<Observable>|Object<Observable>} observables
 * @param {function|Array<function>|Object<function>} listeners
 */
export default function subscribeAll(observables, listeners) {

  if (observables instanceof Observable) {
    observables = [observables]
  }

  if (typeof listeners === "function") {
    listeners = [listeners]
  }

  if (typeof observables === "object" && observables.constructor !== Array) {
    observables = Object.keys(observables).map(k => observables[k])
  }

  if (typeof listeners === "object" && listeners.constructor !== Array) {
    listeners = Object.keys(listeners).map(k => listeners[k])
  }

  for (let i=0, ii=observables.length; i < ii; i++) {
    for (let j=0, jj=listeners.length; j < jj; j++) {
      observables[i].subscribe(listeners[j])
    }
  }
}
