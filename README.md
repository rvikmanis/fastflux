# Fastflux

A lightweight message driven flux implementation written in ES6,
inspired by [FRP](https://en.wikipedia.org/wiki/Functional_reactive_programming),
the [original Flux](https://facebook.github.io/flux/docs/overview.html)
and [Redux](https://github.com/rackt/redux).

## Installation

Install from npm:

```plain
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

// Define input
class ItemInput extends Component {

  state = {value: ""};

  onKeyDown = (e) => {
    if (e.key === "Enter") {
      // Invoke action
      addItem(e.target.value);
      this.clearValue();
    }
  };

  onChange = (e) => {
    this.setValue(e.target.value)
  };

  setValue = (value) => this.setState({value});
  clearValue = () => this.setValue("");

  render() {
    return <input
      type="text"
      onKeyDown={this.onKeyDown}
      onChange={this.onChange}
      value={this.state.value}
    />
  }

}

// Define root component
function ControllerView(props) {
  // `props.items` contains current state of the `items` store
  let items = props.items.map(item => <li>{item}</li>);
  return <div>
    <ul>{items}</ul>
    <ItemInput />
  </div>;
}

// Subscriber observes stores passed in props:
// When a store emits new state, subscriber updates wrapped component's prop.
ControllerView = createSubscriber(ControllerView);
let rootComponent = <ControllerView items={items}>;
```

##### Render

Assuming you have `<div id="mount"></div>` in your document body:

```js
import {render} from 'react-dom';
render(rootComponent, document.querySelector("#mount"))
```
