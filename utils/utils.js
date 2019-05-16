/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-16 08:49:56 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-16 08:51:45
 */

const path = require('path')
const config = require('../config')

/**
 * 替换编译后的项目路径
 * 
 * @param {*} fileEntryPath 
 */
function projectEntry2opt(fileEntryPath) {
  const { entry, output } = config.project
  return fileEntryPath.replace(entry, output)
}

module.exports = {
  projectEntry2opt
}