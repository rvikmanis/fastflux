"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var invariant = require("invariant");
var EventEmitter = require("events").EventEmitter;

var CHANGE = "change";
module.exports = (function () {
  function Store(app, key) {
    var _this = this;

    _classCallCheck(this, Store);

    this._emitter = new EventEmitter();
    this.state = null;

    invariant(this.constructor !== Store, "Cannot instantiate Store. Subclass instead!");

    this._handlers = {};
    Object.getOwnPropertyNames(this.constructor.prototype).forEach(function (name) {
      if (name === "constructor") return;
      var member = _this.constructor.prototype[name];
      if (typeof member !== "function") return;
      if (!member.hasOwnProperty("handlesMessageType")) return;

      _this._handlers[member.handlesMessageType] = member;
    });

    this._key = key;
    this._app = app;
  }

  Store.prototype.getState = function getState() {
    return this.state;
  };

  Store.prototype.onMessage = function onMessage(payload) {
    var handler = this._handlers[payload.type];
    if (typeof handler === "function") {
      handler.call(this, payload);
    }
  };

  Store.prototype.emitChange = function emitChange() {
    this._emitter.emit(CHANGE, this.getPublicContext());
  };

  Store.prototype.wait = function wait() {
    var _app;

    (_app = this._app).wait.apply(_app, arguments);
  };

  Store.prototype.getPublicContext = function getPublicContext() {
    var _this2 = this;

    return {
      listen: function listen(callback) {
        return _this2._emitter.addListener(CHANGE, callback);
      },
      unlisten: function unlisten(callback) {
        return _this2._emitter.removeListener(CHANGE, callback);
      },
      getState: function getState() {
        return _this2.getState();
      },
      getKey: function getKey() {
        return _this2._key;
      }
    };
  };

  return Store;
})();