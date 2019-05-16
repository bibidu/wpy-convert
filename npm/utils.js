/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-16 08:36:10 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-16 08:51:56
 */

const path = require('path')

/**
 * 替换编译后的npm路径
 * 
 * @param {*} fileEntryPath 
 */
function npmEntry2opt(fileEntryPath) {
  return fileEntryPath.replace('node_modules', 'src/npm')
}

module.exports = {
  npmEntry2opt
}