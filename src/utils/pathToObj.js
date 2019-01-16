const pathToObj = (path, value) => {
    if (path.length === 0) {
        return value
    }

    return {
        [path.shift()]: pathToObj(path, value)
    }
}

export default (path = [], value) => pathToObj(path.concat(), value)
