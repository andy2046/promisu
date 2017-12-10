const PromisuMap = require('../PromisuMap')
const StopError = require('../StopError')

const test = testFn => (x, i) => Promise.resolve(testFn(x, i)).then(val => {
  if (val) {
    throw new StopError()
  }

  return val
})

const PromisuSome = (iterable, testFn, opts) => PromisuMap(iterable, test(testFn), opts)
  .then(() => false)
  .catch(error => {
    if (error instanceof StopError) {
      return true
    }

    throw error
  })

module.exports = PromisuSome
