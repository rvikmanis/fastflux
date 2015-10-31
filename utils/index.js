var assign = require('object-assign');
var defProp = Object.defineProperty;
var defProps = Object.defineProperties;
var create = Object.create;

module.exports = {
  assign: assign,
  defProp: defProp,
  defProps: defProps,
  create: create
};

function id(x) {
  return x;
}
module.exports.id = id;

function keys(object) {
  var mapper = arguments.length <= 1 || arguments[1] === undefined ? id : arguments[1];

  r = [];
  for (var k in object) r.push(mapper(k));
  return r;
}
module.exports.keys = keys;

function values(object) {
  var mapper = arguments.length <= 1 || arguments[1] === undefined ? id : arguments[1];

  return keys(object, function (k) {
    return mapper(object[k], k);
  });
}
module.exports.values = values;

function each(array, fn) {
  if (typeof array.forEach === "function") return array.forEach(fn);

  for (var i = 0; i < array.length; i++) fn(array[i], i);
}
module.exports.each = each;

function map(array, mapper) {
  if (typeof array.map === "function") return array.map(mapper);

  var r = [];
  each(array, function (v, i) {
    return r.push(mapper(v, i));
  });
  return r;
}
module.exports.map = map;

function reduce(array, reducer, initial) {
  if (typeof array.reduce === "function") return array.reduce(reducer, initial);

  var a = initial;
  var skip = 0;
  if (a === undefined) {
    a = array[0];
    skip = 1;
  }
  each(array.slice(skip), function (v, i) {
    a = reducer(a, v, i);
  });
  return a;
}
module.exports.reduce = reduce;

function filter(array, fn) {
  if (typeof array.filter === "function") return array.filter(fn);

  return reduce(array, function (p, c, i) {
    return p.concat(fn(c, i) ? [c] : []);
  }, []);
}
module.exports.filter = filter;

function clone(object) {
  return assign({}, object);
}
module.exports.clone = clone;

function freeze(object) {
  return (Object.freeze || id)(object);
}
module.exports.freeze = freeze;

function object(p) {
  var r = {};
  each(p, function (_ref) {
    var key = _ref[0];
    var value = _ref[1];
    return r[key] = value;
  });
  return r;
}
module.exports.object = object;

function pairs(obj) {
  return values(obj, function (v, k) {
    return [k, v];
  });
}
module.exports.pairs = pairs;

function chain(value, fns) {
  return reduce(fns, function (v, fn) {
    return fn(v);
  }, value);
}
module.exports.chain = chain;

function preventExtensions(object) {
  if (typeof Object.preventExtensions === "function") return Object.preventExtensions(object);

  return object;
}
module.exports.preventExtensions = preventExtensions;

function isObservable(object) {
  return typeof object === 'object' && typeof object.observe === 'function' && typeof object.unobserve === 'function';
}
module.exports.isObservable = isObservable;