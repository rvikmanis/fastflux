const invariant = require("invariant");
const assign = require("object-assign");
const BaseDispatcher = require("../../vendor/Dispatcher");

const Store = require("../stores/Store");
const SubscriptionMixin = require("./SubscriptionMixin");
const bind = require("../utils").bind;

class _Dispatcher extends BaseDispatcher {
  register(id, callback) {
    this._callbacks[id] = callback;
    return id;
  }
}

class Application {

  _dispatcher = new _Dispatcher;
  _stores = {};

  constructor(stores={}) {
    for(let id in stores) {
      this.addStore(id, stores[id]);
    }
  }

  store(id) {
    return store => {
      this.addStore(id, store);
      return store
    }
  }

  addStore(id, store) {
    store = new store(this);
    invariant(store instanceof Store,
              "Wrong type: argument is not a subclass of Store");

    this._stores[id] = store.getPublicContext();
    return this.addCallback(id, bind(store.onMessage, store));
  }

  removeStore(id) {
    invariant(this.hasStore(id),
              "'%s' does not map to a registered store",
              id);

    this.removeCallback(id);
    delete this._stores[id];
  }

  hasStore(id) {
    return this._stores.hasOwnProperty(id);
  }

  getStore(id) {
    invariant(this.hasStore(id),
              "'%s' does not map to a registered store",
              id);

    return this._stores[id];
  }

  addCallback(id, callback) {
    return this._dispatcher.register(id, callback);
  }

  removeCallback(id) {
    this._dispatcher.unregister(id);
  }

  hasCallback(id) {
    return this._dispatcher._callbacks.hasOwnProperty(id);
  }

  wait(...ids) {
    return this._dispatcher.waitFor(ids);
  }

  dispatch(message) {
    return this._dispatcher.dispatch(message);
  }

  action(fn) {
    return (...args) => {
      this.dispatch(fn(...args));
    }
  }

  actions(obj) {
    const newObj = {};
    Object.getOwnPropertyNames(obj).forEach(name => {
      newObj[name] = this.action(obj[name]);
    });
    return newObj;
  }

}

assign(Application.prototype, SubscriptionMixin);

module.exports = Application;