var _require = require('../utils');

const isObservable = _require.isObservable;
const assign = _require.assign;

var _require2 = require('react');

const Component = _require2.Component;
const el = _require2.createElement;

module.exports.createSubscriber = function createSubscriber(wrappedComponent) {

  var wrapper = function (props, context) {
    Component.call(this, props, context);

    this.normalProps = {};
    this.observableProps = {};
    this.updaters = {};

    var state = {};

    for (var k in this.props) {
      var prop = this.props[k];
      if (!isObservable(prop)) this.normalProps[k] = prop;else {
        this.observableProps[k] = prop;
        if (typeof prop.getState === "function") state[k] = prop.getState();
      }
    }

    this.state = state;
  };

  wrapper.prototype = Object.create(Component.prototype, {

    constructor: { value: wrapper },

    componentWillMount: { value: function () {
        var _this = this;

        var _loop = function (k) {
          var observable = _this.observableProps[k];
          var updater = _this.updaters[k] = function (state) {
            var updated = {};
            updated[k] = state;
            _this.setState(updated);
          };
          observable.observe(updater);
        };

        for (var k in this.observableProps) {
          _loop(k);
        }
      } },

    componentWillUnmount: { value: function () {
        for (var k in this.updaters) {
          this.observableProps[k].unobserve(this.updaters[k]);
          delete this.updaters[k];
        }
      } },

    componentWillReceiveProps: { value: function (nextProps) {
        for (var k in this.observableProps) {
          if (nextProps[k] !== this.observableProps[k]) throw new Error("Cannot change observable prop once initialized. " + "To change the value, call emit");
        }
        for (var k in this.normalProps) {
          if (nextProps[k] === undefined) delete this.normalProps[k];
        }
        for (var k in nextProps) {
          var prop = nextProps[k];
          if (!(k in this.observableProps)) {
            if (!isObservable(prop)) this.normalProps[k] = prop;else throw new Error("Cannot change non-observable prop to observable once initialized");
          }
        }
      } },

    render: { value: function () {
        return el(wrappedComponent, assign({}, this.normalProps, this.state));
      } }

  });

  return wrapper;
};