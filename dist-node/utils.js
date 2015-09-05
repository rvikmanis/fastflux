"use strict";

exports.bind = function bind(fn, ctx) {
  fn = typeof fn.originalFunction === "function" && fn.originalFunction || fn;
  var boundFn = function boundFn() {
    return fn.apply(ctx, arguments);
  };
  boundFn.originalFunction = fn;
  return boundFn;
};

module.exports = exports;