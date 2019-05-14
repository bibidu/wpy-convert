/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-14 12:06:43 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-14 13:40:07
 */
const parser = require('parse5')

const tpl2obj = require('./tpl2obj')
const {
  replaceWpyAttrKV,
  replaceWpyTag
} = require('./mapping')

/**
 * 编译template
 * 
 * @param {*} code 
 */
module.exports = function compileTemplate(code) {
  try {
    let revertToObj = tpl2obj(code)
    traverseReplace(revertToObj)
    let rst = parser.serialize(revertToObj)
    return rst
  } catch (error) {
    console.log('error.');
    console.log(error);
  }
}

/**
 * 遍历template进行替换操作
 * 
 * @param {*} code 
 */
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
