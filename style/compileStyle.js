/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-23 07:32:49 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-23 07:52:49
 */

const compileLess = require('./compileLess')

module.exports = function compileStyle(type, styleCode) {
  if (type === 'less') {
    return compileLess(styleCode)
  }
  return console.log(`[error] cannot find compiler of ${type}`);
}