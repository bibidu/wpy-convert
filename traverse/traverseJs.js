/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-19 23:26:15 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-21 10:16:19
 */
const fs = require('fs')
const path = require('path')
const babelCompiler = require('../compiler/babel-compiler')
const {
  checkAndReplaceAlias,
  appendFileSuffix,
  isNpmModuleName,
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

/**
 *
 *
 * @param {*} { entry }
 */
function traverseJs({ entry }) {

  /* 收集引用模块的相对路径(带后缀) */
  let requireRelativePathArr = []

  let compiled = babelCompiler(fs.readFileSync(entry), {
    // TODO: ast修改require中的别名
    VariableDeclaration(_path) {
      const { declarations, kind } = _path.node
      let module
      declarations.forEach(dec => {
        if (
          safeGet(dec, 'dec.init.type') === 'CallExpression'
          && safeGet(dec, 'dec.init.callee.name') === 'require'
        ) {
          module = dec.init.arguments[0].value
          const { flag: hasAlias, removeAliasModuleName, aliasValue } = checkAndReplaceAlias(module)

          let modifiedRequirePath
          let isNpm = false
          let requireAbsPath
          

          const { flag } = isNpmModuleName(module)
          if (isNpm = flag) {
            modifiedRequirePath = revertNpmInModule(entry, module)
          } else if (hasAlias) {
            requireAbsPath = appendFileSuffix(removeAliasModuleName)
            modifiedRequirePath = abs2relative(entry, requireAbsPath)
          } else {
            requireAbsPath = appendFileSuffix(path.resolve(path.dirname(entry), module))
            modifiedRequirePath = abs2relative(entry, requireAbsPath)
          }
          // 收集引用模块相对路径
          requireRelativePathArr.push({
            isNpm,
            module,
            path: modifiedRequirePath
          })
          
          dec.init.arguments[0].value = modifiedRequirePath
          
        }
      })
    },
  })

  if (!compiled) {
    logger.error(`compiled is undefined- entry: ${entry}`)
  }
  const distFilePath = entry.replaceRoot().replaceSourceCode()
  fileUtils.createAndWriteFile(distFilePath, compiled.code)

  /* 遍历引用文件路径 */
  traverseRequireInJs({entry, requireRelativePathArr})

}

function traverseRequireInJs({entry, requireRelativePathArr}) {
  // 引用文件的绝对路径数组

  let requireNpmModuleNameArr = []
  let requireAbsPathArr = []
  for (let i = 0; i < requireRelativePathArr.length; i++) {
    const { isNpm, module, path: relativePath } = requireRelativePathArr[i]

    if (isNpm) {
      requireNpmModuleNameArr.push(module)
      continue
    }
    const absPath = path.resolve(
      path.dirname(entry),
      path.dirname(relativePath)
    ) + '/' + path.basename(relativePath)
    requireAbsPathArr.push(absPath)
  }
  
  // 遍历引入的js模块
  requireAbsPathArr.forEach(abs => traverseJs({ entry: abs }))
  // TODO: npm模块进行遍历
}

module.exports = traverseJs