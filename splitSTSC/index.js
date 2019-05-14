/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-14 10:23:55 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-14 13:11:10
 */

const fs = require('fs')
const {
  logger
} = require('../utils')
const verifySingleTag = require('./verifySingleTag')


/**
 * 提取文件某tag部分
 * 
 * @param {*} file 
 * @param {*} tag 
 * 
 */
function grabTagFromFile(file, tag = 'script', opt) {
  const reg = new RegExp(`\\<${tag}.*\\>([\\w\\W]+)\\<\\/${tag}\\>`)
  let content = (fs.readFileSync(file.filePath)).toString()
  verifySingleTag(file, content, tag)

  if (reg.test(content)) {
    return opt[tag] = content.match(reg)[1]
  }
  logger.error(`cannot grabTagFromFile ${tag}`)
}

function splitSTSC(file) {
  const tagPool = ['script', 'template', 'style']
  let rst = {}
  tagPool.forEach(tag => {
    if (isIgnoreTag(file.fileName, tag)) {
      return
    }
    grabTagFromFile(file, tag, rst)
  })
  return rst
}

/**
 * 是否是无效标签
 * 
 * @param {*} fileName 
 * @param {*} tag 
 */
function isIgnoreTag(fileName, tag) {
  if (fileName === 'app.wpy' && tag === 'template') {
    return true
  }
  return false
}

module.exports = splitSTSC