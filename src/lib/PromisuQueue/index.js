const PriorityQueue = require('../PriorityQueue')

const PromisuQueue = (function () {

  class PromisuQueue {

    constructor (opts) {
      const _opts = Object.assign({
        concurrency: Infinity,
        queueClass: PriorityQueue
      }, opts)

      if (!(typeof _opts.concurrency === 'number' && _opts.concurrency >= 1)) {
        throw new TypeError('Expected concurrency to be a number >= 1')
      }

      this.queue = new _opts.queueClass()
      this._queueClass = _opts.queueClass
      this._pendingCount = 0
      this._concurrency = _opts.concurrency
      this._resolveEmpty = () => {}
      this._resolveIdle = () => {}
    }

    _next () {
      this._pendingCount--

      if (this.queue.size > 0) {
        const item = this.queue.dequeue()
        item.element()
      } else {
        this._resolveEmpty()

        if (this._pendingCount === 0) {
          this._resolveIdle()
        }
      }
    }

    add (fn, opts = {}) {
      return new Promise((resolve, reject) => {
        const run = () => {
          this._pendingCount++

          fn().then(
            val => {
              resolve(val)
              this._next()
            }
          )
          .catch(
            err => {
              reject(err)
              this._next()
            }
          )
        }

        if (this._pendingCount < this._concurrency) {
          run()
        } else {
          this.queue.enqueue(run, opts.priority)
        }
      })
    }

    addAll (fns, opts) {
      return Promise.all(fns.map(fn => this.add(fn, opts)))
    }

    clear () {
      this.queue = new this._queueClass()
    }

    onEmpty () {
      if (this.queue.size === 0) {
        return Promise.resolve()
      }

      return new Promise(resolve => {
        const existingResolve = this._resolveEmpty
        this._resolveEmpty = () => {
          existingResolve()
          resolve()
        }
      })
    }

    onIdle () {
      if (this._pendingCount === 0) {
        return Promise.resolve()
      }

      return new Promise(resolve => {
        const existingResolve = this._resolveIdle
        this._resolveIdle = () => {
          existingResolve()
          resolve()
        }
      })
    }

    get size () {
      return this.queue.size
    }

    get pendingCount () {
      return this._pendingCount
    }
  }
  return PromisuQueue
})()

module.exports = PromisuQueue
