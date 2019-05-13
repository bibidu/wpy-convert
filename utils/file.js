/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 21:13:43 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-13 22:12:55
 */

const fs = require('fs')
const path = require('path')
 
const fileUtils = {
  isFile(path) {
    return fs.existsSync(path) && fs.statSync(path).isFile()
  },
  
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
    fs.writeFileSync(filePath, content)
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