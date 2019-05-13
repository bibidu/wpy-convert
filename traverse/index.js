/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 22:20:59 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-13 22:26:35
 */


const fs = require('fs')

const cache = require('../utils/cache')
const fileUtils = require('../utils/file')

const exclude = []

/**
 * 遍历文件并输出到dist_
 * 
 */
module.exports = function traverseFiles() {
  let opt = []
  const { entry, output, sourceEntry } = cache.config.project

  fileUtils.readDirAllFiles(entry + sourceEntry, opt, { exclude })
  
  const fileArr = opt.filter(i => i.isFile)
  fileArr.forEach((item, index) => {
    fileUtils.createAndWriteFile(
      (item.filePath).replace(entry, output),
      fs.readFileSync(item.filePath)
    )
  })
}