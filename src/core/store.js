/**
 * @module fastflux/core/store
 */

var {Observable} = require('./observable');
var {clone} = require('../utils');

/**
 * @callback reducer
 * @param state: any - Current state of the store.
 * @param message: object - An object describing what the reducer should do.
 * @return any - New state of the store.
 */

/**
 * @param initialState: any
 * @param reducers: reducer|object<reducer>
 * @class
 */
var Store = module.exports.Store = function Store(initialState, reducers) {
  if (initialState === undefined)
    throw new Error("Store.prototype.constructor: expects " +
        "initial state as first parameter");

  if (typeof reducers !== "object" && typeof reducers !== "function")
    throw new Error("Store.prototype.constructor: expects " +
        "a reducer function or object mapping message types -> reducer functions " +
        "as second parameter");

  if (typeof reducers === "object") {
    reducers = Object.freeze(clone(reducers));
  }

  Observable.call(this);

  Object.defineProperties(this, {
    _state: {value: initialState, writable: true},
    _reducers: {value: reducers}
  })
};

Store.prototype = Object.create(Observable.prototype);
Store.prototype.constructor = Store;


Store.prototype.emit = null;


Store.prototype.send = function send(message, context) {
  var reducer;

  if (typeof this._reducers === "object") {
    if (!this._reducers.hasOwnProperty(message.type))
      return;
    reducer = this._reducers[message.type];
  }
  else reducer = this._reducers;

  var newState = reducer.call(context||{}, this._state, message);

  if (newState != null &&
      typeof newState.equals === "function" &&
      newState.equals(this._state)
  ) return;

  this._state = newState;
  Observable.prototype.emit.call(this, this._state);
};

/**
 *
 * @method Store#getState
 * @return any
 */
Store.prototype.getState = function getState() {
  return this._state;
};


/**
 *
 * @param initialState: any
 * @param reducers: reducer|object<reducer>
 * @return Store
 */
function createStore(initialState, reducers) {
  return Object.preventExtensions(new Store(initialState, reducers))
}
module.exports.createStore = createStore;
