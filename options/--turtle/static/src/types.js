import {assert, conform} from './assert.js'

const is_string = s => typeof s === 'string'

const is_number = n => typeof n === 'number' && !Number.isNaN(n)

const is_function = f => typeof f ===  'function'

const is_array = a => Array.isArray(a)

const is_boolean = b => typeof b === 'boolean'

const Record = {}

const is_record = r => 
  r !== null && 
  typeof r === 'object' && 
  Reflect.getPrototypeOf(r) === Reflect.getPrototypeOf({})

const Tuple = {}

const is_tuple = types => t => 
  is_array(t) &&
  types.map(from_representative).every((p, i) => p(t[i]))

const representatives = new Map([
  [String, is_string],
  [Number, is_number],
  [Function, is_function],
  [Boolean, is_boolean],
  [Array, is_array],
  [Record, is_record],
  [Tuple, is_tuple]
])

const from_representative = rep => {
  const predicate = representatives.get(rep)

  if (!predicate) throw Error(`I could not find a predicate for type representative ${rep}.`)

  return predicate
}

const conform_to_type = (representative, value, msg = `Value ${value} did not conform to type predicate ${predicate.name}.`) => {
  const predicate = from_representative(representative)

  return conform(predicate, value, msg)
}

const predicates = {is_boolean, is_function, is_number, is_record, is_string, is_array, is_tuple}

const types = {String, Number, Function, Boolean, Record, Tuple}

export {predicates, types, from_representative, conform_to_type as conform}
