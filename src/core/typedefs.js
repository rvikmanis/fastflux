/**
 * @typedef {Object} Intent
 * @property {string} type
 * @example
 * let intent = {
 *   type: "set-name",
 *   payload: "Guest"
 * }
 *
 * @example
 * let intent = {
 *   type: "logout"
 * }
 *
 * @example
 * let intent = {
 *   type: "select-value",
 *   value: 5
 * }
 *
 * @example
 * let intent = {
 *   type: "preload-messages",
 *   messages: ["foo", "bar", "baz"],
 *   timestamp: "2016-01-13T08:00:00"
 * }
 */

/**
 * @typedef {Object} Store
 * @property {Observable} state
 * @property {function(intent: Intent)} dispatch
 * @desc
 *
 * See {@link createStore}
 */

/**
 * @external {React.Component} https://www.npmjs.com/package/react
 */
