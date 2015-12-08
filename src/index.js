/**
 * @typedef {*} Any
 * @desc Describes any value
 */

/**
 * @typedef {Object} Message
 * @property {string} type
 * @desc `Message` is a pure object type meeting the following criteria:
 *  * No methods;
 *  * Properties are either primitives
      (numbers, strings, booleans etc.), {@link Array}s or pure {@link Object}s;
 *  * No circular references;
 *  * Has own property `Message#type` ({@link string})
 *
 * @example <caption>Valid message without fields</caption>
 * let message = {
 *  type: "something-descriptive"
 * }
 */

/**
 * @external {React.Component} https://www.npmjs.com/package/react
 */

export {Store, createStore} from './core/store';
export {Observable, ObservableState} from './core/observable';
export {createSubscriber} from './core/subscriber';
export {isObservable, isObservableState} from './utils';
export {Action, createAction} from './core/action';
