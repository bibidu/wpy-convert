/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-16 08:01:08 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-16 09:02:44
 */

const path = require('path')
const fs = require('fs')
const babel = require('babel-core')
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

module.exports = function resolveNpm(source, end) {

  // 获取入口文件信息
  const entry = grabNpmEntryInfo(source)
  
  // 读取入口文件引入项、遍历复制文件
  traverseRequire(entry)
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

  return path.join(modulePath, main)
}

/**
 * 读取入口文件引入项、遍历复制文件
 * 
 * @param {*} entry 
 */
function traverseRequire(entry) {
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
  const absoluteDeps = relativeDeps
    .map(dep => path.join(path.dirname(entry), dep))
    /* 添加引用文件后缀 */
    .map(dep => addExt(dep))
  // TODO: 继续递归
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

  return reg.test(path) ? path : path + defaultSuffix
}