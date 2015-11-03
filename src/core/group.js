var {clone, values,
    chain, each,
    object, assign, map, pairs} = require('../utils');
var {Observable} = require('./observable');

var mapStoresToBoundCallbacks = chain([
  pairs,
  map(([k, s]) => () => [k, s.send.call(s, arguments)]),
  object
]);

function Group() {
  if (this.constructor === Group)
    throw new Error("Group is abstract: extend or call createGroup");

  var stores = this.constructor.stores || {};
  var callbacks = this.constructor.callbacks || {};
  var dependencies = this.constructor.dependencies || {};

  callbacks = clone(callbacks);
  stores = clone(stores);
  var storeCallbacks = {};
  for (let k in stores)
    storeCallbacks[k] = () => stores[k].send.call(stores[k], arguments);
  callbacks = assign(callbacks, storeCallbacks);

  var messageCallbackOrder = {};
  for (let messageType in dependencies) {
    let cbDeps = Object.freeze(dependencies[messageType]);
    let cbo = [];
    let callbackNames = Object.getOwnPropertyNames(callbacks);
    let queue = callbackNames.concat();

    function visit(name, index) {
      if (cbo.indexOf(index) !== -1)
        return;
      else if (queue.indexOf(name) === -1)
        throw new Error("Group.prototype.constructor: circular dependencies, aborting");

      queue.splice(index, 1, undefined);
      if (cbDeps[name] !== undefined) {
        Object.freeze(cbDeps[name]).forEach(depName => {
          visit(depName, callbackNames.indexOf(depName))
        });
      }
      cbo.push(index);
    }

    queue.forEach(visit);
    messageCallbackOrder[messageType] = Object.freeze(cbo);
  }

  Observable.call(this);

  Object.defineProperties(this, {
    _stores: {value: Object.freeze(stores)},
    _callbacks: {value: Object.freeze(map(pairs(callbacks), Object.freeze))},
    _isDispatching: {value: false, writable: true},
    _messageCallbackOrder: {value: Object.freeze(messageCallbackOrder)},
    _dependencies: {value: Object.freeze(dependencies)}
  })
}
module.exports.Group = Group;

Group.prototype = Object.create(Observable.prototype);
Group.prototype.constructor = Group;

Group.prototype.send = function send(message, parentContext) {
  this._isDispatching = true;
  if (this._messageCallbackOrder.hasOwnProperty(message.type)) {
    var cbo = this._messageCallbackOrder[message.type];
    var deps = this._dependencies[message.type];
    each(cbo, idx => {
      var [name, cb] = this._callbacks[idx];
      var context = undefined;
      if (deps[name] !== undefined) {
        context = values(deps[name], d => {
          var ds = this.getStore(d);
          if (ds !== undefined)
            return [d, ds.getState()];
          return false
        });
        context = object(filter(context, Boolean));
        if (typeof parentContext !== undefined) context.parent = parentContext;
      }
      cb(message, context);
    })
  }
  else {
    var context = undefined;
    if (typeof parentContext !== undefined) context = {parent: parentContext};
    each(this._callbacks, (cb) => cb[1](message, context));
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
  for (var k in this._stores)
    state[k] = this._stores[k].getState();
  return Object.freeze(state);
};

function createGroup(options={}) {
  function _g() {
    Group.call(this);
  }
  _g.prototype = Object.create(Group.prototype);
  _g.prototype.constructor = _g;
  _g.stores = options.stores;
  _g.callbacks = options.callbacks;
  _g.dependencies = options.dependencies;
  return new _g;
}
module.exports.createGroup = createGroup;
