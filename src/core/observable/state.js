import Observable from './base.js';


/**
 * @example
 * let name = new ObservableState("Foo");
 *
 * name.getData(initial => console.log("Initial:", initial));
 * //> Initial: Foo
 *
 * name.subscribe(data => {
 *   console.log("Received:", data);
 *   name.getState(currentState => assert(data === currentState))
 * });
 *
 * name.emit("Foobar");
 * //> Received: Foobar
 *
 */
export default class ObservableState extends Observable {


  /**
   * @param {Any} initialState
   */
  constructor(initialState) {
    super();
    this._state = (initialState != null ? initialState : null)
  }


  /**
   * Return current state or asynchronously invoke callback
   *
   * @example <caption>Without arguments - synchronous</caption>
   * let name = new ObservableState("Guest");
   * let val = name.getState();
   * assert(val === "Guest");
   *
   * @example <caption>With callback - asynchronous</caption>
   * let name = new ObservableState("Guest");
   * let returnVal = name.getState(val => {
   *   assert(val === "Guest")
   * });
   * assert(returnVal === undefined);
   *
   * @param {function} [callback]
   * @returns {Any|undefined}
   */
  getState(callback) {
    let state = this._state
    if (typeof callback === "function") {
      setTimeout(() => callback(state));
      return
    }
    return state
  }


  /**
   * Same as {@link Observable#emit}, but sets
   * current state to `value` before emitting
   *
   * @param {Any} value - new state
   */
  emit(value) {
    this._state = value != null ? value : null;
    super.emit(this._state);
  }


  /**
   * Same as {@link Observable#map}, but returns {@link ObservableState}
   *
   * @param {function(value: Any): Any} mapper - how to transform the emitted value
   * @returns {ObservableState}
   */
  map(mapper) {
    return super.reduce(mapper(this.getState()), (_, s) => mapper(s))
  }


  /**
   * Same as {@link Observable#filter}, but returns {@link ObservableState}
   *
   * @param {function(value: Any): boolean} predicate
   * @returns {ObservableState}
   */
  filter(predicate) {
    let state = this.getState()
    if (!predicate(state)) { state = null }
    return super.filter(predicate).reduce(state, (_, s) => s)
  }


  /**
   * Same as {@link Observable#reduce}, but starts with current state reduced
   *
   * @param {Any} accumulator - initial state
   * @param {function(accumulator: Any, value: Any): Any} reducer
   * @returns {ObservableState}
   */
  reduce(accumulator, reducer) {
    return super.reduce(reducer(accumulator, this.getState()), reducer);
  }


}
