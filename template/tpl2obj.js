/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-06 07:04:55 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-26 12:24:13
 */
// const parser = require('parse5')
const parser = require('../utils/parse5')
const {
  revertObjectClass
} = require('./mapping')


module.exports = function tpl2obj(tplCode) {
  if (!tplCode) return

  // 提前转换class的对象写法
  tplCode = revertObjectClass(tplCode)
  // 删去换行节点
  tplCode = removeShiftNode(tplCode)

  let doc = parser.parseFragment(tplCode)

  // 删去不相关属性
  deleteUnuseAttrs(doc)

  return doc
}

function removeShiftNode(tplCode) {
  const REG = /\>\s*\</mg
  return tplCode.replace(REG, '><')
}

function deleteUnuseAttrs(doc) {
  const reserveTags = [
    'childNodes',
    'nodeName',
    'name',
    'value',
    'tagName',
    'attrs',
    'content'
  ]
  if (Array.isArray(doc)) {
    doc.forEach((item, index) => {
      deleteUnuseAttrs(item)
    })
    return
  }
  if (Object.keys(doc).length) {
    for (let i in doc) {
      if (reserveTags.indexOf(i) > -1) {
        deleteUnuseAttrs(doc[i])
      } else {
        delete doc[i]
      }
    }
  }
}