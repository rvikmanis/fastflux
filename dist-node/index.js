"use strict";

module.exports = {
  Application: require("./core/Application"),
  Store: require("./core/Store"),

  services: {
    SocketBridge: require('./services/SocketBridge'),
    MessageHistory: require('./services/MessageHistory')
  }
};