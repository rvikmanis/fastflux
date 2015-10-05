"use strict";

exports.bind = function bind(fn, ctx) {
  fn = typeof fn.originalFunction === "function" && fn.originalFunction || fn;
  var boundFn = function boundFn() {
    return fn.apply(ctx, arguments);
  };
  boundFn.originalFunction = fn;
  return boundFn;
};

exports.isSubclass = function isSubclass(A, B) {
  return A.prototype instanceof B;
};

module.exports = exports;