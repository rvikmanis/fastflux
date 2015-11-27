var assign = module.exports.assign = require('object-assign');

var clone = module.exports.clone = function(object) {
  return assign({}, object);
}

var isObservable = module.exports.isObservable = function(object) {
  return typeof object === 'object' &&
   typeof object.subscribe === 'function' &&
   typeof object.unsubscribe === 'function'
};
