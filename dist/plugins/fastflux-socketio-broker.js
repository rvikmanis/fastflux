/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	(function (window) {

	  window.Fastflux.plugins = window.Fastflux.plugins || {};
	  window.Fastflux.plugins.SocketIOBroker = __webpack_require__(15);
	})(window);

/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function(condition, format, a, b, c, d, e, f) {
	  if (process.env.NODE_ENV !== 'production') {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        'Invariant Violation: ' +
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 4 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 5 */
/***/ function(module, exports) {

	/* eslint-disable no-unused-vars */
	'use strict';
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ function(module, exports) {

	"use strict";

	exports.bind = function bind(fn, ctx) {
	  fn = typeof fn.originalFunction === "function" && fn.originalFunction || fn;
	  var boundFn = function boundFn() {
	    return fn.apply(ctx, arguments);
	  };
	  boundFn.originalFunction = fn;
	  return boundFn;
	};

	var isArray = function isArray(a) {
	  if (typeof Array.isArray === "function") return Array.isArray(a);else return a instanceof Array;
	};
	exports.isArray = isArray;

	exports.isObjectButNotArray = function isObjectButNotArray(o) {
	  return !isArray(o) && typeof o === "object";
	};

	exports.isSubclass = function isSubclass(A, B) {
	  return A.prototype instanceof B;
	};

	exports.isUndefined = function isUndefined(u) {
	  return typeof u === "undefined";
	};

	exports.isString = function isString(s) {
	  return typeof s === "string";
	};

	exports.isFunction = function isFunction(f) {
	  return typeof f === "function";
	};

	module.exports = exports;

/***/ },
/* 12 */,
/* 13 */,
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var assign = __webpack_require__(5);

	module.exports = function Plugin(_ref) {
	  var _this = this;

	  var setUp = _ref.setUp;
	  var tearDown = _ref.tearDown;
	  var options = _ref.options;

	  var rest = _objectWithoutProperties(_ref, ['setUp', 'tearDown', 'options']);

	  _classCallCheck(this, Plugin);

	  this.setUp = setUp;
	  this.tearDown = tearDown;
	  this.options = assign({}, options);
	  Object.getOwnPropertyNames(rest).forEach(function (name) {
	    _this[name] = rest[name];
	  });

	  this.configure = function () {
	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    options = assign({}, this.options, options);
	    return new this.constructor(_extends({ setUp: setUp, tearDown: tearDown, options: options }, rest));
	  };
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var invariant = __webpack_require__(3);
	var Plugin = __webpack_require__(14);

	var _require = __webpack_require__(11);

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

/***/ }
/******/ ]);