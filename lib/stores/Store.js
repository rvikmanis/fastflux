"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var invariant = require("invariant");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");

var CHANGE = "change";
module.exports = (function () {
  function Store(app) {
    var _this = this;

    _classCallCheck(this, Store);

    this._emitter = new EventEmitter();

    invariant(this.constructor !== Store, "Cannot instantiate Store. Subclass instead!");

    this._handlers = {};
    Object.getOwnPropertyNames(this.constructor.prototype).forEach(function (name) {
      if (name === "constructor") return;
      var member = _this.constructor.prototype[name];
      if (typeof member !== "function") return;
      if (!member.hasOwnProperty("handlesMessageType")) return;

      _this._handlers[member.handlesMessageType] = member;
    });

    this._app = app;
  }

  Store.prototype.onMessage = function onMessage(payload) {
    var handler = this._handlers[payload.type];
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

  Store.prototype.getPublicContext = function getPublicContext() {
    var _this2 = this;

    return {
      listen: function listen(cb) {
        return _this2.listen(cb);
      },
      unlisten: function unlisten(cb) {
        return _this2.unlisten(cb);
      },
      getState: function getState() {
        return _this2.getState();
      }
    };
  };

  return Store;
})();