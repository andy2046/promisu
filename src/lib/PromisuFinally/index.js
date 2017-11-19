const noop = () => {}

const PromisuFinally = (promise, onFinally) => {
  const _onFinally = onFinally || noop

  return promise
    .then(
      val => Promise.resolve(_onFinally()).then(() => val)
    )
    .catch(err => Promise.resolve(_onFinally()).then(() => { throw err }))
}

module.exports = PromisuFinally
