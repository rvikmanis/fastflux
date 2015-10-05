"use strict";

module.exports = function handler(messageType) {
  return function (target, name, descriptor) {
    var fn = descriptor.value;
    fn.handlesMessageType = messageType;
    return descriptor;
  };
};