const {isObservable, assign} = require('../utils');
const {Component, createElement: el} = require('react');


module.exports.createSubscriber = function createSubscriber(wrappedComponent) {

  let wrapper = function(props, context) {
    Component.call(this, props, context);

    this.normalProps = {};
    this.observableProps = {};
    this.updaters = {};

    let state = {};

    for (let k in this.props) {
      let prop = this.props[k];
      if (!isObservable(prop)) this.normalProps[k] = prop;
      else {
        this.observableProps[k] = prop;
        if (typeof prop.getState === "function")
          state[k] = prop.getState()
      }
    }

    this.state = state;
  };

  wrapper.prototype = Object.create(Component.prototype, {

    constructor: {value: wrapper},

    componentWillMount: {value: function() {
      for (let k in this.observableProps) {
        let observable = this.observableProps[k];
        let updater = this.updaters[k] = state => {
          let updated = {};
          updated[k] = state;
          this.setState(updated);
        };
        observable.subscribe(updater);
      }
    }},

    componentWillUnmount: {value: function() {
      for (let k in this.updaters) {
        this.observableProps[k].unsubscribe(this.updaters[k]);
        delete this.updaters[k];
      }
    }},

    componentWillReceiveProps: {value: function(nextProps) {
      for (let k in this.observableProps) {
        if (nextProps[k] !== this.observableProps[k])
          throw new Error("Cannot change observable prop once initialized. " +
           "To change the value, call emit")
      }
      for (let k in this.normalProps) {
        if (nextProps[k] === undefined) delete this.normalProps[k];
      }
      for (let k in nextProps) {
        let prop = nextProps[k];
        if (!(k in this.observableProps)) {
          if (!isObservable(prop)) this.normalProps[k] = prop;
          else throw new Error("Cannot change non-observable prop to observable once initialized")
        }
      }
    }},

    render: {value: function() {
      return el(wrappedComponent,
                assign({}, this.normalProps, this.state))
    }}

  });

  return wrapper;

};
