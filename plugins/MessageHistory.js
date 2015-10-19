"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var invariant = require("invariant");
var assign = require("object-assign");
var bind = require("../lib/utils").bind;
var Store = require("../lib/stores/Store");
var Plugin = require('./Plugin');

var STORE_KEY = "fastflux/plugins/MessageHistory";

var defaults = {
  log: false
};

module.exports = new Plugin({

  setUp: function setUp(app) {
    invariant(!app.hasStore(STORE_KEY), "Message history plugin is already enabled.");

    var options = this.options;

    app.addStore(STORE_KEY, (function (_Store) {
      _inherits(_class, _Store);

      function _class() {
        _classCallCheck(this, _class);

        _Store.apply(this, arguments);

        this.history = [];
      }

      _class.prototype.getState = function getState() {
        return this.history.concat();
      };

      _class.prototype.onMessage = function onMessage(payload) {
        var entry = [new Date(), payload];
        this.history.push(entry);
        this.emitChange();

        if (options.log) {
          console.log.apply(console, entry);
        }
      };

      return _class;
    })(Store));

    app.getMessageHistory = function () {
      return this.getStore(STORE_KEY).getState();
    };
  },

  tearDown: function tearDown(app) {
    invariant(app.hasStore(STORE_KEY), "Message history plugin is not enabled.");
    delete app.getMessageHistory;
    app.removeStore(STORE_KEY);
  },

  options: defaults

});