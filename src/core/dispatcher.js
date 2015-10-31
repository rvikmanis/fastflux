var {clone, values,
    freeze, chain, each,
    object, assign, map, pairs} = require('../utils');

function Dispatcher(stores={}, callbacks={}, dependencies={}) {
  stores = clone(stores);
  callbacks = chain(clone(callbacks), [
    _ => assign(_, chain(stores, [
      _ => values(_, (s, k) => [k, () => s.send.call(s, arguments)]),
      _ => object(_)
    ])),
    _ => pairs(_)
  ]);

  values(dependencies, d => {
    freeze(d);
    values(d, dd => { freeze(dd); })
  });

  var messageCallbackOrder = values(dependencies, (cbDeps, messageType) => {
    var cbo = [];
    var callbackNames = map(callbacks, ([n]) => n);
    var cbNR = callbackNames.concat();

    function visit(name, index) {
      if (cbo.indexOf(index) !== -1)
        return;
      else if (callbackNames.indexOf(name) === -1)
        throw new Error("Dispatcher.prototype.constructor: circular dependencies, aborting");

      callbackNames.splice(index, 1, undefined);
      if (cbDeps[name] !== undefined)
        each(cbDeps[name], depName => visit(depName, cbNR.indexOf(depName)));
      cbo.push(index);
    }

    each(callbackNames, visit);
    return [messageType, freeze(cbo)];
  });
  messageCallbackOrder = object(messageCallbackOrder);

  Object.defineProperties(this, {
    _stores: {value: freeze(stores)},
    _callbacks: {value: freeze(map(callbacks, freeze))},
    _isDispatching: {value: false, writable: true},
    _messageCallbackOrder: {value: freeze(messageCallbackOrder)},
    _dependencies: {value: freeze(dependencies)}
  })
}
module.exports.Dispatcher = Dispatcher;

Dispatcher.prototype.dispatch = function dispatch(message) {
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
      }
      cb(message, context);
    })
  }
  else each(this._callbacks, (cb) => cb[1](message));
  this._isDispatching = false;
};

Dispatcher.prototype.getStore = function getStore(storeKey) {
  return this._stores[storeKey];
};

Dispatcher.prototype.getState = function getState() {
  return chain(this._stores, [
      _ => values(_, (s, k) => [k, s.getState()]),
      _ => object(_),
      _ => freeze(_)
  ]);
};

function createDispatcher(opts={}) {
  return Object.preventExtensions(new Dispatcher(opts.stores, opts.callbacks, opts.dependencies))
}
module.exports.createDispatcher = createDispatcher;
