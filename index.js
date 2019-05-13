/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-05 18:38:21 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-13 22:17:39
 */
require('babel-polyfill')
const initEnv = require('./init')
const traverseFiles = require('./traverse')

const less2css = require('./style/less2css')
const tpl2obj = require('./template/tpl2obj')



// 初始化编译环境
initEnv()

// 遍历文件开始编译
traverseFiles()