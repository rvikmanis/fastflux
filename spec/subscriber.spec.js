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
  return document.getElementById("foo").textContent
}

function FooComponent() {
  React.Component.apply(this, arguments);
}
FooComponent.prototype = Object.create(React.Component.prototype);
FooComponent.prototype.constructor = FooComponent;

FooComponent.prototype.render = function render() {
  return React.createElement("div", {id: "foo"},
                             this.props.greeting + ", " + this.props.name + "!")
};
FooComponent.defaultProps = { name: "Guest", greeting: "Welcome" };
FooComponent = createSubscriber(FooComponent);


describe('Subscriber:', function() {

    var store;
    var observable;
    var mountPoint;
    var render;

    beforeAll(function() {
      store = createStore({
        getInitialState: function() { return "World" },
        reducer: function(state, message) {
          if (message.type === "update") state = message.state;
          return state;
        }
      });
      observable = new Observable;

      mountPoint = document.createElement("div");
      document.body.appendChild(mountPoint);
      render = function render(props) {
        return ReactDOM.render(React.createElement(
          FooComponent,
          props || null
        ), mountPoint);
      }
    });


    describe('(With store as observable)', function() {
      it('renders successfully', function() {
        render({name: store, greeting: "Hello"});
        expect(getRenderedText()).toEqual("Hello, World!");
      });

      it('updates successfully', function() {
        store.send({"type": "update", state: "friend"});
        expect(getRenderedText()).toEqual("Hello, friend!");
      });

      it('handles normal prop change', function() {
        render({name: store, greeting: "Greetings"});
        expect(getRenderedText()).toEqual("Greetings, friend!");
      });

      it('raises an error when attempting to replace non-observable prop with observable',
         function() {
           expect(function() {
             render({name: store, greeting: observable});
           }).toThrow();
         }
      );

      it('handles normal prop deletion', function() {
        render({name: store});
        expect(getRenderedText()).toEqual("Welcome, friend!");
      });

      it('raises an error when attempting to remove observable prop',
         function() {
           expect(function() {
             render();
           }).toThrow();
         }
      );

      it('raises an error when attempting to replace observable prop with another observable',
         function() {
           expect(function() {
             render({name: observable});
           }).toThrow();
         }
      );

      it('raises an error when attempting to change observable prop to normal',
         function() {
           expect(function() {
             render({name: "Rudolfs"});
           }).toThrow();
         }
      );

      it('raises an error when attempting to add new observable prop',
         function() {
           expect(function() {
             render({name: store, greeting: observable});
           }).toThrow();
         }
      );

      it('handles normal prop adding', function() {
        render({name: store, greeting: "Sup"});
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
        render({name: observable});
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
