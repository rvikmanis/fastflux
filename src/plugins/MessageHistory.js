const invariant = require("invariant");
const bind = require("../lib/utils").bind;
const Store = require("../lib/stores/Store");

const STORE_KEY = "fastflux/plugins/MessageHistory";

class MessageHistoryStore extends Store {

  history = [];

  getState() {
    return this.history.concat()
  }

  onMessage(payload) {
    this.history.push([new Date, payload]);
    this.emitChange();
  }

}

module.exports =  {

  setUp(app) {
    invariant(
      !app.hasStore(STORE_KEY),
      "Message history plugin is already enabled."
    );

    app.addStore(STORE_KEY, MessageHistoryStore);
    app.getMessageHistory = function() {
      return this.getStore(STORE_KEY).getState();
    };
  },

  tearDown(app) {
    invariant(
      app.hasStore(STORE_KEY),
      "Message history plugin is not enabled."
    );
    delete app.getMessageHistory;
    app.removeStore(STORE_KEY);
  }

};
