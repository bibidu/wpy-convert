/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 15:37:27 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-27 11:31:44
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

  // TODO: 临时的wepy运行时
  scriptCode = scriptCode.toString().replace("import wepy from 'wepy'", "import wepy from '@/wepy-runtime'")
  const { filePath } = file
  let exportDefaultName
  let config = {}
  let components = {}
  let mpRootFunc
  let fileType
  let sourceWepy

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
        try {
          const {flag: hasAlias, removeAliasModuleName} = checkAndReplaceAlias(pathMayBeWithAlias)
          const absoluteCompPath = hasAlias ? removeAliasModuleName : pathMayBeWithAlias
          let relativeSymbol = path.relative(path.dirname(filePath), path.dirname(absoluteCompPath))
          relativeSymbol = relativeSymbol.charAt(0) === '.' ? relativeSymbol : '.'
          const modifiedRelativePath = path.join(relativeSymbol, path.basename(absoluteCompPath))

          components[com] = modifiedRelativePath
        } catch (error) {
          console.log('error');
          console.log(_comps);
        }
      })
    },
    getWepyFileType(_fileType) {
      fileType = _fileType
    },
    getWepyFileBody(_sourceWepy, _body) {
      sourceWepy = _sourceWepy
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
      const isWpy = isWpyFile(absoluteCompPath)
      return isWpy
    }
  })
  const upperFileType = upperStart(fileType)
  return {
    script: compiled.code,
    config: config,
    fileType: fileType,
    usingComponents: components,
    mpRootFunc: `${upperFileType}(${sourceWepy}.$create${upperFileType}(${exportDefaultName}))`
  }
}

function isWpyFile(absPathOrNpmModule) {
  if (['.', '/'].includes(absPathOrNpmModule.charAt(0))) {
    const entireAbsPath = appendFileSuffix(absPathOrNpmModule)
    return path.extname(entireAbsPath) === '.wpy'
  }
  return false
}