"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var invariant = require("invariant");
var bind = require("../lib/utils").bind;
var Store = require("../lib/stores/Store");

var STORE_KEY = "fastflux/plugins/MessageHistory";

var MessageHistoryStore = (function (_Store) {
  _inherits(MessageHistoryStore, _Store);

  function MessageHistoryStore() {
    _classCallCheck(this, MessageHistoryStore);

    _Store.apply(this, arguments);

    this.history = [];
  }

  MessageHistoryStore.prototype.getState = function getState() {
    return this.history.concat();
  };

  MessageHistoryStore.prototype.onMessage = function onMessage(payload) {
    this.history.push([new Date(), payload]);
    this.emitChange();
  };

  return MessageHistoryStore;
})(Store);

module.exports = {

  setUp: function setUp(app) {
    invariant(!app.hasStore(STORE_KEY), "Message history plugin is already enabled.");

    app.addStore(STORE_KEY, MessageHistoryStore);
    app.getMessageHistory = function () {
      return this.getStore(STORE_KEY).getState();
    };
  },

  tearDown: function tearDown(app) {
    invariant(app.hasStore(STORE_KEY), "Message history plugin is not enabled.");
    delete app.getMessageHistory;
    app.removeStore(STORE_KEY);
  }

};