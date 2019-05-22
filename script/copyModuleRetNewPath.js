/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 16:46:46 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-22 06:04:54
 */

const path = require('path')
const fs = require('fs')
const config = require('../config')
const wepyrc = require(config.project.entry + '/wepy.config.js')
const {
  resolveNpm,
  autoAddExtAccordRelativePath
} = require('../npm')
const {
  logger
} = require('../utils')
const {
  isNpmModuleName,
  revertNpmInModule,
  revertRelativeModule
} = require('./utils')
let project = {}




/**
 * 
 * @param {*} path require引入的模块名
 */
function replaceAlias(path) {
  const aliases = wepyrc.resolve.alias
  const keys = Object.keys(aliases)

  for (let i = 0; i < keys.length; i++) {
    if (path.indexOf(keys[i]) > -1) {
      path = path.replace(keys[i], aliases[keys[i]])
    }
  }
  return path
}


function getNpmPkg(npmPath) {
  const pkg = require(npmPath + '/package.json')
  return pkg
}


/**
 * 创建引用文件并更改调用路径
 * 
 * @param {*} filePath 当前文件所在绝对路径 
 * @param {*} moduleName require引入第三方模块的路径
 * 
 * @return {*} 新路径
 */
// '/Users/mr.du/Desktop/owns/wpy-revert/reciteword/src/pages/answer.wpy'
module.exports = function copyModuleRetNewPath(filePath, moduleName) {

  moduleName = replaceAlias(moduleName)
  
  const { entry, sourceEntry } = config.project
  let source
  let end
  let newPath

  if (isNpmModuleName(moduleName).flag) {

    source = path.resolve(entry, './node_modules/' + moduleName)
    newPath = revertNpmInModule(filePath, moduleName)

    /* 解析项目中npm模块 */
    resolveNpm(source)

  } else {

    newPath = revertRelativeModule(filePath, moduleName)
  }
  return newPath
}  