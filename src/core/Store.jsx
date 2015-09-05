const invariant = require("invariant");
const EventEmitter = require("events").EventEmitter;
const assign = require("object-assign");

const CHANGE = "change";
module.exports = class Store {

  _emitter = new EventEmitter;

  static create(spec) {
    const handlers = spec.handlers;
    const This = this;
    delete spec.handlers;
    delete spec.constructor;

    const StoreClass = (class extends This {});
    assign(StoreClass.prototype, spec);
    StoreClass.handlers = handlers;
    return StoreClass;
  }

  constructor(app) {
    invariant(
      this.constructor !== Store,
      "new Store(): Cannot instantiate abstract class."
    );
    this._app = app;
  }

  onMessage(payload) {
    const handler = (this.constructor.handlers || {})[payload.type];
    if(typeof handler === "function") {
      handler.call(this, payload);
    }
  }

  emitChange() {
    this._emitter.emit(CHANGE);
  }

  wait(...args) {
    this._app.wait(...args);
  }

  listen(callback) {
    this._emitter.addListener(CHANGE, callback);
  }

  unlisten(callback) {
    this._emitter.removeListener(CHANGE, callback);
  }

};
