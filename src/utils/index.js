var assign_ = require('object-assign');


function _fi(fn, a) {
  return v => fn(v, a);
}


function assign() {
  if (arguments.length === 1)
    return _fi(assign_, arguments[0]);

  return assign_.apply(null, arguments);
}
module.exports.assign = assign;


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


function map_(array, mapper) {
  if (typeof array.map === "function")
    return array.map(mapper);

  var r = [];
  each(array, (v, i) => r.push(mapper(v, i)));
  return r;
}
function map() {
  if (arguments.length === 1)
    return _fi(map_, arguments[0]);

  return map_.apply(null, arguments);
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


function chain(value) {
  var v = value;
  for (var i=1; i<arguments.length; i++) v = arguments[i](v);
  return v;
}
module.exports.chain = chain;


function isObservable(object) {
  return typeof object === 'object' &&
   typeof object.observe === 'function' &&
   typeof object.unobserve === 'function'
}
module.exports.isObservable = isObservable;
