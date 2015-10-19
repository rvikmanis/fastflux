'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var assign = require('object-assign');

module.exports = function Plugin(_ref) {
  var _this = this;

  var setUp = _ref.setUp;
  var tearDown = _ref.tearDown;
  var options = _ref.options;

  var rest = _objectWithoutProperties(_ref, ['setUp', 'tearDown', 'options']);

  _classCallCheck(this, Plugin);

  this.setUp = setUp;
  this.tearDown = tearDown;
  this.options = assign({}, options);
  Object.getOwnPropertyNames(rest).forEach(function (name) {
    _this[name] = rest[name];
  });

  this.configure = function () {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    options = assign({}, this.options, options);
    return new this.constructor(_extends({ setUp: setUp, tearDown: tearDown, options: options }, rest));
  };
};