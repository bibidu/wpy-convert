/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 16:46:46 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-23 08:12:03
 */

const path = require('path')
const fs = require('fs')
const config = require('../config')
const {
  traverseNpm
} = require('../npm')
const {
  logger
} = require('../utils')
const {
  checkIsNpmModuleAndRetDetail,
  revertNpmInModule,
  revertRelativeModule,
  checkAndReplaceAlias,
  getNpmModule
} = require('./utils')


module.exports = function traverseJsInWpy(wpyJsAbsPath, requireExpression) {
  const { flag: hasAlias, removeAliasModuleName } = checkAndReplaceAlias(requireExpression)

  if (hasAlias) {
    requireExpression = removeAliasModuleName
  }
  
  const { entry, sourceEntry } = config.project
  let npmAbsPathFromRequireExpression
  let end
  let replacedRelativePath

  if (checkIsNpmModuleAndRetDetail(requireExpression).flag) {

    npmAbsPathFromRequireExpression = path.join(entry, 'node_modules', requireExpression)

    replacedRelativePath = revertNpmInModule(wpyJsAbsPath, requireExpression)

    /* 解析项目中npm模块 */
    const { npmAbsPath, pkg } = getNpmModule(requireExpression)
    traverseNpm({ entry: npmAbsPath, pkg })

  } else {
    replacedRelativePath = revertRelativeModule(wpyJsAbsPath, requireExpression)
  }
  return replacedRelativePath
}  