/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-16 08:01:08 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-23 12:53:07
 */

const path = require('path')
const fs = require('fs')
// const babel = require('babel-core')

const babelCompiler = require('../compiler/babel-compiler')
const config = require('../config')
const {
  logger,
} = require('../utils')
const fileUtils = require('../utils/file')
const {
  checkIsNpmModuleAndRetDetail,
  getNpmModule,
  twoAbsPathToRelativePath,
  appendFileSuffix
} = require('../script/utils')


/**
 * 获取npm模块的入口文件绝对路径
 * 
 * @param {*} modulePath npm模块的绝对路径
 */
function grabNpmEntryInfo(modulePath) {
  const pkg = require(modulePath + '/package.json')
  const main = pkg.main || 'index.js'

  return {
    entry: path.join(modulePath, main),
    pkg: pkg
  }
}

module.exports = function traverseNpm({ entry: entireNpmAbsPath, pkg, fileContent }) {
  let absoluteDeps = []
  let requireExpression
  let content
  
  const distPath = entireNpmAbsPath.replaceRoot().replaceNodeModules().replaceSourceCode()
  
  content = fileContent || fs.readFileSync(entireNpmAbsPath)
  if (!content) {
    return logger.error(`traverseNpm method: file should not be null in entry ${entireNpmAbsPath}`)
  }
  content = content.toString()
  
  let {
    dependencies: requireExpressions,
    code: modifiedCode
  } = grabDependencies({entry: entireNpmAbsPath, distPath, pkg, content})

  

  /* 写入npm模块文件到dist */
  fileUtils.createAndWriteFile(distPath, modifiedCode)
  
  for (let i = 0; i < requireExpressions.length; i++) {
    requireExpression = requireExpressions[i]
    
    const { flag: isNpm, moduleName, rest } = checkIsNpmModuleAndRetDetail(requireExpression, pkg && pkg.dependencies)

    if (isNpm) {
      const { npmAbsPath, pkg: newPkg } = getNpmModule(requireExpression)
      
      // fix bug: add repeatedly entry to traverseNpm
      // absoluteDeps.push(npmAbsPath)
      traverseNpm({ entry: npmAbsPath, pkg: newPkg })
      continue
    }

    const requireAbsPathMayBeNoSuffix = path.resolve(path.dirname(entireNpmAbsPath), requireExpression)
    const requireAbsPath = appendFileSuffix(requireAbsPathMayBeNoSuffix)

    absoluteDeps.push(requireAbsPath)
  }

  absoluteDeps.forEach(dep => {
    traverseNpm({
      entry: dep,
      pkg: pkg
    })
  })
}

/**
 * 获取文件依赖并替换其中npm模块路径
 * 
 * @param {*} entry 入口绝对路径
 * @param {*} content 
 */
function grabDependencies({entry, distPath, pkg, content}) {
  let dependencies = []
  
  let compiled = babelCompiler(content, {
    replaceRequirePath(requireExpression) {
      
      dependencies.push(requireExpression)

      const { flag, moduleName, rest } = checkIsNpmModuleAndRetDetail(requireExpression, pkg && pkg.dependencies)
      
      if (flag) {
        
        const { npmAbsPath } = getNpmModule(requireExpression)
        
        let t = twoAbsPathToRelativePath(entry, npmAbsPath)

        return t
      }
      const requireAbsPathMayBeNoSuffix = path.resolve(path.dirname(entry), requireExpression)
      const requireAbsPath = appendFileSuffix(requireAbsPathMayBeNoSuffix)

      return twoAbsPathToRelativePath(entry, requireAbsPath)
    }
  }, false)
  return {
    dependencies,
    code: compiled.code
  }
}

