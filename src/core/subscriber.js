const {isObservable, assign, create} = require('../utils');
const {Component, createElement: el} = require('react');


module.exports = function createSubscriber(wrappedComponent) {

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
        if (typeof prop.getState !== "function")
          state[k] = null;
        else
          state[k] = prop.getState()
      }
    }

    this.state = state;
  };

  wrapper.prototype = create(Component.prototype, {

    constructor: {value: wrapper},

    componentWillMount: {value: function() {
      for (let k in this.observableProps) {
        let observable = this.observableProps[k];
        let updater = this.updaters[k] = state => {
          let updated = {};
          updated[k] = state;
          this.setState(updated);
        };
        observable.observe(updater);
      }
    }},

    componentWillUnmount: {value: function() {
      for (let k in this.updaters) {
        this.observableProps[k].unobserve(this.updaters[k]);
        delete this.updaters[k];
      }
    }},

    render: {value: function() {
      return el(wrappedComponent,
                assign({}, this.normalProps, this.state))
    }}

  });

  return wrapper;

};
