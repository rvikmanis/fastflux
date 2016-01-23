# Fastflux

[![Downloads](https://img.shields.io/npm/dt/fastflux.svg?style=flat-square)](https://www.npmjs.com/package/fastflux)
[![Downloads/month](https://img.shields.io/npm/dm/fastflux.svg?style=flat-square)](https://www.npmjs.com/package/fastflux)
[![#fastflux on Freenode](https://img.shields.io/badge/IRC-%23fastflux-blue.svg?style=flat-square)](https://kiwiirc.com/client/irc.freenode.net/#fastflux)

- [Introduction](#introduction)
- [Architecture overview](#architecture-overview)
  - [Concepts](#concepts)
  - [Goals](#goals)
- [Installation](#installation)
- [Usage](#usage)
  - [Store](#create-store)
  - [Actions](#create-actions)
  - [Subscriber view](#create-component)
- [Advanced topics](#advanced-topics)
  - [Functional transformations](#functional-transformations)
  - [Combining stores](#combining-stores)
  - [Async actions and side effects](#async-actions-and-side-effects)
  - [Reusable stores](#reusable-stores)
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

- **Stores** are state containers coupled with reducers.
- **Reducers** -- pure functions describing the transformation of state in response to intents.
- **Intents** -- objects identified by `type`, optionally containing data fields.
  - Used to signal stores about some event (e.g. data received from server, user pressed key etc.).
  - Known in classic Flux as *actions*.
- **Actions** are (possibly asynchronous) functions for a concrete task (e.g. create post, logout user etc.).
  - Invoked by views or events from the environment.
  - Dispatches intents directly to the stores or through a dispatcher.
  - Can dispatch zero or more times per invocation.
  - IO and side effects are permitted.
  - You may think of actions as *action creators* from classic Flux.
- **Views** are React components.
  - Should listen to stores for state changes.
  - *Subscriber view* is a type of higher-order view component, which automatically
  subscribes to stores passed as props.

### Goals

- Readability comes first.
- Experimentation.
- FRP at the core:
  - everything is observable;
  - ubiquitous functional transformations.
- No boilerplate.
- Small footprint.
- Sane and well documented API.
- ES6 classes.

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
import {Store} from 'fastflux'

const INC = "INC"
const RESET = "RESET"

const InitialState = 0
const Reducers = {
  [INC]: times => times + 1,
  [RESET]: () => InitialState
}

const timesClicked = new Store(Reducers, InitialState)
```

### Create actions

```js
function inc() {
  timesClicked.dispatch({type: INC})
}

function reset(e) {
  e.preventDefault()
  timesClicked.dispatch({type: RESET})
}
```

### Create component

```js
import {createSubscriber} from 'fastflux'
import {render} from 'react-dom'

let ButtonClickCounter = createSubscriber(props =>
  <div>
    <div>Times clicked: {props.timesClicked}</div>
    <div>
      <button onClick={props.inc}>Click here!</button>
      <a href="#" onClick={props.reset}>Reset</a>
    </div>
  </div>
)

render(
  <ButtonClickCounter
    timesClicked={timesClicked}
    inc={inc}
    reset={reset} />,
  // Assuming <div id="mount"></div> in document body
  document.querySelector("#mount")
)
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
