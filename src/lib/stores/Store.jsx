const invariant = require("invariant");
const EventEmitter = require("events").EventEmitter;
const assign = require("object-assign");

const CHANGE = "change";
module.exports = class Store {

  _emitter = new EventEmitter;
  state = null;

  constructor(app, key) {
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

    this._key = key;
    this._app = app;
  }

  getState() {
    return this.state;
  }

  onMessage(payload) {
    const handler = this._handlers[payload.type];
    if(typeof handler === "function") {
      handler.call(this, payload);
    }
  }

  emitChange() {
    this._emitter.emit(CHANGE, this.getPublicContext());
  }

  wait(...args) {
    this._app.wait(...args);
  }

  getPublicContext() {
    return {
      listen: callback => this._emitter.addListener(CHANGE, callback),
      unlisten: callback => this._emitter.removeListener(CHANGE, callback),
      getState: () => this.getState(),
      getKey: () => this._key
    }
  }

};
