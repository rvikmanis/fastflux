var _arguments = arguments;

var _require = require('../utils');

var clone = _require.clone;
var values = _require.values;
var chain = _require.chain;
var each = _require.each;
var object = _require.object;
var assign = _require.assign;
var map = _require.map;
var pairs = _require.pairs;

var _require2 = require('./observable');

var Observable = _require2.Observable;

var mapStoresToBoundCallbacks = chain([pairs, map(function (_ref) {
  var k = _ref[0];
  var s = _ref[1];
  return function () {
    return [k, s.send.call(s, _arguments)];
  };
}), object]);

function Group() {
  var _arguments2 = arguments;

  if (this.constructor === Group) throw new Error("Group is abstract: extend or call createGroup");

  var stores = this.constructor.stores || {};
  var callbacks = this.constructor.callbacks || {};
  var dependencies = this.constructor.dependencies || {};

  callbacks = clone(callbacks);
  stores = clone(stores);
  var storeCallbacks = {};

  var _loop = function (k) {
    storeCallbacks[k] = function () {
      return stores[k].send.call(stores[k], _arguments2);
    };
  };

  for (var k in stores) {
    _loop(k);
  }callbacks = assign(callbacks, storeCallbacks);

  var messageCallbackOrder = {};

  var _loop2 = function (messageType) {
    var cbDeps = Object.freeze(dependencies[messageType]);
    var cbo = [];
    var callbackNames = Object.getOwnPropertyNames(callbacks);
    var queue = callbackNames.concat();

    function visit(name, index) {
      if (cbo.indexOf(index) !== -1) return;else if (queue.indexOf(name) === -1) throw new Error("Group.prototype.constructor: circular dependencies, aborting");

      queue.splice(index, 1, undefined);
      if (cbDeps[name] !== undefined) {
        Object.freeze(cbDeps[name]).forEach(function (depName) {
          visit(depName, callbackNames.indexOf(depName));
        });
      }
      cbo.push(index);
    }

    queue.forEach(visit);
    messageCallbackOrder[messageType] = Object.freeze(cbo);
  };

  for (var messageType in dependencies) {
    _loop2(messageType);
  }

  Observable.call(this);

  Object.defineProperties(this, {
    _stores: { value: Object.freeze(stores) },
    _callbacks: { value: Object.freeze(map(pairs(callbacks), Object.freeze)) },
    _isDispatching: { value: false, writable: true },
    _messageCallbackOrder: { value: Object.freeze(messageCallbackOrder) },
    _dependencies: { value: Object.freeze(dependencies) }
  });
}
module.exports.Group = Group;

Group.prototype = Object.create(Observable.prototype);
Group.prototype.constructor = Group;

Group.prototype.send = function send(message, parentContext) {
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
        if (typeof parentContext !== undefined) context.parent = parentContext;
      }
      cb(message, context);
    });
  } else {
    var context = undefined;
    if (typeof parentContext !== undefined) context = { parent: parentContext };
    each(this._callbacks, function (cb) {
      return cb[1](message, context);
    });
  }
  this._isDispatching = false;
  Observable.prototype.emit.call(this, this.getState());
};

Group.prototype.emit = null;

Group.prototype.getStore = function getStore(storeKey) {
  return this._stores[storeKey];
};

Group.prototype.getState = function getState() {
  var state = {};
  for (var k in this._stores) state[k] = this._stores[k].getState();
  return Object.freeze(state);
};

function createGroup() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  function _g() {
    Group.call(this);
  }
  _g.prototype = Object.create(Group.prototype);
  _g.prototype.constructor = _g;
  _g.stores = options.stores;
  _g.callbacks = options.callbacks;
  _g.dependencies = options.dependencies;
  return new _g();
}
module.exports.createGroup = createGroup;