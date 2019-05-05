/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-05 18:38:21 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-05 19:03:35
 */
require('babel-polyfill')
const less2css = require('./style/less2css')


// test
var test = `
@import '../common/common.less';

.answer {
  .word {
    font-weight: bold;
    font-size: 80rpx;
    color: #322a22;
    text-align: center;
    &:after{
      content: '';
    }
  }
  .wordb {
    font-size: 30rpx;
    font-weight: bold;
    color: #554c44;
    text-align: center;
    margin-bottom: 25rpx;
  }
}
`

let r = less2css(test)

r.then(Res => {
  console.log('Res');
  console.log(Res);
})