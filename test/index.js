const {
  PromisuAll,
  PromisuMap,
  PromisuEvery,
  PromisuFew,
  PromisuFilter,
  PromisuFinally,
  PromisuQueue,
  PromisuRace,
  PromisuReduce,
  PromisuSome,
  PromisuTry,
  PromisuWaitFor,
  PromisuScan,
  PromisuDebounce,
  PromisuThrottle
} = require('../src');

const asyncTask = (time) => () => { return new Promise(resolve => {
  setTimeout(() => resolve(time), time)
})};

const testPromisuQueue = () => new Promise(resolve => {

  // PromisuQueue
  console.log('// PromisuQueue');

  const promisuQueue = PromisuQueue.of({ concurrency: 1 });

  promisuQueue.add(asyncTask(1000), { priority: 1 }).then(() => {
    console.log('async task 1000 Done');
  });

  promisuQueue.addAll([asyncTask(2000), asyncTask(4000)], { priority: 2 }).then(() => {
    console.log('async task 2000/4000 Done');
    resolve()
  });

  promisuQueue.add(asyncTask(3000), { priority: 3 }).then(() => {
    console.log('async task 3000 Done');
  });

  // async task 1000 Done
  // async task 3000 Done
  // async task 2000/4000 Done

})

const testPromisuAll = () => new Promise(resolve => {

  // PromisuAll
  console.log('// PromisuAll');

  PromisuAll([asyncTask(2000), asyncTask(4000)], { concurrency: 2 })
    .then((result) => {
      console.log('PromisuAll done', result);
      resolve()
    })

  // PromisuAll done [ 2000, 4000 ]

})

const testPromisuRace = () => new Promise(resolve => {

  // PromisuRace
  console.log('// PromisuRace');

  PromisuRace([asyncTask(2000)(), asyncTask(1000)()])
    .then((result) => {
      console.log('PromisuRace done', result);
      resolve()
    })

  // PromisuRace done 1000

})

const testPromisuEvery = () => new Promise(resolve => {

  // PromisuEvery
  console.log('// PromisuEvery');

  const testFn = x => x > 1000;

  PromisuEvery([asyncTask(2000)(), 3000], testFn)
    .then((result) => {
      console.log('PromisuEvery done', result);
      resolve()
    })

  // PromisuEvery done true

})

const testPromisuSome = () => new Promise(resolve => {

  // PromisuSome
  console.log('// PromisuSome');

  const testFn = x => x > 2000;

  PromisuSome([asyncTask(2000)(), 3000], testFn)
    .then((result) => {
      console.log('PromisuSome done', result);
      resolve()
    })

  // PromisuSome done true

})

const testPromisuFew = () => new Promise(resolve => {

  // PromisuFew
  console.log('// PromisuFew');

  PromisuFew([asyncTask(2000)(), 3000, asyncTask(1000)()], { count: 2 })
    .then((result) => {
      console.log('PromisuFew done', result);
      resolve()
    })

  // PromisuFew done [ 3000, 1000 ]

})

const testPromisuMap = () => new Promise(resolve => {

  // PromisuMap
  console.log('// PromisuMap');

  const mapFn = x => new Promise(resolve => { resolve(x + 1) })

  PromisuMap([asyncTask(2000)(), 3000, asyncTask(1000)()], mapFn, { concurrency: 2 })
    .then((result) => {
      console.log('PromisuMap done', result);
      resolve()
    })

  // PromisuMap done [ 2001, 3001, 1001 ]

})

const testPromisuFilter = () => new Promise(resolve => {

  // PromisuFilter
  console.log('// PromisuFilter');

  const filterFn = x => new Promise(resolve => { resolve(x > 1000) })

  PromisuFilter([asyncTask(2000)(), 3000, asyncTask(1000)()], filterFn, { concurrency: 2 })
    .then((result) => {
      console.log('PromisuFilter done', result);
      resolve()
    })

  // PromisuFilter done [ 2000, 3000 ]

})

const testPromisuReduce = () => new Promise(resolve => {

  // PromisuReduce
  console.log('// PromisuReduce');

  const reduceFn = (acc, curr) => new Promise(resolve => { resolve(acc + curr) })

  PromisuReduce([asyncTask(2000)(), 3000, asyncTask(1000)()], reduceFn, 0)
    .then((result) => {
      console.log('PromisuReduce done', result);
      resolve()
    })

  // PromisuReduce done 6000

})

const testPromisuScan = () => new Promise(resolve => {

  // PromisuScan
  console.log('// PromisuScan');

  const scanFn = (acc, curr) => new Promise(resolve => { resolve(acc + curr) })

  PromisuScan([asyncTask(2000)(), 3000, asyncTask(1000)()], scanFn, 0)
    .then((result) => {
      console.log('PromisuScan done', result);
      resolve()
    })

  // PromisuScan done [ 0, 2000, 5000, 6000 ]

})

const testPromisuFinally = () => new Promise(resolve => {

  // PromisuFinally
  console.log('// PromisuFinally');

  // TODO
  resolve()

})

const testPromisuTry = () => new Promise(resolve => {

  // PromisuTry
  console.log('// PromisuTry');

  // TODO
  resolve()

})

const testPromisuWaitFor = () => new Promise(resolve => {

  // PromisuWaitFor
  console.log('// PromisuWaitFor');

  // TODO
  resolve()

})

const testPromisuDebounce = () => new Promise(resolve => {

  // PromisuDebounce
  console.log('// PromisuDebounce');

  // TODO
  resolve()

})

const testPromisuThrottle = () => new Promise(resolve => {

  // PromisuThrottle
  console.log('// PromisuThrottle');

  // TODO
  resolve()

})


const testArr = [
  testPromisuQueue,
  testPromisuAll,
  testPromisuRace,
  testPromisuEvery,
  testPromisuSome,
  testPromisuFew,
  testPromisuMap,
  testPromisuFilter,
  testPromisuReduce,
  testPromisuScan,
  testPromisuFinally,
  testPromisuTry,
  testPromisuWaitFor,
  testPromisuDebounce,
  testPromisuThrottle
]

const run = async (testArr) => {
  for (let next of testArr) {
    await next()
  }
}

run(testArr)
