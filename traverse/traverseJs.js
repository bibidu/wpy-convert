/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-19 23:26:15 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-23 08:02:17
 */
const fs = require('fs')
const path = require('path')
const babelCompiler = require('../compiler/babel-compiler')
const {
  checkAndReplaceAlias,
  appendFileSuffix,
  checkIsNpmModuleAndRetDetail,
  revertNpmInModule,
  abs2relative
} = require('../script/utils')
const {
  resolveNpmFromDevModule
} = require('../npm')
const fileUtils = require('../utils/file')
const {
  logger,
  stringify,
  safeGet
} = require('../utils')
// const copyModuleRetNewPath = require('../script/copyModuleRetNewPath')

/**
 *
 *
 * @param {*} entry 开发者的JS文件绝对路径
 */
function traverseJs({ entry: jsEntry }) {

  /* 收集引用模块的相对路径(带后缀) */
  let requireRelativePathArr = []
  let code

  try {
    code = fs.readFileSync(jsEntry)
  } catch (error) {
    logger.error(`[readFileSync] jsEntry: ${jsEntry}`);
  }
  
  let compiled = babelCompiler(code, {
    replaceRequirePath(requireExpression) {
      let modifiedRequirePath
      let isNpm = false
      let requireAbsPath

      const { flag: hasAlias, removeAliasModuleName } = checkAndReplaceAlias(requireExpression)

      const { flag } = checkIsNpmModuleAndRetDetail(requireExpression)

      if (isNpm = flag) {
        modifiedRequirePath = revertNpmInModule(jsEntry, requireExpression)
      } else if (hasAlias) {
        requireAbsPath = appendFileSuffix(removeAliasModuleName)
        modifiedRequirePath = abs2relative(jsEntry, requireAbsPath)
      } else {
        requireAbsPath = appendFileSuffix(path.resolve(path.dirname(jsEntry), requireExpression))
        modifiedRequirePath = abs2relative(jsEntry, requireAbsPath)
      }
      // 收集引用模块相对路径
      requireRelativePathArr.push({
        isNpm,
        requireExpression,
        path: modifiedRequirePath
      })
      
      return modifiedRequirePath
    }
  })

  if (!compiled) {
    logger.error(`compiled is undefined- entry: ${jsEntry}`)
  }
  const distFilePath = jsEntry.replaceRoot().replaceSourceCode()

  fileUtils.createAndWriteFile(distFilePath, compiled.code)

  
  traverseRequireInJs({entry: jsEntry, requireRelativePathArr})

}

function traverseRequireInJs({entry, requireRelativePathArr}) {
  // 引用文件的绝对路径数组
  let requireNpmModuleNameArr = []
  let requireAbsPathArr = []

  for (let i = 0; i < requireRelativePathArr.length; i++) {
    const { isNpm, requireExpression, path: relativePath } = requireRelativePathArr[i]

    if (isNpm) {
      requireNpmModuleNameArr.push(requireExpression)
      continue
    }
    const absPath = path.resolve(path.dirname(entry), path.dirname(relativePath)) + '/' + path.basename(relativePath)
    requireAbsPathArr.push(absPath)

  }
  
  // 遍历引入的js模块
  requireAbsPathArr.forEach(abs => traverseJs({ entry: abs }))
  // TODO: npm模块进行遍历
  // requireNpmModuleNameArr.forEach(npmModuleName => traverseNpm({ entry: npmModuleName }))
  // requireNpmModuleNameArr.forEach(item => {
  //   console.log(item, '先不创建');
  // })
}

module.exports = traverseJs