const PromisuReduce = (iterable, reduceFn, initValue) => new Promise((resolve, reject) => {
  const iterator = iterable[Symbol.iterator]()
  let index = 0

  const next = total => {
    const el = iterator.next()

    if (el.done) {
      resolve(total)
      return
    }

    Promise.all([total, el.value])
      .then(value => {
        next(reduceFn(value[0], value[1], index++))
      })
      .catch(reject)
  }

  next(initValue)
})

module.exports = PromisuReduce
