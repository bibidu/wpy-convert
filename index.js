/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-05 18:38:21 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-23 07:40:48
 */
require('babel-polyfill')
const initEnv = require('./init')
const traverseFiles = require('./traverse')

const config = require('./config')


String.prototype.replaceRoot = function() { return this.replace(config.project.entry, config.project.output)}
String.prototype.replaceSourceCode = function() { return this.replace(config.project.sourceEntry, '')}
String.prototype.replaceNodeModules = function() { return this.replace('node_modules', 'npm')}

// 初始化编译环境
initEnv()

// 遍历文件开始编译
traverseFiles()