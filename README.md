# Fastflux

[![Downloads](https://img.shields.io/npm/dt/fastflux.svg?style=flat-square)](https://www.npmjs.com/package/fastflux)
[![Downloads/month](https://img.shields.io/npm/dm/fastflux.svg?style=flat-square)](https://www.npmjs.com/package/fastflux)

- [Introduction](#introduction)
- [Architecture overview](#architecture-overview)
- [Installation](#installation)
- [Usage](#usage)
  - [Create store](#create-store)
  - [Create action](#create-action)
  - [Create components](#create-components)
- [API Reference](http://rvikmanis.github.io/fastflux/identifiers.html)

## Introduction

Simple and powerful application state management for [React](https://facebook.github.io/react/),
based on the [Flux architecture](https://facebook.github.io/flux/). Implemented with a
[functional reactive](https://en.wikipedia.org/wiki/Functional_reactive_programming)
mindset.

In MVC parlance Fastflux is the *Model*.

### Why?

React is a view component library, not a web framework; it renders application state,
but says nothing on how to manage that state across your application.

When starting out with React, that is never a problem: state can be defined
in a root component and passed down to the rest of the tree by props.
This approach is workable, for very simple applications.

If however, you're building something non-trivial (the bar for triviality being very low here),
you'll likely have multiple deeply nested trees of components. Passing state and
callbacks by props through every level would be tedious and frustrating.  

The solution is to use the modular message driven architecture, called Flux,
in which **state is decoupled from components** --
defined separately and passed directly to the components that need it. So
instead of constantly having to update byzantine prop hierarchies,
you get more time to design and implement your application.

*Fastflux is a particular implementation of this architecture, based on functional
reactive primitives:<br>
a single-event stream -- *`Observable`*, and its stateful
counterpart -- *`ObservableState`*.*

Further info about the Flux architecture:
* [Official documentation](https://facebook.github.io/flux/docs/overview.html#content)
* [Reference implementation](https://github.com/facebook/flux)

## Do we need yet another Flux library?

Yeah, we do.

## Architecture overview

How data flows in a typical Fastflux application:

![Data flow](http://s9.postimg.org/eexgjcn27/fastflux.png)

- **Stores** are state containers, coupled with one or more reducers.
- **Reducers** -- pure functions describing the transformation of state in response to messages.
- **Messages** -- plain objects identified by `type`, optionally containing data fields.
  - Used to signal stores about some event (data received from server, user pressed key etc.).
  - Known in classic Flux as *actions*.
- **Actions** are self-contained asynchronous functions for a concrete task (create post, logout user etc.).
  - Usually invoked by views, other actions or events from the environment.
  - Subscribers are stores, other actions and views.
  - When subscribed by stores, emitted payload MUST be a message.
  - Can emit zero or more times per invocation.
  - IO and side effects are permitted.
  - You may think of actions as async
  *action creators* from classic Flux, when subscribed by stores.
- **Views** are React components.
  - Should listen to stores for state changes.
  - May listen to actions directly, without polluting the stores, when a short
  feedback cycle is desired.
  - *Subscriber view* is a special type of higher-order view component that automatically
  subscribes to stores passed as props.

<br>
There is no central dispatcher -- stores subscribe to the actions they need.

## Installation

Install from npm:

```plain
npm install --save fastflux
```

## Usage

These are ES6 examples.

### Create store

```js
import {createStore} from 'fastflux';

let items = createStore({
  getInitialState() {return []},

  reducers: {

    add(state, {text}) {
      return state.concat([text])
    }

  }
});
```

### Create action

```js
import {createStore} from 'fastflux';

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
;["bar", "foobar", "baz"].forEach(addItem)
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
