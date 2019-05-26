/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-23 07:32:49 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-26 12:46:29
 */

const fs = require('fs')
const path = require('path')
const fileUtils = require('../utils/file')
const cache = require('../utils/cache')
const {
  logger
} = require('../utils')
const {
  compileLess,
  splitImportAndStyleCode
} = require('./compileLess')

function compileStyle(type, styleCode, filePath) {
  if (type === 'less') {
    let {
      importCssCode,
      importCssPath,
      pureCssCode
    } = splitImportAndStyleCode(styleCode)
    // revert declaraction of variable in import outer less to current page compiler process
    lessVariables = getLessVariableFromOuterLess(importCssPath, filePath)
    let t = compileLess(
      importCssCode,
      lessVariables.length ?
        lessVariables.reduce((pV, cV) => `${pV}\n${cV}\n`) + pureCssCode
        : pureCssCode
    )
    // t.then(r => {
    //   console.log(`${filePath}.result: ${r}`);
    // })
    return t
  }
  return console.log(`[error] cannot find compiler of ${type}`);
}

/**
 * 从引入的外部less文件中提取less的变量声明
 * @param {*} importCssPath 
 * @example
 *    @color: #ccc;
 */
function getLessVariableFromOuterLess(requireCssPaths, filePath) {
  const RE_LESS_DECLARATION = /@\w+\:\s*.+\;/g
  let lessVariables = []
  
  requireCssPaths.forEach(requirePath => {
    let absPath
    let requireFileContent = ''

    absPath = path.join(
      path.resolve(path.dirname(filePath), path.dirname(requirePath)),
      path.basename(requirePath)
    )

    try {
      requireFileContent = fs.readFileSync(absPath)
    } catch (error) {
      console.log('getLessVariableFromOuterLess error', error);
    }
    requireFileContent = requireFileContent.toString()

    // traverse compile
    compileStyle('less', requireFileContent, absPath)
      .then(code => {
        // TODO: 由于当前less和引入外部less目前不是顺序编译写入，导致并不能把空less文件的页面引入语句删去，
        //       故即使是空less文件，目前也进行less文件的创建。
        // if (!code) return
        fileUtils.createAndWriteFile(
          absPath.replaceRoot().replaceSourceCode().replace('.less', '.wxss'),
          code
        )
      })
    

    let { importCssPath, pureCssCode } = splitImportAndStyleCode(requireFileContent)

    if (importCssPath.length) {
      lessVariables.unshift(...getLessVariableFromOuterLess(importCssPath, absPath))
    }

    if (RE_LESS_DECLARATION.test(pureCssCode)) {
      let cacheBunch = []
      let content = pureCssCode.match(RE_LESS_DECLARATION)
      const pushVariable = (pVariable, cVariable) => {
        pVariable.push(cVariable)
        return pVariable
      }
      content.reduce(pushVariable, cacheBunch)
      lessVariables.unshift(...cacheBunch)
    }
  })
  return lessVariables
}

module.exports = compileStyle