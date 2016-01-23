

/**
 * Subscription reference, returned by {@link Observable#subscribe}.
 *
 * Use case: terminating anonymous subscriptions.
 *
 * @example
 * let emitter = new Observable;
 * let subscription = emitter.subscribe((v) => console.log("Received: v"))
 *
 * // Unsubscribing was impossible without having a reference to the listener...
 * // until now
 * if (subscription.isActive()) {
 *   subscription.terminate()
 * }
 */
export default class Subscription {

  /**
   * @param {Observable} source
   * @param {function} subscriber
   */
  constructor(source, subscriber) {
    this._source = source;
    this._subscriber = subscriber;
  }

  /**
   * Equivalent to `source.hasSubscribed(subscriber)`
   *
   * See {@link Observable#hasSubscribed}
   * @returns {boolean}
   */
  isActive() {
    return this._source.hasSubscribed(this._subscriber);
  }

  /**
   * Equivalent to `source.subscribe(subscriber)`
   *
   * See {@link Observable#subscribe}
   */
  activate() {
    this._source.subscribe(this._subscriber);
  }

  /**
   * Equivalent to `source.unsubscribe(subscriber)`
   *
   * See {@link Observable#unsubscribe}
   */
  terminate() {
    this._source.unsubscribe(this._subscriber);
  }
}
