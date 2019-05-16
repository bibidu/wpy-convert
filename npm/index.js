/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-16 08:01:08 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-16 22:52:30
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
  npmEntry2opt
} = require('../npm/utils')
const {
  projectEntry2opt
} = require('../utils/utils')

/**
 * 是否是npm模块
 * 
 * @param {*} moduleName 
 * @param {*} currDependencies 
 */
function isNpm(moduleName, currDependencies) {
  const entry = config.project.entry
  const _project = require(entry + '/package.json')
  project = _project
  const dependencies = currDependencies || _project.dependencies
  return Object.keys(dependencies).indexOf(moduleName) > -1
}

/**
 * 解析npm模块
 * 
 * @param {*} source 
 * @param {*} end 
 */
function resolveNpm(source, end) {

  // 获取入口文件信息
  const { entry, pkg } = grabNpmEntryInfo(source)
  
  // 读取入口文件引入项、遍历复制文件
  traverseRequire({ entry, pkg })
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
 */
function traverseRequire({ entry, pkg }) {
  const distPath = npmEntry2opt(projectEntry2opt(entry))
  let content = fs.readFileSync(entry)
  if (!content) {
    return logger.error(`traverseRequire method: file should not be null in entry ${entry}`)
  }
  /* 写入npm模块文件到dist */
  fileUtils.createAndWriteFile(distPath, content)
  content = content.toString()
  // 获取文件依赖
  let relativeDeps = grabDependencies(content)

  
  let absoluteDeps = []
  let current
  for (let i = 0; i < relativeDeps.length; i++) {
    current = relativeDeps[i]
    const [ moduleName, ...rest ] = current.split('/')
    
    if (isNpm(moduleName, pkg.dependencies || {})) {
      current = path.resolve(config.project.entry, './node_modules/' + moduleName)
      if (rest.length) {
        absoluteDeps.push(addExt(current + rest.reduce((p, c) => p + c, '/')))
        continue
      }
      resolveNpm(current)
      continue
    }
    current = path.join(path.dirname(entry), current)
    absoluteDeps.push(addExt(current))
  }

  absoluteDeps.forEach(dep => {
    traverseRequire({ entry: dep, pkg: pkg })
  })
}

/**
 * 获取文件依赖
 * 
 * @param {*} code 
 */
function grabDependencies(code) {
  let dependencies = []
  const visitor = {
    CallExpression(path) {
      const { callee, arguments } = path.node
      if (callee.name === 'require') {
        dependencies.push(arguments[0].value)
      }
    }
  }
  babel.transform(code, {
    plugins: [
        { visitor },
    ]
  })
  return dependencies
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
  isNpm
}