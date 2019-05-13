/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 17:37:55 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-13 18:35:42
 */
const path = require('path')
module.exports = {
  project: {
    entry: path.resolve(__dirname, 'reciteword'),
    output: path.resolve(__dirname, 'dist_reciteword'),
    sourceEntry: '/src'
  }
}