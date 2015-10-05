"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require("react");
var assign = require("object-assign");
var bind = require("../utils").bind;

module.exports = {

  subscribe: function subscribe() {
    for (var _len = arguments.length, storeIds = Array(_len), _key = 0; _key < _len; _key++) {
      storeIds[_key] = arguments[_key];
    }

    var app = this;
    return function (ComposedComponent) {
      return (function (_React$Component) {
        _inherits(_class, _React$Component);

        function _class() {
          _classCallCheck(this, _class);

          _React$Component.apply(this, arguments);

          this.state = {};
          this.onStoreChange = bind(this._onStoreChange, this);
        }

        _class.prototype.componentDidMount = function componentDidMount() {
          var _this = this;

          var update = {};

          storeIds.forEach(function (id) {
            var store = app.getStore(id);
            update[id] = store.getState();
            store.listen(_this.onStoreChange);
          });

          this.setState(update);
        };

        _class.prototype.componentWillUnmount = function componentWillUnmount() {
          var _this2 = this;

          storeIds.map(bind(app.getStore, app)).forEach(function (store) {
            return store.unlisten(_this2.onStoreChange);
          });
        };

        _class.prototype._onStoreChange = function _onStoreChange() {
          var update = {};
          storeIds.forEach(function (id) {
            return update[id] = app.getStore(id).getState();
          });
          this.setState(update);
        };

        _class.prototype.render = function render() {
          var props = assign({}, this.props, this.state);
          return React.createElement(ComposedComponent, props);
        };

        return _class;
      })(React.Component);
    };
  }

};