function Observable() {
  Object.defineProperties(this, {
    _listeners: {value: []}
  });
}
module.exports.Observable = Observable;

Observable.prototype.subscribe = function subscribe(fn) {
  if (this._listeners.indexOf(fn) === -1)
    this._listeners.push(fn);
  else
    throw new Error("subscribe: cannot add a listener twice");
};

Observable.prototype.unsubscribe = function unsubscribe(fn) {
  var idx = this._listeners.indexOf(fn);
  if (idx !== -1)
    this._listeners.splice(idx, 1);
  else
    throw new Error("unsubscribe: argument is not a listener");
};

Observable.prototype.emit = function emit() {
  for (i = 0; i < this._listeners.length; i++) {
    this._listeners[i].apply(null, arguments);
  }
};
