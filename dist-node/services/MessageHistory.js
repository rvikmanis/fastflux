"use strict";

var invariant = require("invariant");
var bind = require("../utils").bind;
var Store = require("../core/Store");

var STORE_KEY = "fastflux.services.MessageHistory";

module.exports = {

  setUp: function setUp(app) {
    invariant(!app.hasStore(STORE_KEY), "MessageHistory.setUp(app): message history service is already enabled.");

    var _state = [];
    app.addStore(STORE_KEY, {

      getState: function getState() {
        return _state.concat();
      },

      onMessage: function onMessage(payload) {
        _state.push([new Date, payload]);
        this.emitChange();
      }

    });

    app.getHistory = function () {
      return this.getStore(STORE_KEY).getState();
    };
  },

  tearDown: function tearDown(app) {
    invariant(app.hasStore(STORE_KEY), "MessageHistory.tearDown(app): message history service is already disabled.");
    delete app.getHistory;
    app.removeStore(STORE_KEY);
  }

};