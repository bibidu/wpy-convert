/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-19 23:26:15 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-25 09:00:08
 */
const fs = require('fs')
const path = require('path')
const babelCompiler = require('../compiler/babel-compiler')
const {
  checkAndReplaceAlias,
  appendFileSuffix,
  checkIsNpmModuleAndRetDetail,
  revertNpmInModule,
  twoAbsPathToRelativePath,
  getNpmModule
} = require('../script/utils')
const traverseNpm = require('./traverseNpm')
const fileUtils = require('../utils/file')
const {
  logger,
  stringify,
  safeGet
} = require('../utils')
const cache = require('../utils/cache')

/**
 *
 *
 * @param {*} entry 开发者的JS文件绝对路径
 */
function traverseJs({ entry: jsEntry }) {

  if (jsEntry in cache.writeRecord) {
    // logger.green(`[exist js]has exist ${jsEntry.split('wpy-revert')[1]}`);
    return
  }
  cache.writeRecord[jsEntry] = true

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
        modifiedRequirePath = twoAbsPathToRelativePath(jsEntry, requireAbsPath)
      } else {
        requireAbsPath = appendFileSuffix(path.resolve(path.dirname(jsEntry), requireExpression))
        modifiedRequirePath = twoAbsPathToRelativePath(jsEntry, requireAbsPath)
      }
      // 收集引用模块相对路径
      requireRelativePathArr.push({
        isNpm,
        requireExpression,
        path: modifiedRequirePath,
        isWpy: requireAbsPath && path.extname(requireAbsPath) === '.wpy'
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
  
  // 遍历引入的npm模块
  requireNpmModuleNameArr.forEach(requireExpression => {
    const { npmAbsPath, pkg } = getNpmModule(requireExpression)
    traverseNpm({ entry: npmAbsPath, pkg })
  })
}

module.exports = traverseJs