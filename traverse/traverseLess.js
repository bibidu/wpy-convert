/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-25 09:13:25 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-25 19:25:50
 */

const fs = require('fs')
const path = require('path')
const babelCompiler = require('../compiler/babel-compiler')
const {
  checkAndReplaceAlias,
  appendFileSuffix,
  checkIsNpmModuleAndRetDetail,
  revertNpmInModule,
  twoAbsPathToRelativePath,
  getNpmModule
} = require('../script/utils')
const traverseNpm = require('./traverseNpm')
const fileUtils = require('../utils/file')
const {
  logger,
  stringify,
  safeGet
} = require('../utils')
const compileStyle = require('../style/compileStyle')
const cache = require('../utils/cache')



function traverseLess(requireCssPaths, file) {
  const { filePath } = file
  let absPath
  
  // lessEntry: relativePath

  requireCssPaths.forEach(requirePath => {
    console.log('requirePath//////');
    absPath = path.join(
      path.resolve(filePath, path.dirname(requirePath)),
      path.basename(requirePath)
    )
    console.log(absPath);
    if (absPath in cache.writeRecord) {
      return
    }
    cache.writeRecord[absPath] = true
  
    const compiled = compileStyle('less', fs.writeFileSync(absPath), absPath)
    fileUtils.createAndWriteFile(absPath, compiled)
  })
  // /* 收集引用模块的相对路径(带后缀) */
  // let requireRelativePathArr = []
  // let code

  // try {
  //   code = fs.readFileSync(jsEntry)
  // } catch (error) {
  //   logger.error(`[readFileSync] jsEntry: ${jsEntry}`);
  // }
  

  // if (!compiled) {
  //   logger.error(`compiled is undefined- entry: ${jsEntry}`)
  // }
  // const distFilePath = jsEntry.replaceRoot().replaceSourceCode()

  // fileUtils.createAndWriteFile(distFilePath, compiled.code)
  
  
  // traverseRequireInJs({entry: jsEntry, requireRelativePathArr})

}


module.exports = traverseLess