import {assign} from './utils.js'
import {compose, dropVoid, map, filter, reduce, delay} from './transformers.js'
import Subscription from './Subscription.js'

export default class Observable {

  /**
   * @access private
   */
  constructor(options) {
    options = options == null ? {} : options
    if (options.source instanceof Observable) {
      initSourced(this, options)
    }
    else {
      initOriginal(this, options)
    }
  }

  /**
   * @returns {boolean}
   */
  isStateful() {
    if (this.hasSource() && !this.isMaterialized()) {
      return this._transform.source.isStateful() || (
        typeof this._transform.defaultState !== "undefined" ||
        !!this._transform.stateful
      )
    }
    return this._isStateful
  }

  /**
   * @returns {boolean}
   */
  hasSource() {
    return this._transform != null
  }

  /**
   * @returns {boolean}
   */
  isMaterialized() {
    return this._materializedTransformation != null
  }

  /**
   * Materialize trans-observable into a source observable
   * @throws {Error} if observable is already materialized or is not a trans-observable
   * @return {Observable}
   */
  materialize() {
    if (this.hasSource() && !this.isMaterialized()) {
      let m = transformObservable(this)
      ensureMaterialized(m)
      return m
    }
    throw new Error("materialize: Observable is materialized")
  }

  /**
   * Return the state, if observable is stateful
   * @returns {*|undefined}
   */
  getState() {
    ensureMaterialized(this)
    return this._state
  }

  /**
   * @param {function} listener
   * @throws {Error} if `listener` is already subscribed to this observable
   * @returns {Subscription}
   */
  subscribe(listener) {
    ensureMaterialized(this)

    if (this._listeners.indexOf(listener) === -1) {
      this._listeners.push(listener)

      let state = this.getState()
      let mustNotify = (
        this.isStateful() &&
        state !== void 0 &&
        this._currentStateNotificationLog.indexOf(listener) === -1
      )
      if (mustNotify) {
        listener(state)
        this._currentStateNotificationLog.push(listener)
      }

      return new Subscription(this, listener);
    }
    else throw new Error("subscribe: cannot register listener twice");
  }

  /**
   * @param {function} listener
   * @throws {Error} if `listener` has not previously subscribed
   */
  unsubscribe(listener) {
    const E = "unsubscribe: listener is not registered"

    if (this.hasSource() && !this.isMaterialized()) {
      throw new Error(E)
    }

    let idx = this._listeners.indexOf(listener)

    if (idx !== -1) {
      this._listeners.splice(idx, 1)
    }

    else throw new Error(E)
  }

  /**
   * @param {function} listener
   * @returns {boolean}
   */
  hasSubscribed(listener) {
    return this._listeners != null &&
      this._listeners.indexOf(listener) !== -1
  }

  /**
   * Invoke each registered listener with `value`
   * @param {*} value
   * @throws {Error} if observable is not a source
   */
  emit(value) {
    if (this.hasSource()) {
      throw new Error("emit: can only emit from source Observable")
    }
    if (typeof value !== "undefined") {
      emitData(this, value)
    }
  }

  /**
   * @access private
   */
  transform(...args) {
    return transformObservable(this, ...args)
  }

  /**
   * @param {function(value: *): *} mapper
   * @returns {Observable}
   */
  map(mapper) {
    return this.transform(map(mapper))
  }

  /**
   * @param {function(value: *): boolean} predicate
   * @returns {Observable}
   */
  filter(predicate) {
    return this.transform(filter(predicate))
  }

  /**
   * @param {function(accumulator: *, value: *): *} reducer
   * @param {*} [accumulator] - aka. the seed
   * @returns {Observable}
   */
  reduce(reducer, accumulator) {
    return this.transform(reduce(reducer, accumulator), {
      stateful: true,
      defaultState: accumulator
    })
  }

  /**
   * @param {number} [microsecs]
   * @returns {Observable}
   */
  delay(microsecs) {
    return this.transform(delay(microsecs))
  }

  /**
   * Return stateful observable, with optional `defaultState` as initial value
   * @param {*} [defaultState]
   * @returns {Observable}
   */
  toStateful(defaultState) {
    return this.transform(null, {stateful: true, defaultState})
  }

  /**
   * Return new stateful source observable, with optional `initialState` as initial value
   * @param {*} [initialState]
   * @returns {Observable}
   */
  static state(initialState) {
    return new this({state: initialState, stateful: true})
  }

  /**
   * Return observable-function, which emits with the first argument upon invocation
   * @param {function(next: function, value: *)} [transformer]
   * @returns {function}
   */
  static method(transformer) {
    const emitter = new this
    function observableMethod(value) {
      emitter.emit(value)
    }
    assign(observableMethod, Observable.prototype)
    initSourced(observableMethod, {
      source: emitter,
      transformation: transformer != null ?
        normalizeTransformer(transformer) : identityMapper
    })
    return observableMethod
  }
}

const NORMAL_TRANSFORMER = '@@fastflux/observable/normalTransformer'

function normalizeTransformer(fn) {
  if (fn[NORMAL_TRANSFORMER] === true) return fn

  return assign(
    compose(dropVoid, fn),
    {[NORMAL_TRANSFORMER]: true}
  )
}

const identityMapper = normalizeTransformer(map(x => x))

function ensureMaterialized(s) {
  if (s.hasSource() && !s.isMaterialized()) {
    let mt = compose(s._transform.transformation, dropVoid)
    let source = s._transform.source

    s._listeners = []
    s._currentStateNotificationLog = []
    s._isStateful = s.isStateful()
    s._state = s._transform.defaultState

    s._materializedTransformation = mt

    source.subscribe(data =>
      mt(emitData.transformer(s), data)
    )
  }
}

function emitData(s, data) {
  if (s._isStateful) {
    s._state = data
    s._currentStateNotificationLog = []
  }
  for (let i=0, ii=s._listeners.length; i < ii; i++) {
    s._listeners[i](data)
  }
}
emitData.transformer = (s) => (_, value) => emitData(s, value)

function transformObservable(s, tt, extra) {
  let opts = {}
  tt = (tt == null) ? identityMapper : normalizeTransformer(tt)
  if (s.hasSource() && !s.isMaterialized()) {
    opts = assign(opts, s._transform, {
      transformation: compose(s._transform.transformation, tt)
    })
  }
  else {
    opts.source = s
    opts.transformation = tt
  }
  return new Observable(assign(opts, extra))
}

function initSourced(s, options) {
  s._transform = options
  if (options.transformation == null) {
    s._transform.transformation = identityMapper
  }
}

function initOriginal(s, options) {
  s._state = options.state
  s._isStateful = typeof options.state !== "undefined" || !!options.stateful
  s._listeners = []
  s._currentStateNotificationLog = []
}
