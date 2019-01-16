export default (...objs) => objs.reduce((acc, cur) => ({ ...acc, ...cur }), {})
