/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 16:46:46 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-14 21:44:45
 */

const path = require('path')
const config = require('../../config')

let project = {}
let wepyrc = {}

/**
 * 是否是npm模块
 * 
 * @param {*} moduleName 
 */
function isNpm(moduleName) {
  const entry = config.project.entry
  const _project = require(entry + '/package.json')
  project = _project
  const dependencies = _project.dependencies
  return Object.keys(dependencies).indexOf(moduleName) > -1
}

/**
 * 缓存wepy.config.js文件
 */
function cacheWepyrc() {
  try {
    wepyrc = require(config.project.entry + '/wepy.config.js')
  } catch (error) {
    console.log(error);
    console.log(`未找到wepy.config.js`);
  }
}

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
  // test
  cacheWepyrc()

  // 替换别名
  importPath = replaceAlias(importPath)
  
  const { entry, output } = config.project
  let source
  let end
  let newPath

  if (isNpm(importPath)) {
    source = path.resolve(entry, './node_modules/' + importPath)
    end = source.replace(entry, output).replace('node_modules', 'src/npm')
    newPath = path.relative(path.dirname(filePath), source.replace('node_modules', 'src/npm'))
    // console.log(`[npm module] ${path.basename(importPath)}`);
  } else {
    source = path.resolve(entry, importPath)
    end = source.replace(entry, output)
    newPath = path.relative(path.dirname(filePath), source)
    // console.log(`[personal module] ${path.basename(importPath)}`);
  }
  
  return newPath
}