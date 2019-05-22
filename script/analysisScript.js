/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 15:37:27 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-22 16:40:23
 */

const babel = require('babel-core')
const types = require('babel-types')
const generate = require('babel-generator').default

const babelCompiler = require('../compiler/babel-compiler')
const copyModuleRetNewPath = require('./copyModuleRetNewPath')
const {
  safeGet,
  upperStart
} = require('../utils')

/**
 * 验证是否继承自wepy
 * 
 * @param {*} object 
 */
function verifyFilePrefix(object) {
  const baseName = 'wepy'
  if (object.name !== baseName) {
    throw `未继承自${baseName}`
  }
}

/**
 * 通过AST解析script代码
 * 
 * @param {*} compiledCode 
 */
function analysisScriptByAst(compiledCode, file) {
  const { filePath } = file
  let exportDefaultName
  let config = {}
  let components = {}
  let newCompsPaths = {}
  let mpRootFunc
  let fileType

  let compiled = babelCompiler(compiledCode, {
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
      return copyModuleRetNewPath(filePath, requireExpression)
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

module.exports = analysisScriptByAst

