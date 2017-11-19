const PromisuMap = require('../PromisuMap')

const PromisuFilter = (iterable, filterFn, opts) =>
  PromisuMap(iterable, (el, i) => Promise.all([filterFn(el, i), el]), opts)
    .then(values => values.filter(x => Boolean(x[0])).map(x => x[1]))

module.exports = PromisuFilter
