if (typeof window === 'undefined') {
  global.window = require('mock-browser').mocks.MockBrowser.createWindow();
  global.document = window.document;
  global.navigator = window.navigator;
}

var React = require('react');
var ReactDOM = require('react-dom');

var utils = require('../utils');
var createSubscriber = require('../core/subscriber').createSubscriber;
var createStore = require('../core/store').createStore;
var Observable = require('../core/observable').Observable;


function getRenderedText() {
  return document.querySelector("#foo").textContent
}

function FooComponent() {
  React.Component.apply(this, arguments);
}
FooComponent.prototype = Object.create(React.Component.prototype);
FooComponent.prototype.constructor = FooComponent;

FooComponent.prototype.render = function render() {
  return React.createElement("div", {id: "foo"}, this.props.greeting + ", " + this.props.name + "!");
};
FooComponent.defaultProps = { name: "Guest", greeting: "Welcome" };
FooComponent = createSubscriber(FooComponent);


describe('Subscriber:', function() {

    var store;
    var observable;
    var mountPoint;

    beforeAll(function() {
      store = createStore("World", function(state, message) {
        if (message.type === "update") state = message.state;
        return state;
      });
      observable = new Observable;
      mountPoint = document.createElement("div");
      document.body.appendChild(mountPoint);
    });


    describe('(With store as observable)', function() {
      it('renders successfully', function() {
        ReactDOM.render(React.createElement(FooComponent, {name: store, greeting: "Hello"}), mountPoint);
        expect(getRenderedText()).toEqual("Hello, World!");
      });

      it('updates successfully', function() {
        store.send({"type": "update", state: "friend"});
        expect(getRenderedText()).toEqual("Hello, friend!");
      });

      it('handles normal prop change', function() {
        ReactDOM.render(React.createElement(FooComponent, {name: store, greeting: "Greetings"}), mountPoint);
        expect(getRenderedText()).toEqual("Greetings, friend!");
      });

      it('raises an error when attempting to replace non-observable prop with observable',
         function() {
           expect(function() {
             ReactDOM.render(React.createElement(FooComponent, {name: store, greeting: observable}), mountPoint)
           }).toThrow();
         }
      );

      it('handles normal prop deletion', function() {
        ReactDOM.render(React.createElement(FooComponent, {name: store}), mountPoint);
        expect(getRenderedText()).toEqual("Welcome, friend!");
      });

      it('raises an error when attempting to remove observable prop',
         function() {
           expect(function() {
             ReactDOM.render(React.createElement(FooComponent), mountPoint);
           }).toThrow();
         }
      );

      it('raises an error when attempting to replace observable prop with another observable',
         function() {
           expect(function() {
             ReactDOM.render(React.createElement(FooComponent, {name: observable}), mountPoint);
           }).toThrow();
         }
      );

      it('raises an error when attempting to change observable prop to normal',
         function() {
           expect(function() {
             ReactDOM.render(React.createElement(FooComponent, {name: "Rudolfs"}), mountPoint);
           }).toThrow();
         }
      );

      it('raises an error when attempting to add new observable prop',
         function() {
           expect(function() {
             ReactDOM.render(React.createElement(FooComponent, {name: store, greeting: observable}), mountPoint)
           }).toThrow();
         }
      );

      it('handles normal prop adding', function() {
        ReactDOM.render(React.createElement(FooComponent, {name: store, greeting: "Sup"}), mountPoint);
        expect(getRenderedText()).toEqual("Sup, friend!");
      });

      it('unmounts successfully', function() {
        var r = ReactDOM.unmountComponentAtNode(mountPoint);
        expect(r).toBe(true);
        expect(getRenderedText).toThrow();
      });
    });

    describe('(With plain observable)', function() {
      it('renders successfully', function() {
        ReactDOM.render(React.createElement(FooComponent, {name: observable}), mountPoint);
        expect(getRenderedText()).toEqual("Welcome, Guest!");
      });

      it('updates successfully', function() {
        observable.emit("Rudolfs");
        expect(getRenderedText()).toEqual("Welcome, Rudolfs!");
      });

      it('unmounts successfully', function() {
        var r = ReactDOM.unmountComponentAtNode(mountPoint);
        expect(r).toBe(true);
        expect(getRenderedText).toThrow();
      });
    });

});
