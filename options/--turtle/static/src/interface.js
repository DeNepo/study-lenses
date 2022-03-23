import * as Types from './types.js'

const {conform, from_representative} = Types
const {Record} = Types.types

const Interface = record => {
  record = conform(Record, record)
  
  const predicates = Object.entries
    .map(([field, rep]) => [field, from_representative(rep)])
    .reduce(
      (predicate_map, [field, predicate]) => ({...predicate_map, [field]: predicate}), 
      {})
  
  return (rec) => {
    rec = conform(Record, rec)

    return Object.keys(predicate).every(key => predicates[key](rec[key]))
  }
}

export { Interface }