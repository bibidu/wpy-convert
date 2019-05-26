/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-05 18:39:45 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-26 07:35:32
 */
const lessCompiler = require('../compiler/less-compiler')


async function compileLess(importCssCode, pureCssCode) {
  let compiled = await lessCompiler(pureCssCode)
  importCssCode = replaceImportCode(importCssCode)
  
  return importCssCode + compiled 
}

function replaceImportCode(importArr) {
  return importArr.reduce((prev, curr) => prev + curr.replace(/\.less/, '.wxss') + '\n', '')
}

function splitImportAndStyleCode(cssInStyle) {
  const GET_IMPORT_REG = /\@import\s*['|"](.+)['|"];/g
  let importCssCode = []
  let importCssPath = []
  let pureCssCode
  
  if (GET_IMPORT_REG.test(cssInStyle)) {
    importCssCode = cssInStyle.match(GET_IMPORT_REG)
    cssInStyle.replace(GET_IMPORT_REG, (s, path) => importCssPath.push(path))
  }
  pureCssCode = cssInStyle.replace(GET_IMPORT_REG, '')

  return {
    importCssCode,
    importCssPath,
    pureCssCode
  }
}

module.exports = {
  compileLess,
  splitImportAndStyleCode
}