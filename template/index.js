/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-14 12:06:43 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-17 14:31:26
 */
// const parser = require('parse5')
const parser = require('../utils/parse5')

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
    /* 转义 */
    return transfer(rst)
  } catch (error) {
    console.log('error.');
    console.log(error);
  }
}

/**
 * 将parse5.serilize后的html文本 转义
 * 
 * @param {string} content 需转义的文本
 * @return {string} content 转义后的文本
 */
function transfer(content) {
  const pmap = ['<', '&', '"'];
  const amap = ['\\&lt\\;', '\\&amp\\;', '\\&quot\\;'];
  amap.forEach((item, index) => {
    const reg = new RegExp(item, 'g')
    content = content.replace(reg, pmap[index])
  })
  return content
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
