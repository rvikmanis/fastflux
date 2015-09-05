"use strict";

var invariant = require("invariant");
var bind = require("../utils").bind;
var Store = require("../core/Store");

var STORE_KEY = "fastflux.services.SocketBridge";

module.exports = {

  setUp: function setUp(app, config) {
    invariant(!app.hasCallback(STORE_KEY), "SocketBridge.setUp(app): socket bridge service is already enabled.");

    var socket = new SockJS(config.url);
    app.getSocket = function () {
      return socket;
    };

    if (typeof config.onOpen === "function") socket.onopen = bind(config.onOpen, app);

    if (typeof config.onClose === "function") socket.onclose = bind(config.onClose, app);

    socket.onmessage = function (e) {
      app.dispatch(JSON.parse(e.data));
    };

    app.addCallback(STORE_KEY, function (payload) {
      if (config.filter.call(app, payload)) {
        socket.send(JSON.stringify(payload));
      }
    });
  },

  tearDown: function tearDown(app) {
    invariant(app.hasCallback(STORE_KEY), "SocketBridge.tearDown(app): socket bridge service is already disabled.");

    app.removeCallback(STORE_KEY);
    app.getSocket().close();
    delete app.getSocket;
  }

};