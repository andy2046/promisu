const PromisuScan = (iterable, reduceFn, initValue) => new Promise((resolve, reject) => {
  const iterator = iterable[Symbol.iterator]()
  let index = 0
  const totalArr = []

  const next = total => {
    const el = iterator.next()

    totalArr.push(total)

    if (el.done) {
      resolve(Promise.all(totalArr))
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

module.exports = PromisuScan
