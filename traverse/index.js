/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 22:20:59 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-27 11:50:34
 */


const fs = require('fs')
const path = require('path')
const config = require('../config')
const wepyrc = require(config.project.entry + '/wepy.config.js')
const {
  logger,
  stringify,
  safeGet
} = require('../utils')

const traverseJs = require('./traverseJs')


const splitSTSC = require('../splitSTSC')
const cache = require('../utils/cache')
const fileUtils = require('../utils/file')

const compileTemplate = require('../template')
const compileStyle = require('../style')
const compileScript = require('../script')

const exclude = []

/**
 * 遍历文件并输出到dist_
 * 
 */
module.exports = function traverseFiles() {

  let opt = []
  const { entry, output, sourceEntry } = cache.config.project

  // test
  const distPath = path.resolve(__dirname, '../dist_reciteword')
  if (fs.existsSync(distPath)) {
    fileUtils.delDir(distPath)
    console.log(`[删除] 移除旧目录`);
  }
  // test

  fileUtils.readDirAllFiles(entry + sourceEntry, opt)
  
  const fileArr = opt
    .filter(i => i.isFile && !['.DS_Store'].includes(i.fileName))
    // .filter(i => i.ext === '.js')
    // .filter(i => i.ext === '.wpy')
    // .filter(i => i.ext !== '.png')
    // .filter(i => i.fileName.includes('app') || i.fileName.includes('chooseBookCategory'))
    // .filter(i => i.entry.includes('answer.wpy'))
    // .filter(i => i.fileName.includes('prizeModal'))
    // .filter(i => i.entry.includes('pages/subPages/answer/study'))
    // .slice(0, 1)
  // console.log('fileArr');
  // console.log(fileArr);
  
  fileArr.forEach(async file => {
    // logger.attention(`当前编译文件: ${file.filePath.split('reciteword')[1]}`)

    let fileType
    switch(file.ext) {
      case '.wpy':
        fileType = 'wpy'
        break
      case '.js':
        fileType = 'js'
        break
      case '.less':
        fileType = 'less'
        break
      default:
        fileType = '.unknow.ext'
    }

    // 输出目录
    const distPath = file.filePath.replaceRoot().replaceSourceCode()

    if (fileType === 'js') {
      return traverseJs({ entry: file.filePath })
    }
    if (fileType === 'wpy') {
      return resolveWpy(distPath, file)
    }
    // 单独less文件无需编译, wpy.style引用less文件时进行递归编译即可
    if (fileType === 'less') {
      return
    }
    // 其他类型文件： copy
    if (true) {
      return fileUtils.createAndWriteFile(distPath, fs.readFileSync(file.filePath))
    }
  })
}

async function resolveWpy(distPath, file) {

  let { template, script, style } = splitSTSC(file)
    
  const compiledTemplate = file.fileName !== 'app.wpy' && compileTemplate(template)
  const {
    script: compiledScript,
    config: configInScript,
    fileType: wpyType,
    usingComponents,
    mpRootFunc
  } = compileScript(script, file)
  const compiledStyle = await compileStyle('less', style, file.filePath)

  let compiledConfig
  if (wpyType === 'app') {
    compiledConfig = configInScript
  }
  if (wpyType === 'page') {
    compiledConfig = {
      ...configInScript,
      usingComponents: usingComponents
    }
  }
  if (wpyType === 'component') {
    compiledConfig = {
      component: true,
      ...configInScript,
      // 组件也可以引入其它组件
      usingComponents: usingComponents
    }
  }

  const rstObject = {
    template: {
      filePath: distPath.replace(file.ext, '.wxml'),
      content: compiledTemplate
    },
    script: {
      filePath: distPath.replace(file.ext, '.js'),
      content: compiledScript + '\n' + mpRootFunc
    },
    style: {
      filePath: distPath.replace(file.ext, '.wxss'),
      content: compiledStyle
    },
    config: {
      filePath: distPath.replace(file.ext, '.json'),
      content: stringify(compiledConfig)
    }
  }

  if (wpyType === 'app') {
    delete rstObject.config.content.usingComponents
  }

  Object.keys(rstObject).forEach(tag => {
    const { filePath, content } = rstObject[tag]
    /* 无需写入文件的所有情况 */
    const ignoreCases = [
      wpyType === 'app' && tag === 'template'
    ]

    if (ignoreCases.some(c => c))
      return

    fileUtils.createAndWriteFile(filePath, content)
  })
}