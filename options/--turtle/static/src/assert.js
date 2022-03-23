const assert = (fn, msg) => {
  if (typeof fn !== 'function') throw Error('First argument to assert must be a function.')
  if (typeof msg !== 'string') throw Error('Second argument to assert must be a string.')

  let error = null

  try {
    const result = fn()
    if (result) return result
  } catch (e) {
    error = e
  }

  if (error) throw error
  throw Error(msg)
}

const conform = (fn, value, msg = `Value ${value} did not conform to predicate ${fn.name}`) => {
  if (typeof fn !== 'function') throw Error('First argument to conform must be a function.')
  if (typeof msg !== 'string') throw Error('Third argument to conform must be a string.')

  return assert(() => fn(value), msg) ? value : void null
}

export {assert, conform}
