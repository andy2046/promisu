const PromisuFew = (iterable, options) => new Promise((resolve, reject) => {
  const opts = Object.assign({ count: 1 }, options)

  if (!Number.isFinite(opts.count)) {
    throw new TypeError('Expect a finite number for options.count')
  }

  const values = []
  const errors = []
  let elementCount = 0
  let maxErrorCount = (-opts.count) + 1
  let maxFilteredCount = (-opts.count) + 1
  let done = false

  const fulfilled = value => {
    if (done) {
      return
    }

    if (typeof opts.filter === 'function' && !opts.filter(value)) {
      if (--maxFilteredCount === 0) {
        done = true
        reject(new Error('Not enough values passed filter option'))
      }

      return
    }

    values.push(value)

    if (--opts.count === 0) {
      done = true
      resolve(values)
    }
  }

  const rejected = error => {
    if (done) {
      return
    }

    errors.push(error)

    if (--maxErrorCount === 0) {
      done = true
      const errorString = errors.map(err => err.message || err.name).join(';')
      reject(new Error(errorString))
    }
  }

  for (const element of iterable) {
    maxErrorCount++
    maxFilteredCount++
    elementCount++
    Promise.resolve(element).then(fulfilled, rejected)
  }

  if (opts.count > elementCount) {
    throw new Error(`Expect input to contain >= ${opts.count} items, but only ${elementCount} items`)
  }
})

module.exports = PromisuFew
