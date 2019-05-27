import createApp from './create/app'
import createPage from './create/page'
import createComponent from './create/component'
import {
  $initAPI
} from './init'

console.log('*** It is wepy-runtime! *** ');

let wepy = {}
class app{
  use() {}
  onLaunch(ctx) {

  }
}
class page{}
class component{}


$initAPI(wepy)


export default wepy = {
  ...wepy,
  createApp,
  createPage,
  createComponent,
  app,
  page,
  component,
}
