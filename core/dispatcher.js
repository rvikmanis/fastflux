var _require = require('../utils');

var clone = _require.clone;
var values = _require.values;
var chain = _require.chain;
var each = _require.each;
var object = _require.object;
var assign = _require.assign;
var map = _require.map;
var pairs = _require.pairs;

function Dispatcher() {
  var stores = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var _arguments = arguments;
  var callbacks = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var dependencies = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  stores = clone(stores);
  callbacks = chain(clone(callbacks), [function (_) {
    return assign(_, chain(stores, [function (_) {
      return values(_, function (s, k) {
        return [k, function () {
          return s.send.call(s, _arguments);
        }];
      });
    }, function (_) {
      return object(_);
    }]));
  }, function (_) {
    return pairs(_);
  }]);

  values(dependencies, function (d) {
    Object.freeze(d);
    values(d, function (dd) {
      Object.freeze(dd);
    });
  });

  var messageCallbackOrder = values(dependencies, function (cbDeps, messageType) {
    var cbo = [];
    var callbackNames = map(callbacks, function (_ref) {
      var n = _ref[0];
      return n;
    });
    var cbNR = callbackNames.concat();

    function visit(name, index) {
      if (cbo.indexOf(index) !== -1) return;else if (callbackNames.indexOf(name) === -1) throw new Error("Dispatcher.prototype.constructor: circular dependencies, aborting");

      callbackNames.splice(index, 1, undefined);
      if (cbDeps[name] !== undefined) each(cbDeps[name], function (depName) {
        return visit(depName, cbNR.indexOf(depName));
      });
      cbo.push(index);
    }

    each(callbackNames, visit);
    return [messageType, Object.freeze(cbo)];
  });
  messageCallbackOrder = object(messageCallbackOrder);

  Object.defineProperties(this, {
    _stores: { value: Object.freeze(stores) },
    _callbacks: { value: Object.freeze(map(callbacks, Object.freeze)) },
    _isDispatching: { value: false, writable: true },
    _messageCallbackOrder: { value: Object.freeze(messageCallbackOrder) },
    _dependencies: { value: Object.freeze(dependencies) }
  });
}
module.exports.Dispatcher = Dispatcher;

Dispatcher.prototype.dispatch = function dispatch(message) {
  var _this = this;

  this._isDispatching = true;
  if (this._messageCallbackOrder.hasOwnProperty(message.type)) {
    var cbo = this._messageCallbackOrder[message.type];
    var deps = this._dependencies[message.type];
    each(cbo, function (idx) {
      var _callbacks$idx = _this._callbacks[idx];
      var name = _callbacks$idx[0];
      var cb = _callbacks$idx[1];

      var context = undefined;
      if (deps[name] !== undefined) {
        context = values(deps[name], function (d) {
          var ds = _this.getStore(d);
          if (ds !== undefined) return [d, ds.getState()];
          return false;
        });
        context = object(filter(context, Boolean));
      }
      cb(message, context);
    });
  } else each(this._callbacks, function (cb) {
    return cb[1](message);
  });
  this._isDispatching = false;
};

Dispatcher.prototype.getStore = function getStore(storeKey) {
  return this._stores[storeKey];
};

Dispatcher.prototype.getState = function getState() {
  return chain(this._stores, [function (_) {
    return values(_, function (s, k) {
      return [k, s.getState()];
    });
  }, function (_) {
    return object(_);
  }, function (_) {
    return Object.freeze(_);
  }]);
};

function createDispatcher() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return Object.preventExtensions(new Dispatcher(opts.stores, opts.callbacks, opts.dependencies));
}
module.exports.createDispatcher = createDispatcher;