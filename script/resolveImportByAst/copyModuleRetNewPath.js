/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 16:46:46 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-16 08:54:07
 */

const path = require('path')
const config = require('../../config')
const wepyrc = require(config.project.entry + '/wepy.config.js')
const {
  resolveNpm,
  isNpm
} = require('../../npm')
const {
  npmEntry2opt
} = require('../../npm/utils')
const {
  projectEntry2opt
} = require('../../utils/utils')
let project = {}




/**
 * 替换别名
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

/**
 * 创建响应文件并更改调用路径
 * 
 * @param {*} importPath 文件引入第三方模块的路径
 * @param {*} filePath 文件所在路径 
 * 
 * @return {*} 新路径
 */
// '/Users/mr.du/Desktop/owns/wpy-revert/reciteword/src/pages/answer.wpy'
module.exports = function copyModuleRetNewPath(importPath, filePath) {

  // 替换别名
  importPath = replaceAlias(importPath)
  
  const { entry } = config.project
  let source
  let end
  let newPath

  if (isNpm(importPath)) {
    source = path.resolve(entry, './node_modules/' + importPath)
    end = npmEntry2opt(projectEntry2opt(source))
    newPath = path.relative(path.dirname(filePath), npmEntry2opt(source))
    
    /* 解析项目中npm模块 */
    resolveNpm(source, end)
  } else {
    source = path.resolve(entry, importPath)
    end = projectEntry2opt(source)
    newPath = path.relative(path.dirname(filePath), source)
  }
  
  /* npm/wepy --> ./npm/wepy */
  newPath = newPath.charAt(0) !== '.' ? `./${newPath}` : newPath

  return newPath
}