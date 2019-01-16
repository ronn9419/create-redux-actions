/* eslint-disable no-prototype-builtins */
export default (...objs) => {
    return objs.reduce((all, current) => {
        return Object.keys(current).reduce((all2, key) => {
            if (all2.hasOwnProperty(key)) {
                if (Array.isArray(all2[key])) {
                    all2[key].push(current[key])
                } else {
                    all2[key] = [all2[key], current[key]]
                }
            } else {
                all2[key] = current[key]
            }
            return all2
        }, all)
    }, {})
}
