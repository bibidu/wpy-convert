/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 16:46:46 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-19 21:05:30
 */

const path = require('path')
const fs = require('fs')
const config = require('../../config')
const wepyrc = require(config.project.entry + '/wepy.config.js')
const {
  resolveNpm,
  isNpm,
  autoAddExtAccordRelativePath
} = require('../../npm')
const {
  npmEntry2opt
} = require('../../npm/utils')
const {
  logger
} = require('../../utils')
const {
  projectEntry2opt
} = require('../../utils/utils')
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
 * 创建响应文件并更改调用路径
 * 
 * @param {*} moduleName require引入第三方模块的路径
 * @param {*} filePath 当前文件所在绝对路径 
 * 
 * @return {*} 新路径
 */
// '/Users/mr.du/Desktop/owns/wpy-revert/reciteword/src/pages/answer.wpy'
module.exports = function copyModuleRetNewPath(moduleName, filePath) {

  moduleName = replaceAlias(moduleName)
  
  const { entry, sourceEntry } = config.project
  let source
  let end
  let newPath

  console.log('=============');
  console.log(moduleName);
  // /Users/mr.du/Desktop/owns/wpy-revert/reciteword/src/app.wpy
  console.log(filePath);
  if (isNpm(moduleName).flag) {


    revertNpmInDevModule(filePath, moduleName)

    // /Users/mr.du/Desktop/owns/wpy-revert/reciteword/node_modules/wepy-redux
    source = path.resolve(entry, './node_modules/' + moduleName)
    const { main } = getNpmPkg(source)

    newPath = path.relative(path.dirname(filePath), npmEntry2opt(source))
    // 添加main指向的路径
    newPath = path.join(newPath, main)
    // npm/wepy --> ./npm/wepy
    newPath = newPath.charAt(0) !== '.' ? `./${newPath}` : newPath

    console.log('source ', source);
    // ./npm/wepy-redux/lib/index.js
    console.log('newPath ', newPath);
    
    /* 解析项目中npm模块 */
    resolveNpm(source)

    return newPath
  } else {
    moduleName = addExt(moduleName.charAt(0) === '.' ? path.resolve(path.dirname(filePath), moduleName) : moduleName)
    const relativeDot = path.relative(path.dirname(filePath), moduleName)
    let t = autoAddExtAccordRelativePath(filePath, relativeDot)
    return t
    // /Users/duxianzhang/Desktop/own/wpy-revert/reciteword/src/store/index.js
    source = addExt(path.resolve(path.join(entry, sourceEntry, moduleName)))
    // /Users/duxianzhang/Desktop/own/wpy-revert/dist_reciteword/src/store/index.js
    // end = projectEntry2opt(source)

    const newRelativePath = path.join(path.relative(path.dirname(filePath), path.dirname(source)), path.basename(source))
    return newRelativePath.charAt(0) !== '.' ? `./${newRelativePath}` : newRelativePath
  }
}  

/**
 * 添加path的后缀名
 * 
 * @param {*} path 
 */
function addExt(path) {
  const reg = /\.\w+$/
  const defaultSuffix = '.js'
  
  if (!reg.test(path)) {
    const addJsSuffixPath = path + '.js'
    if (!fs.existsSync(addJsSuffixPath)) {
      if (fs.existsSync(path + '.wpy')) {
        return path + '.wpy'
      }
      path = path + '/index.js'
      if (fs.existsSync(path)) {
        return path
      }
      return logger.error(`auto add suffix fail1: ${path}`)
    }
    return addJsSuffixPath
  }
  return path
}