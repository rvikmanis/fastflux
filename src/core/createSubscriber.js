import Observable from './Observable.js'
import {assign} from './utils.js';
import {Component, createElement} from 'react';


/**
 * Higher-order React component, automatically subscribes to
 * {@link Observable} props.
 *
 * @example
 * const text = Observable.stateful("Foo")
 *
 * const Label = createSubscriber(class extends React.Component {
 *   render() {
 *     return <div>{this.props.text}</div>
 *   }
 * })
 *
 * // Render <Label> with text "Foo"
 * ReactDOM.render(<Label text={text} />, mountPoint)
 *
 * // After 1 second change text to "Bar"
 * setTimeout(() => text.emit("Bar"), 1000)
 *
 * @param {React.Component} component - the component to wrap
 * @returns {React.Component}
 */
export default function createSubscriber(component) {

  let wrapper = function(props, context) {
    Component.call(this, props, context);

    this.normalProps = {};
    this.observableProps = {};
    this.updaters = {};

    let state = {};

    for (let k in this.props) {
      let prop = this.props[k];
      if (!(prop instanceof Observable)) this.normalProps[k] = prop;
      else {
        this.observableProps[k] = prop;
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
          throw new Error("Cannot change an observable state prop once initialized. " +
           "To change the value, call emit")
      }
      for (let k in this.normalProps) {
        if (nextProps[k] === void 0) delete this.normalProps[k];
      }
      for (let k in nextProps) {
        let prop = nextProps[k];
        if (!(k in this.observableProps)) {
          if (!(prop instanceof Observable)) this.normalProps[k] = prop;
          else throw new Error("Cannot change non-observable prop to observable once initialized")
        }
      }
    }},

    render: {value: function() {
      return createElement(
        component,
        assign({}, this.normalProps, this.state)
      )
    }}

  });

  return wrapper;

};
