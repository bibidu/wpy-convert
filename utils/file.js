/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 21:13:43 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-21 11:10:17
 */

const fs = require('fs')
const path = require('path')
const config = require('../config')


 
const fileUtils = {
  isFile(path) {
    return fs.existsSync(path) && fs.statSync(path).isFile()
  },
  
  /**
   * @param {*} entry 总文件入口(绝对路径)
   * @param {*} options 
   * 
   * @return {*} output 所有文件信息
   */
  readDirAllFiles(entry, output, options = {}) {
    if (fileUtils.isFile(entry)) {
      return output.push({
        entry: entry,
        isFile: true,
        fileName: path.basename(entry),
        ext: path.extname(entry),
        filePath: entry
      })
    }
    output.push({
      isFile: false,
      ext: '',
      filePath: entry
    })
  
    const dirs = fs.readdirSync(entry)
  
    let newEntry
    dirs.forEach((dir, index) => {
      if (Array.isArray(options.exclude) && options.exclude.indexOf(dir) > -1) {
        return
      }
      newEntry = entry + '/' + dir
      return fileUtils.readDirAllFiles(newEntry, output, options)
    })
    return output
  },

  createAndWriteFile(filePath, content) {
    const dir = path.dirname(filePath)
    fileUtils.mkdirsSync(dir)
    if (!fs.existsSync(filePath)) {
      console.log(`[写入] ${filePath.replace(config.project.output, '')}`)
      fs.writeFileSync(filePath, content)
    }
  },

  delDir(path){
    let files = []
    if (fs.existsSync(path)){
      files = fs.readdirSync(path)
      files.forEach((file, index) => {
        let curPath = path + "/" + file
        if (fs.statSync(curPath).isDirectory()) {
            fileUtils.delDir(curPath)
        } else {
            fs.unlinkSync(curPath)
        }
      });
      fs.rmdirSync(path)
    }
  },

  mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
      return true
    }
    if (fileUtils.mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}

module.exports = fileUtils