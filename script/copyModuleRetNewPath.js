/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 16:46:46 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-20 16:46:33
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
    // source = path.resolve(entry, './node_modules/' + moduleName)
    // const { main } = getNpmPkg(source)

    // newPath = path.relative(path.dirname(filePath), source.replaceNodeModules())
    // newPath = path.join(newPath, main)
    // newPath = newPath.charAt(0) !== '.' ? `./${newPath}` : newPath

    source = path.resolve(entry, './node_modules/' + moduleName)
    newPath = revertNpmInModule(filePath, moduleName)

    /* 解析项目中npm模块 */
    resolveNpm(source)

  } else {
    // moduleName = addExt(moduleName.charAt(0) === '.' ? path.resolve(path.dirname(filePath), moduleName) : moduleName)
    // const relativeDot = path.relative(path.dirname(filePath), moduleName)
    // let t = autoAddExtAccordRelativePath(filePath, relativeDot)
    newPath = revertRelativeModule(filePath, moduleName)
  }
  return newPath
}  

// /**
//  * 添加path的后缀名
//  * 
//  * @param {*} path 
//  */
// function addExt(path) {
//   const reg = /\.\w+$/
//   const defaultSuffix = '.js'
  
//   if (!reg.test(path)) {
//     const addJsSuffixPath = path + '.js'
//     if (!fs.existsSync(addJsSuffixPath)) {
//       if (fs.existsSync(path + '.wpy')) {
//         return path + '.wpy'
//       }
//       path = path + '/index.js'
//       if (fs.existsSync(path)) {
//         return path
//       }
//       return logger.error(`auto add suffix fail1: ${path}`)
//     }
//     return addJsSuffixPath
//   }
//   return path
// }