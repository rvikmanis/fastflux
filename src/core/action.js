import Observable from './observable/base.js';


/**
 * *This class is abstract*
 *
 * @example
 * let increment = new class extends Action {
 *   static listeners = [counter.send];
 *   run() {
 *     this.emit({type: "inc"})
 *   }
 * }
 *
 * increment(); // Invokes `counter.send` with message `{type: "inc"}`
 *
 * @returns {function}
 */
export class Action extends Observable {


  /**
   * @returns {function}
   * @throws {Error} when instantiating the abstract {@link Action} directly
   */
  constructor() {
    super();

    if (this.constructor === Action)
      throw new Error("Action is abstract: extend or call createAction");

    let listeners = this.constructor.listeners;
    if (listeners != null && listeners.length != null) {
      for (var i=0; i<listeners.length; i++) {
        this.subscribe(listeners[i]);
      }
    }

    var _action = (...args) => {
      this.run(...args);
    }

    Object.defineProperties(_action, {
      subscribe: {value: (fn) => this.subscribe(fn)},
      unsubscribe: {value: (fn) => this.unsubscribe(fn)}
    });

    return _action;

  }


  /**
   * @param {...Any} args
   * @abstract
   */
  run(...args) {
    throw new Error("Not implemented");
  }


}

/**
 * {@link Action} factory function
 *
 * @example
 * let increment = createAction(emit => () => {
 *   emit({type: "inc"})
 * });
 * @param {function(emit: function): function} run - action body
 * @returns {function}
 */
export function createAction(run) {
  return new class extends Action {
    run(...args) {
      run(this.emit)(...args);
    }
  }
}
