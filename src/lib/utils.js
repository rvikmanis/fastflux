exports.bind = function bind(fn, ctx) {
  fn = typeof fn.originalFunction === "function" && fn.originalFunction || fn;
  let boundFn = function() {
    return fn.apply(ctx, arguments);
  };
  boundFn.originalFunction = fn;
  return boundFn;
};

const isArray = function isArray(a) {
  if (typeof Array.isArray === "function")
    return Array.isArray(a);
  else
    return a instanceof Array;
};
exports.isArray = isArray;

exports.isObjectButNotArray = function isObjectButNotArray(o) {
  return !isArray(o) && (typeof o === "object")
};

exports.isSubclass = function isSubclass(A, B) {
  return A.prototype instanceof B
};

exports.isUndefined = function isUndefined(u) {
  return typeof u === "undefined"
};

exports.isString = function isString(s) {
  return typeof s === "string"
};

exports.isFunction = function isFunction(f) {
  return typeof f === "function"
};

module.exports = exports;
