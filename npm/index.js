/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-16 08:01:08 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-20 16:07:21
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
  isNpmModuleName
} = require('../script/utils')

/**
 * 解析npm模块
 * 
 * @param {*} source 
 */
function resolveNpm(source) {
  // 获取入口文件信息
  const { entry, pkg } = grabNpmEntryInfo(source)
  
  // 读取入口文件引入项、遍历复制文件、npm模块绝对路径
  traverseRequire({ entry, pkg, source })
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
 * @param {*} path npm模块的入口文件绝对路径
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
  // fileUtils.createAndWriteFile(distPath, content)
  
  let absoluteDeps = []
  let current
  for (let i = 0; i < relativeDeps.length; i++) {
    current = relativeDeps[i]
    
    
    const { flag, moduleName, rest } = pkg && pkg.dependencies ? isNpmModuleName(current, pkg.dependencies) :  isNpmModuleName(current)
    if (flag) {
      current = path.resolve(config.project.entry, './node_modules/' + moduleName)
      if (rest.length) {
        absoluteDeps.push(addExt(current + rest.reduce((p, c) => p + c, '/')))
        continue
      }
      resolveNpm(current)
      continue
    }
    
    let addExtRelativePath = autoAddExtAccordRelativePath(entry, current)
    const _isNpm = !!addExtRelativePath.includes('npm')
    const withExpPath = _isNpm ?
      addExtRelativePath.replace('npm', 'node_modules')
      : addExtRelativePath
    current = path.resolve(path.dirname(entry), path.dirname(withExpPath)) + '/' + path.basename(withExpPath)
    if (_isNpm) {
      current = current.replace(config.project.sourceEntry, '')
    }
    absoluteDeps.push(current)
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

        const { flag, moduleName, rest } = pkg && pkg.dependencies ? isNpmModuleName(depName, pkg.dependencies) : isNpmModuleName(depName)
        if (flag) {
          const project = config.project

          /*
          * 分两种情况
          * 1.入口为npm模块 依赖项为 其它npm/当前npm其它文件
          * 2.入口为非npm模块 依赖项为 npm模块
          */
          // 1.当前npm文件的绝对路径
          let npmAbsolute = entry
          // 2.引入的npm模块的绝对路径
          let importNpmAbsolute = project.entry + '/node_modules/' + depName
          importNpmAbsolute = moduleName === depName ? grabNpmEntryInfo(importNpmAbsolute).entry : importNpmAbsolute + '/t.js'
          // 3.求上面两者的dirname然后relative
          const relativeA2B = path.relative(path.dirname(npmAbsolute), path.dirname(importNpmAbsolute))
          // autoAddExtAccordRelativePath传1、3得到结果
          const rst = autoAddExtAccordRelativePath(npmAbsolute, relativeA2B)
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
 * @param {*} entry /User/mr.du/Desktip/recite/node_modules/wepy-redux/lib/index.js
 * @param {*} relativePath ./store
 * 
 * @return {string} ./store.js | ./store/index.js
 */
function autoAddExtAccordRelativePath(entry, relativePath) {
  entry = entry.replace(config.project.output, config.project.entry)
  const newPath = addExt(path.resolve(path.dirname(entry), relativePath))
  let withDotPath = path.relative(path.dirname(entry), path.dirname(newPath)) || '.'
  withDotPath = withDotPath.charAt(0) === '.' ? `${withDotPath}/` : `./${withDotPath}/`
  return withDotPath + path.basename(newPath)
}
/**
 * 添加path的后缀名
 * 
 * @param {*} path 
 */
function addExt(path) {
  const reg = /\.\w+$/
  const defaultSuffix = '.js'
  
  if (!reg.test(path)) {
    const addJsSuffixPath = path + '.js'
    if (!fs.existsSync(addJsSuffixPath)) {
      path = path + '/index.js'
      if (fs.existsSync(path)) {
        return path
      }
      return logger.error(`auto add suffix fail: ${path}`)
    }
    return addJsSuffixPath
  } else {
    return path
  }
}


module.exports = {
  resolveNpm,
  addExt,
  traverseRequire,
  resolveNpmFromDevModule,
  autoAddExtAccordRelativePath
}