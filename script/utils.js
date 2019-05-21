/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-19 21:15:08 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-21 16:15:33
 */
const fs = require('fs')
const path = require('path')
const config = require('../config')
const wepyrc = require(config.project.entry + '/wepy.config.js')
const { logger } = require('../utils')

String.prototype.replaceRoot = function() { return this.replace(config.project.entry, config.project.output)}
String.prototype.replaceSourceCode = function() { return this.replace(config.project.sourceEntry, '')}
String.prototype.replaceNodeModules = function() { return this.replace('node_modules', 'npm')}


/**
 * 是否是npm模块
 * 
 * @param {*} moduleName 
 * @param {*} currDependencies 
 */
function isNpmModuleName(current, currDependencies) {
  const [ moduleName, ...rest ] = current.split('/')

  const entry = config.project.entry
  const _project = require(entry + '/package.json')
  project = _project
  const dependencies = currDependencies || _project.dependencies
  const flag = Object.keys(dependencies).indexOf(moduleName) > -1

  return {
    flag, moduleName, rest
  }
}


/**
 * 获取npm模块信息
 * 
 * @param {*} npmModuleName npm模块名(wepy-redux | regenerator-runtime/runtime)
 */
function getNpmModule(npmModuleName) {
  let pkg
  let npmAbsPath
  let npmEntryAbsPath
  let npmPathPrefix

  const { entry } = config.project
  const npmRootFile = npmModuleName.includes('/')

  if (npmRootFile) {
    npmAbsPath = appendFileSuffix(npmModuleName)
    npmModuleName = npmModuleName.split('/')[0]
  }

  // npm路径前缀
  npmPathPrefix = `${entry}/node_modules/${npmModuleName}/`

  const pkgPath = `${npmPathPrefix}package.json`
  pkg = require(pkgPath)
  npmEntryAbsPath = `${npmPathPrefix}${pkg.main}`
  npmAbsPath = npmAbsPath || npmEntryAbsPath
  
  return {
    pkg,
    npmAbsPath,
    npmEntryAbsPath
  }
}
/**
 * 自动追加文件后缀
 * 
 * @param {*} filePath 
 */
function appendFileSuffix(filePath, priority) {
  if (/\.\w+$/.test(filePath)) return filePath

  const defaultSuffix = ['.js', '.wpy', '/index.js']
  if (priority) {
    const index = defaultSuffix.findIndex(suf => suf === priority)
    defaultSuffix.unshift(...defaultSuffix.splice(index, 1))
  }
  for (let i = 0; i < defaultSuffix.length; i++) {
    if (fs.existsSync(filePath + defaultSuffix[i])) {
      return filePath + defaultSuffix[i]
    }
  }
  
  logger.error(`appendFileSuffix failed: ${filePath}`)
}

/**
 * 返回引用npm的编译后路径  
 * [个人 npm]
 * [npm npm]
 * 
 * @param {*} devModuleAbsPath 个人/npm模块绝对路径
 * @param {*} npmModuleName 内部引入的npm模块名
 * 
 *    @example:
 *      - /Users/mr.du/Desktop/owns/wpy-revert/reciteword/src/app.wpy
 *      - promise-polyfill
 *      - false
 *    @return
 *      ./npm/promise-polyfill/lib/index.js
 * 
 *    @example:
 *      - /Users/mr.du/Desktop/owns/wpy-revert/reciteword/node_modules/wepy/lib/wepy.js
 *      - promise-polyfill
 *      - true
 *    @return
 *      ../../promise-polyfill/lib/index.js
 * 
 */
function revertNpmInModule(moduleAbsPath, npmModuleName, allNpm) {
  let replacedRelativePath
  let { npmAbsPath } = getNpmModule(npmModuleName)
  if (!allNpm) {
    // 转换成dist目录的路径
    moduleAbsPath = moduleAbsPath.replaceRoot().replaceSourceCode()
    npmAbsPath = npmAbsPath.replaceRoot().replaceNodeModules()
  }

  // TODO: abs2relative复用
  let relativeSymbol = path.relative(
    path.dirname(moduleAbsPath),
    path.dirname(npmAbsPath)
  )
  relativeSymbol = relativeSymbol.charAt(0) === '.' ? relativeSymbol : `./${relativeSymbol}`
  replacedRelativePath = relativeSymbol + '/' + path.basename(npmAbsPath)

  // 继续递归该npm依赖的其它npm包
  // 遍历npmAbsPath 找寻require 若本地 则直接取 若npm 则传入entry前缀
  // 入口： geNpmModule得到的pkg

  return replacedRelativePath
}

/**
 * 
 * @param {*} moduleAbsPath 个人/npm模块绝对路径
 * @param {*} relativePath 相对路径
 * 
 *  @example:
 *     - /Users/mr.du/Desktop/owns/wpy-revert/reciteword/node_modules/wepy/lib/app.js
 *     - ./wepy
 *  @return
 *    ./wepy.js
 *  @example:
 *     - /Users/mr.du/Desktop/owns/wpy-revert/reciteword/src/app.wpy
 *     - ./common/api
 *  @return
 *    ./common/api/index.js
 * 
 */
function revertRelativeModule(moduleAbsPath, relativePath) {
  let requireAbsPath = path.resolve(path.dirname(moduleAbsPath), relativePath)
  requireAbsPath = appendFileSuffix(requireAbsPath)

  // TODO: abs2relative复用
  let relativeSymbol = path.relative(
    path.dirname(moduleAbsPath),
    path.dirname(requireAbsPath)
  )
  if (!relativeSymbol) 
    return `./${path.basename(requireAbsPath)}`
  if (relativeSymbol.charAt(0) === '.')
    return `${relativeSymbol}/${path.basename(requireAbsPath)}`
  return `./${relativeSymbol}/${path.basename(requireAbsPath)}`
}

/**
 *
 *
 * @param {*} absolutePath 当前文件绝对路径
 * @param {*} requireAbsolutePath 引入模块的绝对路径
 * 
 * @example:
 *    /Users/duxianzhang/Desktop/own/wpy-revert/reciteword/src/common/api/aaa.js
 *    /Users/duxianzhang/Desktop/own/wpy-revert/reciteword/src/common/api/base.js
 * 
 * @tips:
 *    requireAbsolutePath是npm路径时需提前特别处理
 * @returns
 */
function abs2relative(absolutePath, requireAbsolutePath) {
  let relativeSymbol = path.relative(
    path.dirname(absolutePath),
    path.dirname(requireAbsolutePath)
  )
  if (!relativeSymbol) 
    return `./${path.basename(requireAbsolutePath)}`
  if (relativeSymbol.charAt(0) === '.')
    return `${relativeSymbol}/${path.basename(requireAbsolutePath)}`
  
    // [F] fix bug: when relativeSymbol is not start with dot, eg. reducer.
    // need append './'
  return `./${relativeSymbol}/${path.basename(requireAbsolutePath)}`
}

/**
 * 检查、替换模块名中的别名
 * [about] alias/replaceAlias
 * 
 * @param {*} module require的模块名
 * @example 
 *    require('generator-runtime/runtime')其中的generator-runtime/runtime
 */
function checkAndReplaceAlias(module) {
  const alias = Object.keys(wepyrc.resolve.alias)
  for (let i = 0; i < alias.length; i++) {
    if (module.includes(alias[i])) {
      return {
        flag: true,
        alias: alias[i],
        aliasValue: wepyrc.resolve.alias[alias[i]],
        removeAliasModuleName: module.replace(alias[i], wepyrc.resolve.alias[alias[i]] )
      }
    }
  }
  return { flag: false }
}

module.exports = {
  isNpmModuleName,
  appendFileSuffix,
  revertNpmInModule,
  revertRelativeModule,
  checkAndReplaceAlias,
  abs2relative
}

