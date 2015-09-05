"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var invariant = require("invariant");
var assign = require("object-assign");
var FluxDispatcher = require("./lib/FluxDispatcher");

var Store = require("./Store");
var StoreSubscription = require("./mixins/StoreSubscription");
var bind = require("../utils").bind;

var _Dispatcher = (function (_FluxDispatcher) {
  _inherits(_Dispatcher, _FluxDispatcher);

  function _Dispatcher() {
    _classCallCheck(this, _Dispatcher);

    _FluxDispatcher.apply(this, arguments);
  }

  _Dispatcher.prototype.register = function register(id, callback) {
    this._callbacks[id] = callback;
    return id;
  };

  return _Dispatcher;
})(FluxDispatcher);

var Application = (function () {
  function Application() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Application);

    this._dispatcher = new _Dispatcher();
    this._stores = {};

    var stores = opts.stores || {};
    for (var id in stores) {
      this.addStore(id, stores[id]);
    }
  }

  Application.prototype.addStore = function addStore(id, store) {
    if (typeof store === "object") {
      invariant(!(store instanceof Store), "Application.addStore(store): `store` cannot be an instance of `Store`, it must be a sub-class of " + "`Store` or a prototype accepted by `Store.create`.");
      store = Store.create(store);
    }
    store = new store(this);

    invariant(store instanceof Store, "Application.addStore(store): `store` must be a sub-class of " + "`Store` or a prototype accepted by `Store.create`.");

    this._stores[id] = store;
    return this.addCallback(id, bind(store.onMessage, store));
  };

  Application.prototype.removeStore = function removeStore(id) {
    invariant(this._stores[id], 'Application.removeStore(id): `%s` does not map to a registered store.', id);
    this.removeCallback(id);
    delete this._stores[id];
  };

  Application.prototype.hasStore = function hasStore(id) {
    return this._stores.hasOwnProperty(id);
  };

  Application.prototype.getStore = function getStore(id) {
    invariant(this._stores[id], 'Application.getStore(id): `%s` does not map to a registered store.', id);
    return this._stores[id];
  };

  Application.prototype.addCallback = function addCallback(id, callback) {
    return this._dispatcher.register(id, callback);
  };

  Application.prototype.hasCallback = function hasCallback(id) {
    return this._dispatcher._callbacks.hasOwnProperty(id);
  };

  Application.prototype.removeCallback = function removeCallback(id) {
    this._dispatcher.unregister(id);
  };

  Application.prototype.wait = function wait() {
    for (var _len = arguments.length, ids = Array(_len), _key = 0; _key < _len; _key++) {
      ids[_key] = arguments[_key];
    }

    return this._dispatcher.waitFor(ids);
  };

  Application.prototype.dispatch = function dispatch(message) {
    return this._dispatcher.dispatch(message);
  };

  Application.prototype.bindAction = function bindAction(fn) {
    var _this = this;

    return function () {
      _this.dispatch(fn.apply(undefined, arguments));
    };
  };

  return Application;
})();

assign(Application.prototype, StoreSubscription);

module.exports = Application;