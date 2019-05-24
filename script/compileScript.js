/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 15:37:27 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-24 09:03:59
 */

const path = require('path')
const babel = require('babel-core')
const types = require('babel-types')
const generate = require('babel-generator').default

const babelCompiler = require('../compiler/babel-compiler')
const traverseJsInWpy = require('../traverse/traverseJsInWpy')
const {
  safeGet,
  upperStart
} = require('../utils')
const {
  checkAndReplaceAlias,
  appendFileSuffix,
  checkIsNpmModuleAndRetDetail
} = require('./utils')


module.exports = function compileScript(scriptCode, file) {
  const { filePath } = file
  let exportDefaultName
  let config = {}
  let components = {}
  let mpRootFunc
  let fileType

  let compiled = babelCompiler(scriptCode, {
    removeComponent() {
      return true
    },
    collectWepyConfig(_config) {
      config = _config
    },
    collectWepyComponents(_comps) {
      // replace comps.path to relative path
      Object.entries(_comps).forEach(([com, pathMayBeWithAlias]) => {
        // TODO: undefined待处理
        if (!pathMayBeWithAlias) {
          console.log(_comps);
        }
        const {flag: hasAlias, removeAliasModuleName} = checkAndReplaceAlias(pathMayBeWithAlias)
        const absoluteCompPath = hasAlias ? removeAliasModuleName : pathMayBeWithAlias
        let relativeSymbol = path.relative(path.dirname(filePath), path.dirname(absoluteCompPath))
        relativeSymbol = relativeSymbol.charAt(0) === '.' ? relativeSymbol : '.'
        const modifiedRelativePath = path.join(relativeSymbol, path.basename(absoluteCompPath))

        components[com] = modifiedRelativePath
      })
    },
    getWepyFileType(_fileType) {
      fileType = _fileType
    },
    getWepyFileBody(_body) {
      exportDefaultName = _body
    },
    replaceRequirePath(requireExpression) {
      return traverseJsInWpy(filePath, requireExpression)
    },
    removeRequireNode(requireExpression) {
      let absoluteCompPath
      const {flag: hasAlias, removeAliasModuleName} = checkAndReplaceAlias(requireExpression)
      if (hasAlias) {
        absoluteCompPath = removeAliasModuleName
      } else {
        const isNpm = checkIsNpmModuleAndRetDetail(requireExpression).flag
        absoluteCompPath = isNpm ? requireExpression : path.resolve(path.dirname(filePath), requireExpression)
      }
      // if (!hasAlias && !isNpm) {
      //   console.log('NOALIAS');
      //   console.log(absoluteCompPath);
      // }
      const isWpy = isWpyFile(absoluteCompPath)
      return isWpy
    }
  })
  return {
    script: compiled.code,
    config: config,
    fileType: fileType,
    usingComponents: components,
    mpRootFunc: `${upperStart(fileType)}(${exportDefaultName})`
  }
}

function isWpyFile(absPathOrNpmModule) {
  if (['.', '/'].includes(absPathOrNpmModule.charAt(0))) {
    const entireAbsPath = appendFileSuffix(absPathOrNpmModule)
    return path.extname(entireAbsPath) === '.wpy'
  }
  return false
}