/**
 * @example
 * let ready = new Observable;
 * ready.subscribe(data => console.log("Received:", data));
 *
 * ready.emit("Foo");
 * //> Received: Foo
 */
export default class Observable {


  _listeners = [];


  /**
   * Register listener
   * @param {function} listener
   * @throws {Error} if `listener` is already subscribed to this observable
   */
  subscribe(listener) {
    if (this._listeners.indexOf(listener) === -1)
      this._listeners.push(listener);
    else
      throw new Error("subscribe: cannot register twice");
  }


  /**
   * Unregister listener
   * @param {function} listener
   * @throws {Error} if `listener` is not registered
   */
  unsubscribe(listener) {
    var idx = this._listeners.indexOf(listener);
    if (idx !== -1)
      this._listeners.splice(idx, 1);
    else
      throw new Error("unsubscribe: listener is not registered");
  }


  /**
   * Invoke each registered listener with `value`
   * @param {Any} value - this argument will be passed to listeners
   */
  emit(value) {
    for (let i = 0; i < this._listeners.length; i++) {
      this._listeners[i](value);
    }
  }


}
