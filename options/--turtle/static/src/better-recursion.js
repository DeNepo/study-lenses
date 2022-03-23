Function.prototype.recursion_limit = 500

const is_recursive_call = result => 
    result != null && 
    typeof result === 'object' &&
    'dirty-turtle/recursion' in result

Function.tco = (f, name = f.name || 'anonymous function') => {
    const call = (...args) => {
        let result = f(...args)
        
        let recursion_count = 0

        while (is_recursive_call(result)) {
            if (recursion_count > call.recursion_limit) {
                console.warn(`Too much recursion in ${name}.`)
                return void null
            }
            recursion_count++
            result = f(...result.args)
        }

        return result
    }

    return Object.defineProperties(call, {
        name: {
            value: name,
            enumerable: false
            },
        recur: {
            value: (...args) => ({['dirty-turtle/recursion']: true, args}),
            enumerable: false
        }
    })
}