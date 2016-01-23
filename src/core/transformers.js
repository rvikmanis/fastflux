import {assign} from './utils.js'

function createChildContexts(fns) {
  return fns.map(() => ({}))
}

/**
 * @ignore
 */
export function compose(...fns) {
  let defaultContext = {}
  return (next, value, context) => {

    if (fns.length === 0) {return}

    if (context == null) {
      context = defaultContext
    }

    if (context.childContexts == null) {
      context.childContexts = createChildContexts(fns)
    }

    function reducer(next, fn, i) {
      let ctx = context.childContexts[i]
      return (value) => fn(next, value, ctx)
    }

    fns.reduceRight(
      reducer,
      (value) => next(value)
    ).call(null, value)

  }
}

/**
 * @ignore
 */
export function dropVoid(next, value) {
  if (void 0 !== value) next(value)
}

/**
 * @ignore
 */
export function map(mapper) {
  return (next, value) => {
    next(mapper(value))
  }
}

/**
 * @ignore
 */
export function filter(predicate) {
  return (next, value) => {
    if (predicate(value)) next(value)
  }
}

/**
 * @ignore
 */
export function reduce(reducer, accumulator) {
  return (next, value, context) => {
    if (context.accumulator === void 0) {context.accumulator = accumulator}
    next(context.accumulator = reducer(context.accumulator, value))
  }
}

/**
 * @ignore
 */
export function delay(microsecs) {
  return (next, value) => {
    setTimeout(() => next(value), microsecs)
  }
}
