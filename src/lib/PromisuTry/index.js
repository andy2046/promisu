const PromisuTry = callbk => new Promise(resolve => {
  resolve(callbk())
})

module.exports = PromisuTry
