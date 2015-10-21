const invariant = require("invariant");
const Store = require("../lib/stores/Store");
const Plugin = require('./Plugin');

const STORE_KEY = "fastflux/plugins/MessageHistory";

const defaults = {
  log: false
};

module.exports = new Plugin({

  setUp(app) {
    invariant(
      !app.hasStore(STORE_KEY),
      "Message history plugin is already enabled."
    );

    const options = this.options;

    app.addStore(STORE_KEY, class extends Store {

      history = [];

      getState() {
        return this.history.concat()
      }

      onMessage(payload) {
        const entry = [new Date, payload];
        this.history.push(entry);
        this.emitChange();

        if (options.log) {
          console.log(...entry);
        }
      }

    });

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
  },

  options: defaults

});
