const {Observable} = require('./observable');
const {clone} = require('../utils');


function Store(initialState, reducers) {
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
}
module.exports.Store = Store;


Store.prototype = Object.create(Observable.prototype);
Store.prototype.constructor = Store;


Store.prototype.emit = function emit() {
  throw new Error("emit: cannot call from outside the store");
};


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


Store.prototype.getState = function getState() {
  return this._state;
};


function createStore(initialState, reducers) {
  return Object.preventExtensions(new Store(initialState, reducers))
}
module.exports.createStore = createStore;
