/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 16:46:46 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-22 23:25:55
 */

const path = require('path')
const fs = require('fs')
const config = require('../config')
const wepyrc = require(config.project.entry + '/wepy.config.js')
const {
  traverseNpm,
  autoAddExtAccordRelativePath
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
let project = {}




/**
 * 
 * @param {*} path require引入的模块名
 */
// function replaceAlias(path) {
//   const aliases = wepyrc.resolve.alias
//   const keys = Object.keys(aliases)

//   for (let i = 0; i < keys.length; i++) {
//     if (path.indexOf(keys[i]) > -1) {
//       path = path.replace(keys[i], aliases[keys[i]])
//     }
//   }
//   return path
// }


function getNpmPkg(npmPath) {
  const pkg = require(npmPath + '/package.json')
  return pkg
}


/**
 * 
 * @param {*} wpyJsAbsPath 当前文件所在绝对路径 
 * @param {*} requireExpression require引入第三方模块的路径
 * 
 * @return {*} 新路径
 */
// '/Users/mr.du/Desktop/owns/wpy-revert/reciteword/src/pages/answer.wpy'
module.exports = function copyModuleRetNewPath(wpyJsAbsPath, requireExpression) {
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
    traverseNpm(npmAbsPath, pkg)

  } else {
    replacedRelativePath = revertRelativeModule(wpyJsAbsPath, requireExpression)
  }
  return replacedRelativePath
}  