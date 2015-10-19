"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var invariant = require("invariant");
var assign = require("object-assign");
var BaseDispatcher = require("../../vendor/Dispatcher");

var Store = require("../stores/Store");
var SubscriptionMixin = require("./SubscriptionMixin");

var _require = require("../utils");

var bind = _require.bind;
var isArray = _require.isArray;
var isObjectButNotArray = _require.isObjectButNotArray;

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
    var _this = this;

    _classCallCheck(this, Application);

    this._dispatcher = new _Dispatcher();
    this._stores = {};

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    invariant(args.length <= 2, "Application constructor expects at most 2 args. Received %s", args.length);

    var plugins = [];
    var stores = {};

    var first = args[0];
    var second = args[1];

    if (isArray(first)) {
      plugins = first;
      if (isObjectButNotArray(second)) {
        stores = second;
      }
    } else if (isObjectButNotArray(first)) {
      stores = first;
      if (isArray(second)) {
        plugins = second;
      }
    }

    for (var id in stores) {
      this.addStore(id, stores[id]);
    }
    plugins.forEach(function (p) {
      return p.setUp(_this);
    });
  }

  Application.prototype.store = function store(id) {
    var _this2 = this;

    return function (store) {
      _this2.addStore(id, store);
      return store;
    };
  };

  Application.prototype.addStore = function addStore(id, store) {
    store = new store(this, id);
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
    for (var _len2 = arguments.length, ids = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      ids[_key2] = arguments[_key2];
    }

    return this._dispatcher.waitFor(ids);
  };

  Application.prototype.dispatch = function dispatch(message) {
    return this._dispatcher.dispatch(message);
  };

  Application.prototype.action = function action(fn) {
    var _this3 = this;

    return function () {
      _this3.dispatch(fn.apply(undefined, arguments));
    };
  };

  Application.prototype.actions = function actions(obj) {
    var _this4 = this;

    var newObj = {};
    Object.getOwnPropertyNames(obj).forEach(function (name) {
      newObj[name] = _this4.action(obj[name]);
    });
    return newObj;
  };

  return Application;
})();

assign(Application.prototype, SubscriptionMixin);

module.exports = Application;