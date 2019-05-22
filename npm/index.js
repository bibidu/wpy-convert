/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-16 08:01:08 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-22 23:35:43
 */

const path = require('path')
const fs = require('fs')
const babel = require('babel-core')

const config = require('../config')
const {
  logger,
} = require('../utils')
const fileUtils = require('../utils/file')
const {
  checkIsNpmModuleAndRetDetail,
  getNpmModule
} = require('../script/utils')

/**
 * 解析npm模块
 * 
 * @param {*} source npm源文件的绝对路径
 * 
 * @example: /Users/mr.du/Desktop/owns/wpy-revert/reciteword/node_modules/regenerator
 */
function traverseNpm(npmAbsPathWithSuffix, pkg) {
  const entry = npmAbsPathWithSuffix
  
  // 读取入口文件引入项、遍历复制文件、npm模块绝对路径
  traverseRequire({ entry, pkg })
}

/**
 * 从开发者模块作入口, 解析引入的npm模块
 *
 * @param {*} { entry, npmModuleName } 开发者自定义js文件、引用到的npm模块名
 */
function resolveNpmFromDevModule({ entry, npmModuleName }) {
  const { entry: pEntry, output: pOutput, sourceEntry } = config.project
  
  //  若moduleName是该npm入口, 则添加main.js
  //  若不是, 则添加自动补全, eg: .js|/index.js
  let npmFilePath
  if (npmModuleName.includes('/')) {
    npmFilePath = addExt(
      pEntry + '/node_modules/' + npmModuleName
    )
  } else {
    npmFilePath = grabNpmEntryInfo(
      pEntry + '/node_modules/' + npmModuleName
    ).entry
  }
  entry = entry.replace(pEntry, pOutput).replace(sourceEntry, '')
  npmFilePath = npmFilePath.replace(pEntry, pOutput).replace('node_modules', 'npm')

  return path.join(
    path.relative(path.dirname(entry), path.dirname(npmFilePath)),
    path.basename(npmFilePath)
  )
}

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

/**
 * 读取入口文件引入项、遍历复制文件
 * 
 * @param {*} entry 
 * @param {*} pkg 
 * @param {*} content 
 */
function traverseRequire({ entry, pkg, fileContent }) {
  const distPath = entry.replaceRoot().replaceNodeModules().replaceSourceCode()
  
  let content = fileContent || fs.readFileSync(entry)
  if (!content) {
    return logger.error(`traverseRequire method: file should not be null in entry ${entry}`)
  }
  content = content.toString()
  // 获取文件依赖并替换其中npm模块路径
  let {
    dependencies: relativeDeps,
    code: newContent
  } = grabDependencies({entry, distPath, pkg, content})


  /* 写入npm模块文件到dist */
  fileUtils.createAndWriteFile(distPath, newContent)
  
  let absoluteDeps = []
  let current
  for (let i = 0; i < relativeDeps.length; i++) {
    current = relativeDeps[i]
    
    const { flag, moduleName, rest } = pkg && pkg.dependencies ? checkIsNpmModuleAndRetDetail(current, pkg.dependencies) :  checkIsNpmModuleAndRetDetail(current)

    if (flag) {
      const { npmAbsPath, pkg } = getNpmModule(current)

      absoluteDeps.push(npmAbsPath)
      traverseNpm(npmAbsPath, pkg)
      continue
    }
    
    const npmAbsPath = addExt(path.resolve(path.dirname(entry), current))
    absoluteDeps.push(npmAbsPath)
  }

  absoluteDeps.forEach(dep => {
    traverseRequire({
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
  const visitor = {
    CallExpression(_path) {
      const { callee, arguments } = _path.node
      if (callee.name === 'require') {
        const depName = arguments[0].value
        dependencies.push(depName)

        const { flag, moduleName, rest } = pkg && pkg.dependencies ? checkIsNpmModuleAndRetDetail(depName, pkg.dependencies) : checkIsNpmModuleAndRetDetail(depName)
        
        if (flag) {
          const project = config.project

          // 1.当前npm文件的绝对路径
          let npmAbsolute = entry
          // 2.引入的npm模块的绝对路径
          let importNpmAbsolute = project.entry + '/node_modules/' + depName


          importNpmAbsolute = moduleName === depName ? grabNpmEntryInfo(importNpmAbsolute).entry : importNpmAbsolute + '/t.js'
          // 3.求上面两者的dirname然后relative
          const relativeA2B = path.relative(path.dirname(npmAbsolute), path.dirname(importNpmAbsolute))


          // autoAddExtAccordRelativePath传1、3得到结果
          const rst = autoAddExtAccordRelativePath(npmAbsolute, depName, true)
          arguments[0].value = rst
          return
        }
        // npm模块引入的非npm模块文件路径， 如wepy-async-function引入 ./global
        const beforePath = arguments[0].value
        const afterPath = autoAddExtAccordRelativePath(entry, beforePath)
        arguments[0].value = afterPath
      }
    }
  }
  let t = babel.transform(content, {
    plugins: [
        { visitor },
    ]
  })
  return {
    dependencies,
    code: t.code
  }
}
/**
 * 
 * @param {*} entry 入口[绝对路径] /User/mr.du/Desktip/recite/node_modules/wepy-redux/lib/index.js
 * @param {*} relativePathOrNpmModuleName 相对路径或npm模块名 ./store
 * 
 * @return {string} ./store.js | ./store/index.js
 */
// /Users/mr.du/Desktop/owns/wpy-revert/reciteword/node_modules/redux-actions/lib/combineActions.js
// ../../invariant
function autoAddExtAccordRelativePath(entry, relativePathOrNpmModuleName, allNpm) {
  let newPath
  // TODO: 是否无需该行替换
  entry = entry.replace(config.project.output, config.project.entry)
  if (allNpm) {
    // newPath = path.resolve(path.dirname(entry), relativePath) + 
    const moduleInfo = getNpmModule(relativePathOrNpmModuleName)
    newPath = moduleInfo.npmAbsPath
  } else {
    newPath = addExt(path.resolve(path.dirname(entry), relativePathOrNpmModuleName))
  }
  let withDotPath = path.relative(path.dirname(entry), path.dirname(newPath)) || '.'
  withDotPath = withDotPath.charAt(0) === '.' ? `${withDotPath}/` : `./${withDotPath}/`
  return withDotPath + path.basename(newPath)
}
/**
 * 添加path的后缀名
 * 
 * @param {*} _path 
 */
function addExt(_path) {
  const reg = /\.\w+$/
  const defaultSuffix = '.js'
  
  if (!reg.test(_path)) {
    const addJsSuffixPath = _path + '.js'
    if (!fs.existsSync(addJsSuffixPath)) {
      _path = path.join(_path, 'index.js')
      if (fs.existsSync(_path)) {
        return _path
      }
      return logger.error(`auto add suffix fail: ${_path}`)
    }
    return addJsSuffixPath
  } else {
    return _path
  }
}


module.exports = {
  traverseNpm,
  addExt,
  traverseRequire,
  resolveNpmFromDevModule,
  autoAddExtAccordRelativePath
}