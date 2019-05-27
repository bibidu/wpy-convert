
function createApp(appClass) {
  let app = new appClass()
  let source = {}
  let result = {}

  source.onLaunch = (app.onLaunch || function() {})

  // static attributes
  Object.getOwnPropertyNames(app).forEach(o => {
    result[o] = app[o]
  })

  // methods in appClass
  Object.getOwnPropertyNames(app.constructor.prototype).forEach(o => {
    if (!['constructor'].includes(o)) {
      result[o] = function(...args) {
        app.constructor.prototype[o].apply(result.wx, args)
      }
    }
  })

  result.onLaunch = function() {
    console.log('new app onLaunch');
    result.wx = this
    source.onLaunch.bind(result)
  }
  return result
}

export default createApp