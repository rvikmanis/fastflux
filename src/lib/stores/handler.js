module.exports = function handler(messageType) {
  return (target, name, descriptor) => {
    const fn = descriptor.value;
    fn.handlesMessageType = messageType;
    return descriptor;
  }
};