var _require = require('../utils');

var each = _require.each;

function Observable() {
  Object.defineProperties(this, {
    _listeners: { value: [] }
  });
}
module.exports.Observable = Observable;

Observable.prototype.observe = function observe(fn) {
  if (this._listeners.indexOf(fn) === -1) this._listeners.push(fn);else throw new Error("observe: cannot add a listener twice");
};

Observable.prototype.unobserve = function unobserve(fn) {
  var idx = this._listeners.indexOf(fn);
  if (idx !== -1) this._listeners.splice(idx, 1);else throw new Error("unobserve: argument is not a listener");
};

Observable.prototype.emit = function emit() {
  for (i = 0; i < this._listeners.length; i++) {
    this._listeners[i].apply(null, arguments);
  }
};