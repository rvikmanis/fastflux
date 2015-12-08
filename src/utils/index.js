import assign from 'object-assign';
export {assign};

/**
 * Shorthand for `assign({}, object)`
 * @param {Object} object
 * @returns {Object} cloned `object`
 * @ignore
 */
export function clone(object) {
  return assign({}, object);
}

/**
 * True if `value.subscribe` and `value.unsubscribe` are methods
 * @function
 * @param {Any} value
 * @returns {boolean}
 */
export function isObservable(value) {
  return value != null &&
   typeof value.subscribe === 'function' &&
   typeof value.unsubscribe === 'function'
}

/**
 * True if {@link isObservable}(`value`) and `value.getState` is a method
 * @function
 * @param {Any} value
 * @returns {boolean}
 */
export function isObservableState(value) {
  return isObservable(value) &&
   typeof value.getState === 'function'
}
