const isEmptyIterable = iterable => {
  for (let _ of iterable) {
    return false
  }

  return true
}

const PromisuRace = iterable => {
  if (isEmptyIterable(iterable)) {
    return Promise.reject(new Error('Expect not the input is empty'))
  }

  return Promise.race(iterable)
}

module.exports = PromisuRace
