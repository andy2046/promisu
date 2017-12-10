const PromisuMap = require('../PromisuMap')
const StopError = require('../StopError')

const test = testFn => (x, i) => Promise.resolve(testFn(x, i)).then(val => {
  if (!val) {
    throw new StopError()
  }

  return val
})

const PromisuEvery = (iterable, testFn, opts) => PromisuMap(iterable, test(testFn), opts)
  .then(() => true)
  .catch(error => {
    if (error instanceof StopError) {
      return false
    }

    throw error
  })

module.exports = PromisuEvery
