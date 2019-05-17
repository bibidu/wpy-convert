/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-06 07:04:55 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-17 14:29:23
 */
// const parser = require('parse5')
const parser = require('../utils/parse5')


/**
 * wpy.template ---> content Object
 * 
 * @param {String} tplCode wepy.template标签内容
 * @return {Object} doc 表示template内容的对象
 */
module.exports = function tpl2obj(tplCode) {
  if (!tplCode) return

  // 删去换行节点
  tplCode = removeShiftNode(tplCode)

  let doc = parser.parseFragment(tplCode)

  // 删去不相关属性
  delUnuseAttrs(doc)

  return doc
}

/**
 * 删去标签间的换行节点(nodeName='#text')
 * 
 * @param {*} tplCode 
 */
function removeShiftNode(tplCode) {
  const REG = /\>\s*\</mg
  return tplCode.replace(REG, '><')
}

/**
 * 删去不关心的节点属性
 * 
 * @param {*} doc 
 * @param {*} result 
 */
function delUnuseAttrs(doc) {
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
      delUnuseAttrs(item)
    })
    return
  }
  if (Object.keys(doc).length) {
    for (let i in doc) {
      if (reserveTags.indexOf(i) > -1) {
        delUnuseAttrs(doc[i])
      } else {
        delete doc[i]
      }
    }
  }
}