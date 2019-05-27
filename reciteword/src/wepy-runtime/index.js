console.log('*** It is wepy-runtime! *** ');

class app{
  use() {}
  onLaunch(ctx) {

  }
}
class page{}
class component{}

// 
function createApp(appClass) {
  let app = new appClass()
  let source = {}

  source.onLaunch = (app.onLaunch || function() {})

  // bind all properties and methods to wx, that is ctx
  function bindWepyToThis(ctx) {

    // static attributes
    Object.getOwnPropertyNames(app).forEach(o => {
      console.log(`getOwnPropertyNames ${o}`);
      ctx[o] = app[o]
    })

    // methods in appClass
    Object.getOwnPropertyNames(app.constructor.prototype).forEach(o => {
      if (!['constructor'].includes(o)) {
        console.log(`getOwnPropertyNames ${o}`);
        ctx[o] = app.constructor.prototype[o].bind(ctx)
      }
    })
  }

  app.onLaunch = function() {
    console.log('new app onLaunch');
    bindWepyToThis(this)
    
    source.onLaunch()
  }
}
export default {
  createApp,
  createPage,
  createComponent,
  app,
  page,
  component,
}

onLoad() {

}
config = {

}
