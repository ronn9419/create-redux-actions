export default string =>
    string.replace(/[\w]([A-Z])/g, m => m[0] + '_' + m[1]).toUpperCase()
