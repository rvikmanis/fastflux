import ObservableState from './observable/state.js';


/**
 * Container for application state and logic.
 *
 * *This class is abstract and cannot be instantiated.*
 *
 * ## Implementing `Store`
 * A store:
 *  1. Must have instance method `getInitialState` with signature:
 *
 *         function(): Any<S>
 *
 *  2. Must have either one of:
 *     * static method `reducer` with signature:
 *
 *           function(state: Any<S>, message: Message): Any<S>
 *
 *     * static property `reducers` with signature:
 *
 *           {[string]: function(state: Any<S>, message: Message): Any<S>}
 *
 *
 * #### Single reducer variant:
 *
 *     let logger = new class extends Store {
 *       getInitialState() { return [] }
 *       static reducer(state, {type, value}) {
 *
 *         if (type === "add") {}
 *           return state.concat([value]);
 *         }
 *
 *       }
 *     }
 *
 *
 * #### Object mapping {@link Message}#type to reducers:
 *
 *     let logger = new class extends Store {
 *       getInitialState() { return [] }
 *       static reducers = {
 *
 *          add(state, {value}) {
 *            return state.concat([value])
 *          }
 *
 *       }
 *     }
 *
 * > **Note:** you can also create a store  with {@link createStore}.
 *
 * -----------
 * @example
 * let counter = new class extends Store {
 *   getInitialState() { return 0 }
 *   static reducers = {
 *     inc(state, {amount}) { return state + amount; },
 *     dec(state, {amount}) { return state - amount; }
 *   }
 * }
 *
 * function increment(amount=1) {
 *   counter.send({type: "inc", amount})
 * }
 *
 * function decrement(amount=1) {
 *   counter.send({type: "dec", amount})
 * }
 *
 * counter.subscribe(n => console.log("Counter value:", n));
 *
 * increment(); //> Counter value: 1
 * increment(); //> Counter value: 2
 * increment(2); //> Counter value: 4
 *
 * decrement(12); //> Counter value: -8
 */
export class Store extends ObservableState {


  /**
   * @throws {Error} when trying to instantiate the abstract {@link Store} directly
   * @throws {Error} when no reducers are defined
   * @throws {Error} when `getInitialState` is not implemented
   */
  constructor() {
    super();

    if (this.constructor === Store)
      throw new Error("Store is abstract: extend or call createStore");

    let reducers = this.constructor.reducers || this.constructor.reducer;
    let initialState = this.getInitialState();

    if (typeof reducers !== "object" && typeof reducers !== "function")
      throw new Error("Expecting " +
          "reducer function or object mapping message types -> reducer functions " +
          "in static property reducers");

    this._reducers = reducers;
    this._state = initialState;

    this._isProcessing = false;

    const send = this.send;
    this.send = (message, context) => send.call(this, message, context)
  }


  /**
   * @abstract
   * @returns {Any}
   */
  getInitialState() {
    throw new Error("Not implemented");
  }


  /**
   * Send a message. Bound method
   * @method
   * @param {Message} message
   * @param {Any} [context]
   */
  send(message, context) {
    while (true) {
      if (!this._isProcessing) break
    }
    this._process(message, context)
  }

  _process(message, context) {
    this._isProcessing = true;

    let reducer;
    if (typeof this._reducers === "object") {
      if (!this._reducers.hasOwnProperty(message.type)) {
        this._isProcessing = false;
        return
      }
      reducer = this._reducers[message.type];
    }
    else reducer = this._reducers;

    let oldState = this.getState();
    let newState = reducer(
      oldState,
      message,
      context != null ? context : null
    );

    if (newState != null &&
        typeof newState.equals === "function" &&
        newState.equals(oldState)
    ) {
      this._isProcessing = false;
      return
    }


    if (newState !== void 0) {
      super.emit(newState);
    }

    this._isProcessing = false
  }

  /**
   * @ignore
   */
  emit() {
    throw new Error("Disabled");
  }


}


/**
 * Dynamically extends {@link Store} and instantiates the new class.
 *
 * `options.getInitialState` and either `options.reducer` or `options.reducers` are required.<br />
 * When both are defined, `options.reducers` takes precedence.<br />
 * Type requirements are interchangable, meaning either can
 * take {@link Object} or {@link function}.
 * @example
 * let counter = createStore({
 *   getInitialState() { return 0 },
 *   reducers: {
 *     inc(state) { return ++state },
 *     dec(state) { return --state }
 *   }
 * })
 * @param {Object} options
 * @param {function(): Any<S>} options.getInitialState
 * @param {function(state: Any<S>, message: Message): Any<S>} options.reducer
 * @param {Object} options.reducers - maps {@link Message}#type to reducers
 * @returns {Store}
 */
export function createStore({getInitialState, reducer, reducers} = {}) {

  if (reducers == null) {
    reducers = reducer
  }

  let _s = class extends Store {}

  if (getInitialState != null)
    _s.prototype.getInitialState = getInitialState;

  if (reducers != null)
    _s.reducers = reducers;

  return new _s;

}
