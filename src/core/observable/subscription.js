import Observable from './base.js';

/**
 * @example
 * let emitter = new Observable;
 * let log = (v) => console.log("Received:", v);
 *
 * let subscription = new Subscription(emitter, log);
 * assert(!subscription.isActive());
 *
 * subscription.activate();
 * assert(subscription.isActive());
 *
 * subscription.terminate();
 * assert(!subscription.isActive());
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
