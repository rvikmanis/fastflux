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
    if (typeof callback === "function") {
      setTimeout(() => callback(this._state));
      return
    }
    return this._state
  }


  /**
   * Same as {@link Observable#emit}. Additionally sets
   * current state to `value`
   *
   * @param {Any} value - new state
   */
  emit(value) {
    this._state = value != null ? value : null;
    super.emit(this._state);
  }


}
