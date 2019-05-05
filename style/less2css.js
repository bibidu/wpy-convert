/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-05 18:39:45 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-05 19:02:03
 */
const CompilePlugin = require('../compiler')

// 正则: 获取引入的外部样式
const GET_IMPORT_REG = /\@import\s*['|"](.+)['|"];/g

async function less2css(less) {
  let resultCode = ''
  if (GET_IMPORT_REG.test(less)) {
    const importArr = less.match(GET_IMPORT_REG)
    resultCode += replaceImportCode(importArr)
  }
  let compiled = await CompilePlugin.compile('less', less.replace(GET_IMPORT_REG, ''))
  resultCode += compiled
  return resultCode
}

/**
 * 替换less上引入的外链css
 * 
 * @param {*} importArr 
 * @example:
 *  @import '../common/common.less';
 *  -> @import '../common/common.wxss';
 */
function replaceImportCode(importArr) {
  return importArr.reduce((prev, curr) => prev + curr.replace(/\.less/, '.wxss') + '\n', '')
}

module.exports = less2css