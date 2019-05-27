
function createComponent(componentClass) {
  let component = new componentClass()
  let source = {}
  let result = {}

  source.created = (component.created || function() {})

  // static attributes
  Object.getOwnPropertyNames(component).forEach(o => {
    result[o] = component[o]
  })

  // methods in appClass
  Object.getOwnPropertyNames(component.constructor.prototype).forEach(o => {
    if (!['constructor'].includes(o)) {
      result[o] = function(...args) {
        component.constructor.prototype[o].apply(result.wx, args)
      }
    }
  })

  result.created = function() {
    console.log('new component onLoad');
    result.wx = this
    source.created.bind(this)
  }
  return result
}

export default createComponent