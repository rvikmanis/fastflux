import ObservableState from './observable/state.js';


/**
 * *This class is abstract*
 *
 *
 * ## Creating a store
 * A store:
 *  1. Must implement instance method `getInitialState` of type:
 *
 *         () -> Any
 *
 *  2. Must define either one of
 *     * static method `reducer` of type:
 *
 *           <S>(state: S, message: Message) -> S
 *
 *     * static property `reducers` of type:
 *
 *           {[string]: <S>(state: S, message: Message) -> S}
 *
 *
 * <br />
 * #### Reducer function variant:
 *
 *     let logger = new class extends Store {
 *       getInitialState() { return [] }
 *       static reducer(state, {type, value}) {
 *
 *         if (type === "add")
 *           return state.concat([value]);
 *
 *       }
 *     }
 *
 *
 * #### Reducers object variant:
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
 * <br/>
 * > **Note:** you can also create a store  with {@link createStore}.
 * <br />
 *
 * -----------
 * @example <caption>Multiple reducers</caption>
 * let counter = new class extends Store {
 *   getInitialState() { return 0 }
 *   static reducers = {
 *     inc(state) { return ++state; },
 *     dec(state) { return --state; }
 *   }
 * }
 *
 * function increment() {
 *   counter.send({type: "inc"})
 * }
 *
 * function decrement() {
 *   counter.send({type: "dec"})
 * }
 *
 * counter.subscribe(n => console.log("Counter value:", n));
 *
 * increment(); //> Counter value: 1
 * increment(); //> Counter value: 2
 * increment(); //> Counter value: 3
 *
 * decrement(); //> Counter value: 2
 */
export class Store extends ObservableState {


  /**
   * @throws {Error} when instantiating the abstract {@link Store} directly
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
   * @ignore
   */
  setState() {
    throw new Error("Disabled")
  }


  /**
   * Send a message. Bound method
   * @method
   * @param {Message} message
   * @param {Any} [context]
   */
  send(message, context) {
    let reducer;

    if (typeof this._reducers === "object") {
      if (!this._reducers.hasOwnProperty(message.type))
        return;
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
    ) return;

    if (newState !== void 0) {
      super.setState(newState);
    }
  }


}


/**
 * {@link Store} factory function
 * @example
 * let counter = createStore({
 *   getInitialState() { return 0 },
 *   reducers: {
 *     inc(state) { return ++state },
 *     dec(state) { return --state }
 *   }
 * })
 * @function
 * @param {Object} config
 * @returns {Store}
 */
export function createStore({getInitialState, reducer, reducers} = {}) {

  // single reducer function or object mapping message types to reducers
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
