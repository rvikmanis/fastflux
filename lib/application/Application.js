"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var invariant = require("invariant");
var assign = require("object-assign");
var BaseDispatcher = require("../../vendor/Dispatcher");

var Store = require("../stores/Store");
var SubscriptionMixin = require("./SubscriptionMixin");
var bind = require("../utils").bind;

var _Dispatcher = (function (_BaseDispatcher) {
  _inherits(_Dispatcher, _BaseDispatcher);

  function _Dispatcher() {
    _classCallCheck(this, _Dispatcher);

    _BaseDispatcher.apply(this, arguments);
  }

  _Dispatcher.prototype.register = function register(id, callback) {
    this._callbacks[id] = callback;
    return id;
  };

  return _Dispatcher;
})(BaseDispatcher);

var Application = (function () {
  function Application() {
    var stores = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Application);

    this._dispatcher = new _Dispatcher();
    this._stores = {};

    for (var id in stores) {
      this.addStore(id, stores[id]);
    }
  }

  Application.prototype.store = function store(id) {
    var _this = this;

    return function (store) {
      _this.addStore(id, store);
      return store;
    };
  };

  Application.prototype.addStore = function addStore(id, store) {
    store = new store(this);
    invariant(store instanceof Store, "Wrong type: argument is not a subclass of Store");

    this._stores[id] = store.getPublicContext();
    return this.addCallback(id, bind(store.onMessage, store));
  };

  Application.prototype.removeStore = function removeStore(id) {
    invariant(this.hasStore(id), "'%s' does not map to a registered store", id);

    this.removeCallback(id);
    delete this._stores[id];
  };

  Application.prototype.hasStore = function hasStore(id) {
    return this._stores.hasOwnProperty(id);
  };

  Application.prototype.getStore = function getStore(id) {
    invariant(this.hasStore(id), "'%s' does not map to a registered store", id);

    return this._stores[id];
  };

  Application.prototype.addCallback = function addCallback(id, callback) {
    return this._dispatcher.register(id, callback);
  };

  Application.prototype.removeCallback = function removeCallback(id) {
    this._dispatcher.unregister(id);
  };

  Application.prototype.hasCallback = function hasCallback(id) {
    return this._dispatcher._callbacks.hasOwnProperty(id);
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

  Application.prototype.action = function action(fn) {
    var _this2 = this;

    return function () {
      _this2.dispatch(fn.apply(undefined, arguments));
    };
  };

  Application.prototype.actions = function actions(obj) {
    var _this3 = this;

    var newObj = {};
    Object.getOwnPropertyNames(obj).forEach(function (name) {
      newObj[name] = _this3.action(obj[name]);
    });
    return newObj;
  };

  return Application;
})();

assign(Application.prototype, SubscriptionMixin);

module.exports = Application;