import Observable from './base.js';


/**
 * @example
 * let name = new ObservableState("Foo");
 * name.subscribe(data => console.log("Received:", data));
 *
 * name.setState("Foobar");
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
   * Return current state or invoke callback with it
   *
   * @example <caption>Without arguments</caption>
   * let name = new ObservableState("Guest");
   * let val = name.getState();
   * assert(val === "Guest");
   *
   * @example <caption>With callback</caption>
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
      callback(this._state);
      return
    }
    return this._state
  }


  /**
   * Set state to new value
   * @param {Any} value - new state
   */
  setState(value) {
    this._state = value != null ? value : null;
    super.emit(value);
  }


  /**
   * @ignore
   */
  emit() {
    throw new Error("Disabled")
  }


}
