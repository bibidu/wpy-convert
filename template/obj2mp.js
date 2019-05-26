/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-23 07:44:44 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-26 12:17:47
 */

const parser = require('../utils/parse5')
const {
  replaceWpyAttrKV,
  replaceWpyTag
} = require('./mapping')

module.exports = function (templteObj) {
  traverseReplace(templteObj)
  let rst = parser.serialize(templteObj)
  /* 转义 */
  return transfer(rst)
}


function transfer(content) {
  const pmap = ['<', '&', '"'];
  const amap = ['\\&lt\\;', '\\&amp\\;', '\\&quot\\;'];
  amap.forEach((item, index) => {
    const reg = new RegExp(item, 'g')
    content = content.replace(reg, pmap[index])
  })
  return content
}

function traverseReplace(code) {
  if (!code) return

  if (code.tagName) {
    code.tagName = replaceWpyTag(code.tagName)
  }

  if (code.attrs) {
    Array.from(code.attrs).forEach((item, index) => {
      code.attrs[index] = replaceWpyAttrKV(item)
    })
  }
  (code.childNodes || []).forEach((item, index) => {
    traverseReplace(code.childNodes[index])
  })
  if (code && code.childNodes && !code.childNodes.length) {
    delete code.childNodes
  }
}