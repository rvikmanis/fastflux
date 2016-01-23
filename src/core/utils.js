import assign from 'object-assign'
export {assign}

/**
 * @ignore
 */
export function isIntent(value) {
  return typeof value === "object" &&
   typeof value.type === "string"
}
