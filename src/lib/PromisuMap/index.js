const PromisuMap = (iterable, mapFn, options) => new Promise((resolve, reject) => {
  const opts = Object.assign({
    concurrency: Infinity
  }, options)

  if (typeof mapFn !== 'function') {
    throw new TypeError('mapFn function is required')
  }

  const concurrency = opts.concurrency

  if (!(typeof concurrency === 'number' && concurrency >= 1)) {
    throw new TypeError('Expected concurrency to be a number >= 1')
  }

  const ret = []
  const iterator = iterable[Symbol.iterator]()
  let isRejected = false
  let iterableDone = false
  let resolvedCount = 0
  let currentIndex = 0

  const next = () => {
    if (isRejected) {
      return
    }

    const nextItem = iterator.next()
    const i = currentIndex
    currentIndex++

    if (nextItem.done) {
      iterableDone = true

      if (resolvedCount === 0) {
        resolve(ret)
      }

      return
    }

    resolvedCount++

    Promise.resolve(nextItem.value)
      .then(el => mapFn(el, i))
      .then(
        val => {
          ret[i] = val
          resolvedCount--
          next()
        }
      )
      .catch(
        err => {
          isRejected = true
          reject(err)
        }
      )
  }

  for (let i = 0; i < concurrency; i++) {
    next()

    if (iterableDone) {
      break
    }
  }
})

module.exports = PromisuMap
