const PromisuDebounce = (fn, wait, options) => {
  if (!Number.isFinite(wait)) {
    throw new TypeError('Expect wait to be a finite number')
  }

  const opts = options || {}

  let leadingVal
  let timer
  let resolveList = []

  return function () {
    const ctx = this
    const args = arguments

    return new Promise(resolve => {
      const runImmediately = opts.leading && !timer

      clearTimeout(timer)

      timer = setTimeout(() => {
        timer = null

        const res = opts.leading ? leadingVal : fn.apply(ctx, args)

        for (resolve of resolveList) {
          resolve(res)
        }

        resolveList = []
      }, wait)

      if (runImmediately) {
        leadingVal = fn.apply(ctx, args)
        resolve(leadingVal)
      } else {
        resolveList.push(resolve)
      }
    })
  }
}

module.exports = PromisuDebounce
