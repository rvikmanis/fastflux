const invariant = require("invariant");
const Plugin = require('./Plugin');
const {isUndefined, isString, isFunction, bind} = require('../lib/utils');

const KEY = "fastflux/plugins/SocketIOBroker";

function simpleOutboundMapper(socketEventType) {
  return function(messageData) {
    this.emit(socketEventType, messageData);
  }
}

function simpleInboundMapper(messageType) {
  return function(data) {
    this.dispatch({type: messageType, ...data});
  }
}

function installMappers(to, mapper) {
  const result = {};
  Object.getOwnPropertyNames(to).forEach(name => {
    let value = to[name];
    if (!isFunction(value)) {
      if (!isString(value)) {
        if (!value) {
          return
        }
        value = name
      }
      value = mapper(value)
    }
    result[name] = value
  });
  return result
}

class AppSocketContext {

  constructor(app, socket) {
    this.app = app;
    this.socket = socket;
  }

}

class OutboundContext extends AppSocketContext {

  emit(...args) {
    return this.socket.emit(...args);
  }

  wait(...args) {
    return this.app.wait(...args);
  }

}

class InboundContext extends AppSocketContext {

  dispatch(...args) {
    return this.app.dispatch(...args);
  }

}

module.exports = new Plugin({

  setUp(app) {
    invariant(
      !app.hasCallback(KEY),
      "SocketIOBroker: plugin is already enabled"
    );

    let {socket, inbound, outbound} = this.options;
    invariant(!isUndefined(socket),
              "options.socket: socket.io-client instance expected");

    inbound = installMappers(inbound || {}, simpleInboundMapper);
    outbound = installMappers(outbound || {}, simpleOutboundMapper);

    app.addCallback(KEY, ({type, ...messageData}) => {
      const handler = outbound[type];
      if (isFunction(handler)) {
        handler.call(new OutboundContext(app, socket), messageData)
      }
    });

    const inboundEventListenerPairs = [];
    Object.getOwnPropertyNames(inbound).forEach(eventType => {
      const eventListenerPair = [
        eventType,
        bind(inbound[eventType], new InboundContext(app, socket))
      ];
      socket.on(...eventListenerPair);
      inboundEventListenerPairs.push(eventListenerPair)
    });

    socket.on('disconnect', () => {
      this.tearDown(app);
    });

    app.getSocket = () => socket;
    app._getInboundEventListenerPairs = () => inboundEventListenerPairs
  },

  tearDown(app) {
    invariant(
      app.hasCallback(KEY),
      "SocketIOBroker: plugin is not enabled"
    );

    const socket = app.getSocket();
    app._getInboundEventListenerPairs().forEach(([eventType, listener]) => {
      socket.removeListener(eventType, listener)
    });
    delete app.getSocket;
    delete app._getInboundEventListenerPairs;
    app.removeCallback(KEY)
  }

});

/*
// Example

var config = {
  socket: io("http://localhost"),
  inbound: {
    "recv im": MessageTypes.IM.Add
  },
  outbound: {
    [MessageTypes.IM.Send]: "send im"
  }
};
SocketIOBroker.configure(config).setUp(app);

 */