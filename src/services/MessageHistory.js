const invariant = require("invariant");
const bind = require("../utils").bind;
const Store = require("../core/Store");

const STORE_KEY = "fastflux.services.MessageHistory";

module.exports =  {

  setUp(app) {
    invariant(
      !app.hasStore(STORE_KEY),
      "MessageHistory.setUp(app): message history service is already enabled."
    );

    const _state = [];
    app.addStore(STORE_KEY, {

      getState() {
        return _state.concat()
      },

      onMessage(payload) {
        _state.push([new Date, payload]);
        this.emitChange();
      }

    });

    app.getHistory = function() {
      return this.getStore(STORE_KEY).getState();
    };
  },

  tearDown(app) {
    invariant(
      app.hasStore(STORE_KEY),
      "MessageHistory.tearDown(app): message history service is already disabled."
    );
    delete app.getHistory;
    app.removeStore(STORE_KEY);
  }

};
