/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 15:37:27 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-23 08:11:51
 */

const babel = require('babel-core')
const types = require('babel-types')
const generate = require('babel-generator').default

const babelCompiler = require('../compiler/babel-compiler')
const traverseJsInWpy = require('./traverseJsInWpy')
const {
  safeGet,
  upperStart
} = require('../utils')


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
      components = _comps
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
