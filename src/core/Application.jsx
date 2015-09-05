const invariant = require("invariant");
const assign = require("object-assign");
const FluxDispatcher = require("./lib/FluxDispatcher");

const Store = require("./Store");
const StoreSubscription = require("./mixins/StoreSubscription");
const bind = require("../utils").bind;

class _Dispatcher extends FluxDispatcher {
  register(id, callback) {
    this._callbacks[id] = callback;
    return id;
  }
}

class Application {

  _dispatcher = new _Dispatcher;
  _stores = {};

  constructor(opts={}) {
    const stores = opts.stores || {};
    for(let id in stores) {
      this.addStore(id, stores[id]);
    }
  }

  addStore(id, store) {
    if(typeof store === "object") {
      invariant(
        !(store instanceof Store),
        "Application.addStore(store): `store` cannot be an instance of `Store`, it must be a sub-class of " +
        "`Store` or a prototype accepted by `Store.create`."
      );
      store = Store.create(store);
    }
    store = new store(this);

    invariant(
      store instanceof Store,
      "Application.addStore(store): `store` must be a sub-class of " +
      "`Store` or a prototype accepted by `Store.create`."
    );

    this._stores[id] = store;
    return this.addCallback(id, bind(store.onMessage, store));
  }

  removeStore(id) {
    invariant(
      this._stores[id],
      'Application.removeStore(id): `%s` does not map to a registered store.',
      id
    );
    this.removeCallback(id);
    delete this._stores[id];
  }

  hasStore(id) {
    return this._stores.hasOwnProperty(id);
  }

  getStore(id) {
    invariant(
      this._stores[id],
      'Application.getStore(id): `%s` does not map to a registered store.',
      id
    );
    return this._stores[id];
  }

  addCallback(id, callback) {
    return this._dispatcher.register(id, callback);
  }

  hasCallback(id) {
    return this._dispatcher._callbacks.hasOwnProperty(id);
  }

  removeCallback(id) {
    this._dispatcher.unregister(id);
  }

  wait(...ids) {
    return this._dispatcher.waitFor(ids);
  }

  dispatch(message) {
    return this._dispatcher.dispatch(message);
  }

  bindAction(fn) {
    return (...args) => {
      this.dispatch(fn(...args));
    }
  }

}

assign(Application.prototype, StoreSubscription);

module.exports = Application;
