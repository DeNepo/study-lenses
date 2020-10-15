/**
 * creates a deep clone of the most common JavaScript data types and structures
 * @param {any} src - the value to clone
 * @param {Map} clonesMap - stores cloned reference values for circular cloning
 *  passing in a map when calling deepClone can ruin the function's behavior
 *  this parameter is handled internally as a default parameter
 *  or as an argument when the function calls itself recursively
 * @returns {any} a deep clone of the value passed in
 */
const deepClone = (src, clonesMap = new Map()) => {

  // primitives & functions
  if (!src || typeof src !== 'object' || typeof src === 'function') {
    return src;
  }

  // return stashed copies of reference types
  if (clonesMap.has(src)) {
    return clonesMap.get(src);
  }

  // if not a primitive or a function
  if (Array.isArray(src)) {
    const clone = [];
    clonesMap.set(src, clone);
    for (const entry of src) {
      clone.push(deepClone(entry, clonesMap));
    };
    return clone;
  }

  if (src instanceof Element) {
    return src.cloneNode(true);
  }

  if (src instanceof RegExp) {
    return new RegExp(src);
  }

  if (src instanceof Date) {
    return new Date(src.getTime());
  }

  if (src instanceof Map) {
    const clone = new Map();
    clonesMap.set(src, clone);
    const srcEntries = src.entries();
    const arrayFromEntries = Array.from(srcEntries);
    const clonedEntries = deepClone(arrayFromEntries, clonesMap);
    clonedEntries.forEach(entry => clone.set(...entry))
    return clone;
  }

  if (src instanceof Set) {
    const clone = new Set();
    clonesMap.set(src, clone);
    const srcValues = src.values();
    const arrayFromValues = Array.from(srcValues);
    const clonedValues = deepClone(arrayFromValues, clonesMap);
    clonedValues.forEach(entry => clone.add(entry));
    return clone;
  }

  if (src instanceof Object) {
    const clone = Object.create(src);
    clonesMap.set(src, clone);
    for (const key in src) {
      clone[key] = deepClone(src[key], clonesMap);
    }
    return clone;
  }

  // ?
  return src;

};
