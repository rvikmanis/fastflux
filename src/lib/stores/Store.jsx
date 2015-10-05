const invariant = require("invariant");
const EventEmitter = require("events").EventEmitter;
const assign = require("object-assign");

const CHANGE = "change";
module.exports = class Store {

  _emitter = new EventEmitter;

  constructor(app) {
    invariant(this.constructor !== Store,
              "Cannot instantiate Store. Subclass instead!");

    this._handlers = {};
    Object.getOwnPropertyNames(this.constructor.prototype).forEach(name => {
      if (name === "constructor") return;
      const member = this.constructor.prototype[name];
      if (typeof member !== "function") return;
      if (!member.hasOwnProperty("handlesMessageType")) return;

      this._handlers[member.handlesMessageType] = member;
    });

    this._app = app;
  }

  onMessage(payload) {
    const handler = this._handlers[payload.type];
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

  getPublicContext() {
    return {
      listen: cb => this.listen(cb),
      unlisten: cb => this.unlisten(cb),
      getState: () => this.getState()
    }
  }

};
