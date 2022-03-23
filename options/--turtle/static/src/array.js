const first = ([head]) => head

const but_first = ([_, ...tail]) => tail

const last = arr => arr[arr.length - 1]

const but_last = arr => arr.slice(0, arr.length - 1)

const append = (arr, el) => [...arr, el]

export {first, but_first, last, but_last, append}
