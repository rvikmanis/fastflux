'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var invariant = require("invariant");
var Plugin = require('./Plugin');

var _require = require('../lib/utils');

var isUndefined = _require.isUndefined;
var isString = _require.isString;
var isFunction = _require.isFunction;
var bind = _require.bind;

var KEY = "fastflux/plugins/SocketIOBroker";

function simpleOutboundMapper(socketEventType) {
  return function (messageData) {
    this.emit(socketEventType, messageData);
  };
}

function simpleInboundMapper(messageType) {
  return function (data) {
    this.dispatch(_extends({ type: messageType }, data));
  };
}

function installMappers(to, mapper) {
  var result = {};
  Object.getOwnPropertyNames(to).forEach(function (name) {
    var value = to[name];
    if (!isFunction(value)) {
      if (!isString(value)) {
        if (!value) {
          return;
        }
        value = name;
      }
      value = mapper(value);
    }
    result[name] = value;
  });
  return result;
}

var AppSocketContext = function AppSocketContext(app, socket) {
  _classCallCheck(this, AppSocketContext);

  this.app = app;
  this.socket = socket;
};

var OutboundContext = (function (_AppSocketContext) {
  _inherits(OutboundContext, _AppSocketContext);

  function OutboundContext() {
    _classCallCheck(this, OutboundContext);

    _AppSocketContext.apply(this, arguments);
  }

  OutboundContext.prototype.emit = function emit() {
    var _socket;

    return (_socket = this.socket).emit.apply(_socket, arguments);
  };

  OutboundContext.prototype.wait = function wait() {
    var _app;

    return (_app = this.app).wait.apply(_app, arguments);
  };

  return OutboundContext;
})(AppSocketContext);

var InboundContext = (function (_AppSocketContext2) {
  _inherits(InboundContext, _AppSocketContext2);

  function InboundContext() {
    _classCallCheck(this, InboundContext);

    _AppSocketContext2.apply(this, arguments);
  }

  InboundContext.prototype.dispatch = function dispatch() {
    var _app2;

    return (_app2 = this.app).dispatch.apply(_app2, arguments);
  };

  return InboundContext;
})(AppSocketContext);

module.exports = new Plugin({

  setUp: function setUp(app) {
    var _this = this;

    invariant(!app.hasCallback(KEY), "SocketIOBroker: plugin is already enabled");

    var _options = this.options;
    var socket = _options.socket;
    var inbound = _options.inbound;
    var outbound = _options.outbound;

    invariant(!isUndefined(socket), "options.socket: socket.io-client instance expected");

    inbound = installMappers(inbound || {}, simpleInboundMapper);
    outbound = installMappers(outbound || {}, simpleOutboundMapper);

    app.addCallback(KEY, function (_ref) {
      var type = _ref.type;

      var messageData = _objectWithoutProperties(_ref, ['type']);

      var handler = outbound[type];
      if (isFunction(handler)) {
        handler.call(new OutboundContext(app, socket), messageData);
      }
    });

    var inboundEventListenerPairs = [];
    Object.getOwnPropertyNames(inbound).forEach(function (eventType) {
      var eventListenerPair = [eventType, bind(inbound[eventType], new InboundContext(app, socket))];
      socket.on.apply(socket, eventListenerPair);
      inboundEventListenerPairs.push(eventListenerPair);
    });

    socket.on('disconnect', function () {
      _this.tearDown(app);
    });

    app.getSocket = function () {
      return socket;
    };
    app._getInboundEventListenerPairs = function () {
      return inboundEventListenerPairs;
    };
  },

  tearDown: function tearDown(app) {
    invariant(app.hasCallback(KEY), "SocketIOBroker: plugin is not enabled");

    var socket = app.getSocket();
    app._getInboundEventListenerPairs().forEach(function (_ref2) {
      var eventType = _ref2[0];
      var listener = _ref2[1];

      socket.removeListener(eventType, listener);
    });
    delete app.getSocket;
    delete app._getInboundEventListenerPairs;
    app.removeCallback(KEY);
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