const PriorityQueue = (function () {

  const isPrimitive = (obj) => {
    return obj !== Object(obj)
  }

  class QueueElement {
    constructor (element, priority) {
      this.element = element
      this.priority = Number.isInteger(priority)
        ? priority
        : Number.isInteger(element) ? element : 0
    }

    equals (obj) {
      if (isPrimitive(this.element) && isPrimitive(obj.element)) {
        return this.element === obj.element
          && this.priority == obj.priority
      } else {
        // define toJSON() in element obj for customization
        return JSON.stringify(this.element) === JSON.stringify(obj.element)
          && this.priority == obj.priority
      }
    }
  }

  const items = new WeakMap()
  const comp = Symbol('compareFunction')
  const defaultCompareFunc = (a, b) => {
    if (a.priority < b.priority) {
      return 1
    }
    if (a.priority > b.priority) {
      return -1
    }
    return 0
  }
  const lowerBound = (arr, val, comp) => {
    let first = 0
    let count = arr.length
    
    while (count > 0) {
      const step = (count / 2) | 0
      let it = first + step
      
      if (comp(arr[it], val) <= 0) {
        first = ++it
        count -= step + 1
      } else {
        count = step
      }
    }

    return first
  }

  class PriorityQueue {

    constructor (...args) {
      items.set(this, [])
      let [compareFunction, iterable] = args

      if (args.length >= 2 && typeof compareFunction !== 'function') {
        throw new TypeError('no compareFunction defined, PriorityQueue(compareFunction, iterable)')
      }

      if (args.length == 1 && typeof args[0] !== 'function') {
        iterable = args[0]
        compareFunction = defaultCompareFunc
      }

      if (args.length == 0) {
        compareFunction = defaultCompareFunc
      }

      this[comp] = compareFunction

      if (iterable) {
        for (const item of iterable) {
          if (isPrimitive(item)) {
            this.enqueue(item)
          } else {
            this.enqueue(item.element, item.priority)
          }
        }
      }
    }

    enqueue (element, priority) {
      if (element == null) {
        throw new Error('element is required, enqueue(element, priority)')
      }

      let queueElement = new QueueElement(element, priority)
      let q = items.get(this)

      if (q.length && q[q.length - 1].priority >= queueElement.priority) {
        q.push(queueElement)
        return
      }

      const index = lowerBound(q, queueElement, this[comp])
      q.splice(index, 0, queueElement)

      items.set(this, q)
    }

    dequeue () {
      let q = items.get(this)
      const r = q.shift()
      items.set(this, q)
      return r
    }

    front () {
      const q = items.get(this)
      return q[0]
    }

    has (obj) {
      if (obj == null) return false
      let _obj

      if (isPrimitive(obj)) {
        _obj = new QueueElement(obj)
      } else if (obj.element != null) {
        _obj = new QueueElement(obj.element, obj.priority) 
      } else {
        return false
      }

      const q = items.get(this)
      for (const item of q) {
        if (item.equals(_obj)) {
          return true
        }
      }
      return false
    }

    isEmpty () {
      return items.get(this).length == 0
    }

    forEach (callback, thisArg) {
      for (const item of this) {
        callback.call(thisArg, item, this)
      }
    }

    *[Symbol.iterator]() {
      const q = items.get(this)
      for (let i = 0; i < q.length; i++) {
        yield q[i]
      }
    }

    get size () {
      const q = items.get(this)
      return q.length
    }

    clear () {
      items.set(this, [])
    }

    print () {
      const q = items.get(this)
      for (let i=0; i<q.length; i++) {
        console.log(`${JSON.stringify(q[i].element)} - ${q[i].priority}`)
      }
    }

    toString () {
      let str = ''
      items.get(this).forEach(i => str += JSON.stringify(i) + ',')
      return str
    }
  }
  return PriorityQueue
})()

module.exports = PriorityQueue
