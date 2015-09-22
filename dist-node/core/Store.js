"use strict";

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var invariant = require("invariant");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");

var CHANGE = "change";
module.exports = (function () {
  Store.create = function create(spec) {
    var handlers = spec.handlers;
    var This = this;
    delete spec.handlers;
    delete spec.constructor;

    var StoreClass = (function (_This) {
      _inherits(StoreClass, _This);

      function StoreClass() {
        _classCallCheck(this, StoreClass);

        _This.apply(this, arguments);
      }

      return StoreClass;
    })(This);
    assign(StoreClass.prototype, spec);
    StoreClass.handlers = handlers;
    return StoreClass;
  };

  function Store(app) {
    _classCallCheck(this, Store);

    this._emitter = new EventEmitter();

    invariant(this.constructor !== Store, "new Store(): Cannot instantiate abstract class.");
    this._app = app;
  }

  Store.prototype.onMessage = function onMessage(payload) {
    var handler = (this.constructor.handlers || {})[payload.type];
    if (typeof handler === "function") {
      handler.call(this, payload);
    }
  };

  Store.prototype.emitChange = function emitChange() {
    this._emitter.emit(CHANGE);
  };

  Store.prototype.wait = function wait() {
    var _app;

    (_app = this._app).wait.apply(_app, arguments);
  };

  Store.prototype.listen = function listen(callback) {
    this._emitter.addListener(CHANGE, callback);
  };

  Store.prototype.unlisten = function unlisten(callback) {
    this._emitter.removeListener(CHANGE, callback);
  };

  return Store;
})();