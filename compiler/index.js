/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-05 18:38:15 
 * @Last Modified by:   kc.duxianzhang 
 * @Last Modified time: 2019-05-05 18:38:15 
 */

const less = require('./less-compiler')

const CompilePlugin = {
  compile(type, ...args) {
    if (type === 'less')
      return less(...args)
  }
}

module.exports = CompilePlugin