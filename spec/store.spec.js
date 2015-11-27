var utils = require('../utils');
var _ = require('../core/store'),
 createStore = _.createStore,
 Store = _.Store;

describe('Store:', function() {

    var REDUCERS;
    var ComparableState;

    beforeAll(function() {

      ComparableState = {
        equals: function(other) {
          if (other.sum !== this.sum) return false;
          if (other.items.length !== this.items.length) return false;
          for (var i = 0; i < other.length; i++) {
            if (this.items[i] !== other.items[i]) return false;
          }
          return true;
        }
      };

      REDUCERS = {

        append: function(state, message) {
          return utils.assign(Object.create(ComparableState), state, {
            items: state.items.concat([Number(message.item)]),
            sum: null
          })
        },

        clear: function(state, message) {
          return utils.assign(Object.create(ComparableState), state, {
            items: [], sum: null
          });
        },

        sum: function(state, message) {
          return utils.assign(Object.create(ComparableState), state, {
            sum: state.items.reduce(function(p, c) { return p + c }, null)
          })
        },

        simple: function (state, message) {
          return utils.assign({}, state, {
            lastMessage: message
          })
        }

      }

    });

    describe('(When attempting to pass wrong args or call illegal methods)', function() {

      describe('#createStore(state: undefined, reducers: undefined)', function() {
        it('raises an error', function() {
          expect(function() {createStore()}).toThrow();
        });
      });

      describe('#createStore(state: any, reducers: undefined)', function() {
        it('raises an error', function() {
          expect(function() {createStore(null)}).toThrow();
        });
      });

      describe('#createStore(state: undefined, reducers: function|object)', function() {
        it('raises an error', function() {
          expect(function() {createStore(undefined, REDUCERS.simple)}).toThrow();
          expect(function() {createStore(undefined, {simple: REDUCERS.simple})}).toThrow();
        });
      });

      describe('#emit(...any)', function() {
        it('raises an error', function() {
          var store = createStore({}, REDUCERS.simple);
          expect(function() { store.emit() }).toThrow();
          expect(function() { store.emit({}) }).toThrow();
          expect(function() { store.emit("foo", "bar") }).toThrow();
        });
      });

    });

    describe('(With one reducer and non-comparable state)', function() {

      var store;
      var reducer;
      var observedStateTransitions;
      var observer;

      beforeAll(function() {
        reducer = jasmine.createSpy("reducer", REDUCERS.simple).and.callThrough();
        observedStateTransitions = [];
        observer = function(state) {
          observedStateTransitions.push(state);
        };
      });

      describe('#createStore(state: any, reducer: function)', function() {

        it('creates store with initial state and one reducer', function() {
          store = createStore({}, reducer);
          expect(store.getState()).toEqual({});
          expect(store._reducers).toBe(reducer);
        });

      });

      describe('#observe(callback: function)', function() {
        it('adds callback to listeners', function() {
          store.subscribe(observer);
          expect(store._listeners).toContain(observer);
        });
        it('raises an error when trying to add the same callback more than once', function() {
          expect(function() { store.subscribe(observer) }).toThrow()
        });
      });

      describe('#send(message: message, context?: any)', function() {

        var ctx;

        function allContext(calls) {
          return calls.all().map(function(i) { return i.object })
        }

        beforeAll(function() {
          ctx = {foobar: "bazbaz"};
          observedStateTransitions = [];
          store.send({type: "foo"});
          store.send({type: "bar"});
          store.send({type: "bar"}, ctx);
          store.send({type: "baz"});
        });

        it('calls reducer with state and message for each message it gets', function() {
          expect(store._reducers.calls.count()).toBe(4);
          expect(store._reducers.calls.allArgs()).toEqual([
           [{}, {type: "foo"}],
           [{lastMessage: {type: "foo"}}, {type: "bar"}],
           [{lastMessage: {type: "bar"}}, {type: "bar"}],
           [{lastMessage: {type: "bar"}}, {type: "baz"}]
          ]);
        });

        it('passes 2nd argument or empty object to reducer\'s "this" context', function() {
          expect(allContext(store._reducers.calls)).toEqual([
           {}, {}, ctx, {}
          ]);
        });

        it('emits state to all observers regardless of actual changes', function() {
          expect(observedStateTransitions.length).toBe(4);
          expect(observedStateTransitions).toEqual([
           {lastMessage: {type: "foo"}},
           {lastMessage: {type: "bar"}},
           {lastMessage: {type: "bar"}},
           {lastMessage: {type: "baz"}}
          ]);
        });

      });

      describe('#unobserve(callback: function)', function() {
        it('removes callback from listeners', function() {
          store.unsubscribe(observer);
          expect(store._listeners).not.toContain(observer);
        });
        it('raises an error when trying to remove something that is not a callback', function() {
          expect(function() { store.unsubscribe(observer) }).toThrow()
        });
      });

      describe('#getState()', function() {

        it('returns the current state of the store', function() {
          expect(store.getState()).toEqual({lastMessage: {type: "baz"}})
        });

      });

    });

    describe('(With multiple reducers and comparable state)', function() {

      var store;
      var reducers;
      var initialState;
      var observedStateTransitions;
      var observer;

      beforeAll(function() {
        reducers = {
          append: jasmine.createSpy("append", REDUCERS.append).and.callThrough(),
          clear: jasmine.createSpy("clear", REDUCERS.clear).and.callThrough(),
          sum: jasmine.createSpy("sum", REDUCERS.sum).and.callThrough()
        };
        initialState = {items: [], sum: null};
        observedStateTransitions = [];
        observer = function(state) {
          observedStateTransitions.push(state);
        };
      });

      describe('#createStore(state: any, reducers: {messageType: function})', function() {

        it('creates store with initial state and multiple reducers', function() {
          store = createStore(initialState, reducers);
          expect(store.getState()).toEqual(initialState);
          expect(store._reducers).toEqual(reducers);
        });

      });

      describe('#observe(callback: function)', function() {
        it('adds callback to listeners', function() {
          store.subscribe(observer);
          expect(store._listeners).toContain(observer);
        });
      });

      describe('#send(message: message, context?: any)', function() {

        var ctx;

        function allContext(calls) {
          return calls.all().map(function(i) { return i.object })
        }

        beforeAll(function() {
          ctx = {foobaz: "bar"};
          store.send({type: "append", item: 10});
          store.send({type: "append", item: 5});
          store.send({type: "sum"}, ctx);
          store.send({type: "baz"});
          store.send({type: "append", item: 19});
          store.send({type: "sum"});
          store.send({type: "clear"});
          store.send({type: "sum"});
          store.send({type: "append", item: 42});
        });

        it('calls reducers with state and message for each message ' +
           'that matches one of the reducers\' message type', function() {
             expect(store._reducers.append.calls.count()).toBe(4);
             expect(store._reducers.sum.calls.count()).toBe(3);
             expect(store._reducers.clear.calls.count()).toBe(1);

             expect(store._reducers.append.calls.allArgs()).toEqual([
              [initialState, {type: "append", item: 10}],
              [{sum: null, items: [10]}, {type: "append", item: 5}],
              [{sum: 15, items: [10, 5]}, {type: "append", item: 19}],
              [initialState, {type: "append", item: 42}]
             ]);

             expect(store._reducers.sum.calls.allArgs()).toEqual([
              [{sum: null, items: [10, 5]}, {type: "sum"}],
              [{sum: null, items: [10, 5, 19]}, {type: "sum"}],
              [initialState, {type: "sum"}]
             ]);

             expect(store._reducers.clear.calls.allArgs()).toEqual([
              [{sum: 34, items: [10, 5, 19]}, {type: "clear"}]
             ]);
        });

        it('passes 2nd argument or empty object to reducer\'s "this" context', function() {
          expect(allContext(store._reducers.append.calls)).toEqual([
           {}, {}, {}, {}
          ]);

          expect(allContext(store._reducers.sum.calls)).toEqual([
           {foobaz: "bar"}, {}, {}
          ]);

          expect(allContext(store._reducers.clear.calls)).toEqual([
           {}
          ]);
        });

        it('emits state to all observers if state has changed', function() {
          expect(observedStateTransitions.length).toBe(7);
          expect(observedStateTransitions).toEqual([
           {sum: null, items: [10]},
           {sum: null, items: [10, 5]},
           {sum: 15, items: [10, 5]},
           {sum: null, items: [10, 5, 19]},
           {sum: 34, items: [10, 5, 19]},
           initialState,
           {sum: null, items: [42]}
          ]);
        });

      });

      describe('#unobserve(callback: function)', function() {
        it('removes callback from listeners', function() {
          store.unsubscribe(observer);
          expect(store._listeners).not.toContain(observer);
        });
      });

      describe('#getState()', function() {

        it('returns the current state of the store', function() {
          expect(store.getState()).toEqual({sum: null, items: [42]})
        });

      });

    });

});
