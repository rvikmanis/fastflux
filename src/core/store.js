var {Observable} = require('./observable');
var {clone} = require('../utils');

function Store() {
  if (this.constructor === Store)
    throw new Error("Store is abstract: extend or call createStore");

  var initialState = this.constructor.initialState;
  var reducers = this.constructor.reducers || this.constructor.reducer;

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
  });
}

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

  if (newState !== void 0) {
    this._state = newState;
    Observable.prototype.emit.call(this, this._state);
  }
};

Store.prototype.getState = function getState() {
  return this._state;
};

function createStore(initialState, reducers) {
  function _s() {
    Store.call(this);
  }
  _s.prototype = Object.create(Store.prototype);
  _s.prototype.constructor = _s;
  _s.initialState = initialState;
  _s.reducers = reducers;
  return new _s;
}

module.exports.Store = Store;
module.exports.createStore = createStore;
