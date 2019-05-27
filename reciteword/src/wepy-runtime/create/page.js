
function createPage(pageClass) {
  let page = new pageClass()
  let source = {}
  let result = {}

  source.onLoad = (page.onLoad || function() {})

  // static attributes
  Object.getOwnPropertyNames(page).forEach(o => {
    result[o] = page[o]
  })

  // methods in appClass
  Object.getOwnPropertyNames(page.constructor.prototype).forEach(o => {
    if (!['constructor'].includes(o)) {
      result[o] = function(...args) {
        page.constructor.prototype[o].apply(result.wx, args)
      }
    }
  })

  result.onLoad = function() {
    console.log('new page onLoad');
    result.wx = this

    // $apply
    addApis(this)
    source.onLoad.bind(this)
  }
  return result
}

function addApis(ctx) {
  ctx.$apply = function() {
    console.log('new $apply');
  }
}

export default createPage