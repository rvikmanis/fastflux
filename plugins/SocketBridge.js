"use strict";

var invariant = require("invariant");
var bind = require("../lib/utils").bind;
var Store = require("./Store");
var SockJS = require('sockjs-client');

var CALLBACK_KEY = "fastflux.plugins.SocketBridge";

module.exports = {

  setUp: function setUp(app, config) {
    invariant(!app.hasCallback(CALLBACK_KEY), "SocketBridge.setUp(app, config): socket bridge service is already enabled.");

    var socket = new SockJS(config.url);
    app.getSocket = function () {
      return socket;
    };

    if (typeof config.onOpen === "function") socket.onopen = bind(config.onOpen, app);

    if (typeof config.onClose === "function") socket.onclose = bind(config.onClose, app);

    socket.onmessage = function (e) {
      app.dispatch(JSON.parse(e.data));
    };

    app.addCallback(CALLBACK_KEY, function (payload) {
      if (config.filter.call(app, payload)) {
        socket.send(JSON.stringify(payload));
      }
    });
  },

  tearDown: function tearDown(app) {
    invariant(app.hasCallback(CALLBACK_KEY), "SocketBridge.tearDown(app): socket bridge service is not enabled.");

    app.removeCallback(CALLBACK_KEY);
    app.getSocket().close();
    delete app.getSocket;
  }

};