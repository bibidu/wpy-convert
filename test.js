const {
  revertNpmInModule,
  revertRelativeModule,
} = require('./script/utils')

// let t = revertNpmInModule('/Users/mr.du/Desktop/owns/wpy-revert/reciteword/src/app.wpy', 'promise-polyfill')
// let t = revertNpmInModule('/Users/mr.du/Desktop/owns/wpy-revert/reciteword/node_modules/wepy/lib/app.js', 'promise-polyfill', true)
let t = revertRelativeModule('/Users/mr.du/Desktop/owns/wpy-revert/reciteword/node_modules/wepy/lib/app.js', './wepy')
console.log(t);
true