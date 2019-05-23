/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 15:37:27 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-23 14:59:55
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
  checkAndReplaceAlias
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
