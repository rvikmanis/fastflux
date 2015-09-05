const invariant = require("invariant");
const bind = require("../utils").bind;
const Store = require("../core/Store");

const STORE_KEY = "fastflux.services.SocketBridge";

module.exports = {

  setUp(app, config) {
    invariant(
      !app.hasCallback(STORE_KEY),
      "SocketBridge.setUp(app): socket bridge service is already enabled."
    );

    const socket = new SockJS(config.url);
    app.getSocket = () => socket;

    if(typeof config.onOpen === "function")
      socket.onopen = bind(config.onOpen, app);

    if(typeof config.onClose === "function")
      socket.onclose = bind(config.onClose, app);

    socket.onmessage = (e) => {
      app.dispatch(JSON.parse(e.data));
    };

    app.addCallback(STORE_KEY, (payload) => {
      if(config.filter.call(app, payload)) {
        socket.send(JSON.stringify(payload));
      }
    });
  },

  tearDown(app) {
    invariant(
      app.hasCallback(STORE_KEY),
      "SocketBridge.tearDown(app): socket bridge service is already disabled."
    );

    app.removeCallback(STORE_KEY);
    app.getSocket().close();
    delete app.getSocket;
  }

};
