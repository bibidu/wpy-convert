/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-05 18:06:48 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-13 16:08:32
 */
const logger = require('./logger')

 /**
  * 安全地获取对象深层属性
  * 
  * @param {Object} source 源数据
  * @param {String} expression 表达式
  * @param {any} def 返回的默认值
  * @example:
  *   const obj = {name: 'john', friends: []}
  * 
  *   safeGet(obj, 'obj.friends')
  *     -> []
  *   safeGet(obj, 'obj.friends.ok.name')
  *     -> undefined
  *   safeGet(obj, 'obj.friends.ok.name', 'default')
  *     -> default
  */
 function safeGet(source, expression, def = undefined) {
  if (typeof source !== 'object' || !expression.includes('.')) {
    return source
  }
  const splitExpArr = expression.split('.').slice(1)
  return splitExpArr.reduce((prev, curr) => {
    if (!prev) return def
    return prev[curr]
  }, source)
 }

 /**
  * 去除文本首位空格
  * @param {*} code 
  */
 function trim(code) {
  if (typeof code !== 'string') {
    code = code.toString()
  }
   const startReg = /^\s*/
   const endReg = /\s*$/

   return code.replace(startReg, '').replace(endReg, '')
 }

 /**
  * 首字母大写
  * @param {*} str 
  */
function upperStart(str) {
  return str.replace(/^\w/, e => e.toUpperCase())
}

module.exports = {
  logger,
  safeGet,
  trim,
  upperStart
}