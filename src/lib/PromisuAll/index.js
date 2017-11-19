const PromisuMap = require('../PromisuMap')

const PromisuAll = (iterable, opts) => PromisuMap(iterable, elem => elem(), opts)

module.exports = PromisuAll
