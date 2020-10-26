'use strict'

const { deepStrictEqual } = require('assert')

const areDifferent = (actual, expected) => {
  try {
    deepStrictEqual(actual, expected)
    return false
  } catch (o_0) {
    return true
  }
}

module.exports = areDifferent
