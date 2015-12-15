# Fastflux

[![Documentation Status](https://doc.esdoc.org/github.com/rvikmanis/fastflux/badge.svg)](https://doc.esdoc.org/github.com/rvikmanis/fastflux)

A lightweight message driven flux implementation written in ES6,
inspired by [FRP](https://en.wikipedia.org/wiki/Functional_reactive_programming),
the [original Flux](https://facebook.github.io/flux/docs/overview.html)
and [Redux](https://github.com/rackt/redux).

**[API reference](https://doc.esdoc.org/github.com/rvikmanis/fastflux)**

## Installation

Install from npm:

```bash
npm install fastflux
```

## Getting started

This introduction assumes familiarity with ES6 and React.

### Create your first store and action

```js
import {createStore, createAction} from 'fastflux';

// Define store
let items = createStore({
  getInitialState() {return []},

  reducers: {

    add(state, {text}) {
      return state.concat([text])
    }

  }
});

// Define action
let addItem = createAction(emit => text => {
  emit({type: "add", text})
});

// Link action to store
addItem.subscribe(items.send);

```

##### Setup logging

```js
// Log state over time
items.subscribe(s => console.log("State of `items`:", s))

// While we're at it, let's create some items
["bar", "foobar", "baz"].forEach(addItem);
```

Open the console, you will see something like this:

```plain
State of `items`: ["bar"]
State of `items`: ["bar", "foobar"]
State of `items`: ["bar", "foobar", "baz"]
```

### Create components

```js
import {createSubscriber} from 'fastflux';
import {Component} from 'react';

// Define root component
class ControllerView extends Component {
  render() {
    // State of the `items` store is bound to `this.props.items`
    let items = this.props.items.map(item => <li>{item}</li>);
    return <div>
      <ul>{items}</ul>
      <NewItemInput />
    </div>;
  }
}

// Subscriber observes stores it receives through props:
// When a store emits new state, subscriber updates the
// wrapped component's prop of the same name.
ControllerView = createSubscriber(ControllerView);


class NewItemInput extends Component {

  INITIAL_VALUE = "";
  state = {value: this.INITIAL_VALUE};

  onKeyDown = (e) => {
    // Invoke action!
    addItem(e.target.value);
    this.setState({value: this.INITIAL_VALUE});
  };

  onChange = (e) => {
    this.setState({value: e.target.value});
  };

  render() {
    return <input
      type="text"
      onKeyDown={this.onKeyDown}
      onChange={this.onChange}
      value={this.state.value}
    />
  }

}
```

##### Render

Assuming you have `<div id="mount"></div>` in your document body:

```js
import {render} from 'react-dom';
render(<ControllerView items={items}>, document.querySelector("#mount"))
```
