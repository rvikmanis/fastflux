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


function id(x) { return x }
module.exports.id = id;


function keys(object, mapper=id) {
  r = [];
  for(var k in object)
    r.push(mapper(k));
  return r;
}
module.exports.keys = keys;


function values(object, mapper=id) {
  return keys(object, k => mapper(object[k], k))
}
module.exports.values = values;


function each(array, fn) {
  if (typeof array.forEach === "function")
    return array.forEach(fn);

  for (var i=0; i<array.length; i++)
    fn(array[i], i);
}
module.exports.each = each;


function map(array, mapper) {
  if (typeof array.map === "function")
    return array.map(mapper);

  var r = [];
  each(array, (v, i) => r.push(mapper(v, i)));
  return r;
}
module.exports.map = map;


function reduce(array, reducer, initial) {
  if (typeof array.reduce === "function")
    return array.reduce(reducer, initial);

  var a = initial;
  var skip = 0;
  if (a === undefined) {
    a = array[0];
    skip = 1;
  }
  each(array.slice(skip), (v, i) => {
    a = reducer(a, v, i);
  });
  return a;
}
module.exports.reduce = reduce;


function filter(array, fn) {
  if (typeof array.filter === "function")
    return array.filter(fn);

  return reduce(array, (p, c, i) => p.concat(fn(c, i) ? [c] : []), []);
}
module.exports.filter = filter;


function clone(object) { return assign({}, object) }
module.exports.clone = clone;


function freeze(object) {
  return (Object.freeze||id)(object)
}
module.exports.freeze = freeze;


function object(p) {
  var r = {};
  each(p, ([key, value]) => r[key] = value);
  return r;
}
module.exports.object = object;


function pairs(obj) {
  return values(obj, (v, k) => [k, v])
}
module.exports.pairs = pairs;


function chain(value, fns) {
  return reduce(fns, (v, fn) => fn(v), value)
}
module.exports.chain = chain;


function preventExtensions(object) {
  if (typeof Object.preventExtensions === "function")
    return Object.preventExtensions(object);

  return object;
}
module.exports.preventExtensions = preventExtensions;


function isObservable(object) {
  return typeof object === 'object' &&
   typeof object.observe === 'function' &&
   typeof object.unobserve === 'function'
}
module.exports.isObservable = isObservable;
