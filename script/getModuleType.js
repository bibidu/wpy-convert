/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 16:30:14 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-13 16:34:13
 */


const {
  upperStart,
  safeGet
} = require('../utils')

const VALID_FILE_TYPE = ['app', 'page', 'component']

/**
 * 获取文件的类型(App | Page | Component)
 * 
 * @param {*} classInner AST.class体
 */
module.exports = function getModuleType(classInner) {
  let fileType = safeGet(classInner, 'classInner.superClass.property.name')
  if (VALID_FILE_TYPE.indexOf(fileType) === -1) {
    throw `不合法的FILE_TYPE: ${fileType}`
  }
  return upperStart(fileType)
}