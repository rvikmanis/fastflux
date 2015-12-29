# Fastflux

[![Downloads](https://img.shields.io/npm/dt/fastflux.svg?style=flat-square)](https://www.npmjs.com/package/fastflux)
[![Downloads/month](https://img.shields.io/npm/dm/fastflux.svg?style=flat-square)](https://www.npmjs.com/package/fastflux)

- [Introduction](#introduction)
- [Architecture overview](#architecture-overview)
  - [Concepts](#concepts)
  - [Goals](#goals)
- [Installation](#installation)
- [Usage](#usage)
  - [Create store](#create-store)
  - [Create action](#create-action)
  - [Create components](#create-components)
- [Tooling integration](#tooling-integration)
  - [ES6 with Babel and webpack](#es6-with-babel-and-webpack)
- [API Reference](http://rvikmanis.github.io/fastflux/identifiers.html)

## Introduction

Simple and powerful application state management for [React](https://facebook.github.io/react/),
based on the [Flux architecture](https://facebook.github.io/flux/). Implemented with
[functional reactive](https://en.wikipedia.org/wiki/Functional_reactive_programming)
primitives: single-event stream -- `Observable` ([API](http://rvikmanis.github.io/fastflux/class/src/core/observable/base.js~Observable.html)), and its stateful
counterpart -- `ObservableState` ([API](http://rvikmanis.github.io/fastflux/class/src/core/observable/state.js~ObservableState.html)).

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

*Fastflux is a particular implementation of this architecture*

Further info about the Flux architecture:
* [Official documentation](https://facebook.github.io/flux/docs/overview.html#content)
* [Reference implementation](https://github.com/facebook/flux)

## Architecture overview

How data flows in a typical Fastflux application:

![Data flow](http://s9.postimg.org/eexgjcn27/fastflux.png)

### Concepts

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

### Goals

1. Readability comes first.
2. *Experiment!*
3. FRP at the core:
  - everything is observable;
  - ubiquitous functional transformations -- map, filter, reduce.
4. Zero boilerplate.
5. Small footprint.
6. Sane, fully documented API.
7. ES6 classes.

## Installation

Install from npm:

```plain
npm install --save fastflux
```

## Usage

These are ES6 examples.

If you're not familiar with the tools required to
run ES6, see [ES6 with Babel and webpack](#es6-with-babel-and-webpack).

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
import {createAction} from 'fastflux';

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

## Tooling integration

### ES6 with Babel and webpack

Install toolchain from npm:

```plain
npm install webpack babel-loader babel-core \
 babel-preset-es2015-loose babel-preset-react --save-dev
```

Create a file `webpack.config.js`:

```js
module.exports = {
    entry: "./index.js",
    output: {
        filename: "bundle.js"
    },
    context: __dirname,
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['react', 'es2015-loose']
            }
        }]
    },
    resolve: {
        extensions: ["", ".js", ".jsx"]
    },
};

```

Now to make sure it works, create a file `index.js` (the entry point):

```js
import {createAction} from 'fastflux';

window.sayHello = createAction(emit => (text="Hello") => emit(text));
window.sayHello.subscribe(greeting => console.log("Greeting:", greeting));
```

Run webpack:

```plain
./node_modules/.bin/webpack
```

`bundle.js` should contain compiled bundle
with dependencies.

Use in a web page like this:

```html
<script src="bundle.js"></script>
```

##### What next?

- Run examples from the [Usage](#usage) section
- [Explore the API](http://rvikmanis.github.io/fastflux/identifiers.html)
- Check out the [Architecture overview](#architecture-overview)
