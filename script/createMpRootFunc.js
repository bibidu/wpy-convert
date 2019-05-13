/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 15:46:09 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-13 16:32:04
 */
const getModuleType = require('./getModuleType')

const {
  upperStart,
  safeGet
} = require('../utils')
 /**
  * 创建小程序页面的根函数 App({}) | Page({}) | Component({})
  * 
  * @param {*} types 'babel-types'
  * @param {*} classInner AST解析后的class体
  * @return {} func 创建的AST函数表达式
  * 
  */
 module.exports = function createMpRootFunc(types, classInner) {
  const bodys = safeGet(classInner, 'classInner.body.body')
  const fileType = getModuleType(classInner)
  if (!bodys || !fileType) {
    throw '未定义方法体或未识别页面类型(App/Page/Component)'
  }
  const newFnBody = Array.from(bodys)
  .filter(i => i.key.name !== 'components')
  .map(i => types.objectProperty(i.key, i.value))

  const func = types.CallExpression(
    types.Identifier(fileType),
    [types.objectExpression(newFnBody)]
  )
  return func
 }