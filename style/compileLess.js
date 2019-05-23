/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-05 18:39:45 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-23 07:50:23
 */
const lessCompiler = require('../compiler/less-compiler')

// 正则: 获取引入的外部样式
const GET_IMPORT_REG = /\@import\s*['|"](.+)['|"];/g

module.exports = async function compileLess(less) {
  let resultCode = ''
  if (GET_IMPORT_REG.test(less)) {
    const importArr = less.match(GET_IMPORT_REG)
    resultCode += replaceImportCode(importArr)
  }
  let compiled = await lessCompiler(less.replace(GET_IMPORT_REG, ''))
  resultCode += compiled
  return resultCode
}

function replaceImportCode(importArr) {
  return importArr.reduce((prev, curr) => prev + curr.replace(/\.less/, '.wxss') + '\n', '')
}
