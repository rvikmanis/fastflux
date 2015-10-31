var MockBrowser = require('mock-browser').mocks.MockBrowser;
global.window = MockBrowser.createWindow();
global.document = window.document;
global.navigator = window.navigator;

var utils = require('../utils');
var createSubscriber = require('../core/subscriber');
var _ = require('../core/store'),
 createStore = _.createStore;
var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var shallow = ReactTestUtils.createRenderer();
var shallowChild = ReactTestUtils.createRenderer();


function FooComponent() {
  React.Component.apply(this, arguments);
}
FooComponent.prototype = utils.create(React.Component.prototype);
FooComponent.prototype.constructor = FooComponent;

FooComponent.prototype.render = function render() {
  return React.createElement("div", {id: "foo"}, this.props.greeting + ", " + this.props.name + "!");
};


describe('Subscriber:', function() {

    var store;
    var Subscriber;
    var update;
    var mountPoint;
    var getRenderedText;

    beforeAll(function() {
      store = createStore("World", function(state, message) {
        if (message.type === "update") return message.state;
        return state;
      });
      update = function update(name) {
        store.send({"type": "update", state: name});
      };
      Subscriber = createSubscriber(FooComponent);
      mountPoint = document.createElement("div");
      document.body.appendChild(mountPoint);
      getRenderedText = function() { return document.querySelector("#foo").textContent }
    });

    it('renders successfully', function() {
      ReactDOM.render(React.createElement(Subscriber, {name: store, greeting: "Hello"}), mountPoint);
      expect(getRenderedText()).toEqual("Hello, World!");
    });

    it('updates successfully', function() {
      update("Mars");
      expect(getRenderedText()).toEqual("Hello, Mars!");
    });

    it('unmounts successfully', function() {
      var r = ReactDOM.unmountComponentAtNode(mountPoint);
      expect(r).toBe(true);
      expect(getRenderedText).toThrow();
    });

});
