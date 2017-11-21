const PromisuWaitFor = (condition, interval) => new Promise((resolve, reject) => {
  const intervalNumber = Number.isInteger(interval) && interval > 0
    ? interval
    : 100

  const check = () => {
    Promise.resolve().then(condition).then(val => {
      if (typeof val !== 'boolean') {
        throw new TypeError('Expect condition to return a boolean')
      }

      if (val === true) {
        resolve()
      } else if (val === false) {
        reject()
      } else {
        setTimeout(check, intervalNumber)
      }
    }).catch(reject)
  }

  check()
})

module.exports = PromisuWaitFor
