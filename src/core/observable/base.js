import ObservableState from './state';

/**
 * @example
 * let ready = new Observable;
 * ready.subscribe(data => console.log("Received:", data));
 *
 * ready.emit("Foo");
 * //> Received: Foo
 */
export default class Observable<T> {

  _listeners = [];

  /**
   * Register listener
   * @param {function} listener
   * @throws {Error} if `listener` is already subscribed to this observable
   */
  subscribe(listener: (v: T) => void): void {
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
  unsubscribe(listener: (v: T) => void): void {
    var idx = this._listeners.indexOf(listener);
    if (idx !== -1)
      this._listeners.splice(idx, 1);
    else
      throw new Error("unsubscribe: listener is not registered");
  }

  /**
   * Invoke each registered listener with `value`.
   *
   * **Note**: method returns immediately,
   * but listeners will be called synchronously in subscription order

   * @param {Any} value - argument will be passed to listeners
   */
  emit(value: T): void {
    setTimeout(() => {

      var len = this._listeners.length;
      for (var i = 0; i < len; i++) {
        this._listeners[i](value)
      }

    })
  }

  /**
   * @example
   * let x = new Observable;
   * x.map(v => v * 2).subscribe(v => console.log("Value:", v));
   *
   * x.emit(10);
   * //> Value: 20
   *
   * @param {function(value: Any): Any} mapper - how to transform the emitted value
   * @returns {Observable}
   */
  map(mapper: (p: T) => T): Observable<T> {
    let mapped: Observable<T> = new Observable;
    this.subscribe(p => {
      mapped.emit(mapper(p));
    });
    return mapped
  }

  /**
   * @example
   * let numbers = new Observable;
   * let even = numbers.filter(v => v % 2 === 0);
   *
   * numbers.subscribe(v => console.log("Any:", v))
   * even.subscribe(v => console.log("Even:", v));
   *
   * numbers.emit(1);
   * //> Any: 1

   * numbers.emit(2);
   * //> Any: 2
   * //> Even: 2
   *
   * @param {function(value: Any): boolean} predicate
   * @returns {Observable}
   */
  filter(predicate: (p: T) => boolean): Observable<T> {
    let filtered: Observable<T> = new Observable;
    this.subscribe(p => {
      if (predicate(p)) filtered.emit(p)
    });
    return filtered
  }

  /**
   * @example
   * let emitter = new Observable;
   * let sum = emitter.reduce(0, (a, v) => a + v);
   *
   * sum.subscribe(s => console.log(s));
   *
   * emitter.emit(10);
   * //> 10
   * emitter.emit(15);
   * //> 25
   *
   * @param {Any} accumulator - initial state
   * @param {function(accumulator: Any, value: Any): Any} reducer
   * @returns {ObservableState}
   */
  reduce<R>(accumulator: R, reducer: (a: R, p: T) => R): ObservableState<R> {
    let reduced: ObservableState<R> = new ObservableState(accumulator);
    this.subscribe(p => {
      reduced.getState(a => {
        reduced.emit(reducer(a, p))
      })
    });
    return reduced
  }

}
