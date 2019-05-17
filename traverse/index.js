/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 22:20:59 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-18 00:41:03
 */


const fs = require('fs')
const path = require('path')
const {
  logger,
  stringify
} = require('../utils')

const splitSTSC = require('../splitSTSC')
const cache = require('../utils/cache')
const fileUtils = require('../utils/file')

const compileTemplate = require('../template')
const less2css = require('../style/less2css')
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

  fileUtils.readDirAllFiles(entry + sourceEntry, opt, { exclude })
  
  const fileArr = opt
    .filter(i => i.isFile)
    // .filter(i => i.ext === '.wpy')
    // .filter(i => i.fileName.includes('app') || i.fileName.includes('chooseBookCategory'))
    // .filter(i => i.fileName.includes('app'))
    // .filter(i => i.fileName.includes('prizeModal'))
    // .slice(0, 1)
  // console.log('fileArr');
  // console.log(fileArr);

  
  fileArr.forEach(async item => {
    logger.attention(`当前编译文件: ${item.filePath.split('reciteword')[1]}`)

    const isApp = item.fileName === 'app.wpy'
    const isWpy = item.ext === '.wpy'

    // 输出目录
    const cachedPath = item.filePath
      .replace(entry, output)
      /* 去除src目录 */
      .replace(sourceEntry, '')

    /* 非wpy文件无需编译, 拷贝到dist目录即可 */
    if (!isWpy) {
      // console.log('[copy] 复制文件');
      return fileUtils.createAndWriteFile(cachedPath, fs.readFileSync(item.filePath))
    }
    // console.log('[copy] 编译文件');
    let rst = splitSTSC(item)
    
    const compiledTemplate = !isApp && compileTemplate(rst.template)
    const {
      script: compiledScript,
      config: configInScript,
      fileType,
      usingComponents,
      mpRootFunc
    } = compileScript(rst.script, item)
    const compiledStyle = await less2css(rst.style)

    let compiledConfig
    if (fileType === 'app') {
      compiledConfig = configInScript
    } else if (fileType === 'page') {
      compiledConfig = {
        ...configInScript,
        usingComponents: usingComponents
      }
    } else if (fileType === 'component') {
      compiledConfig = {
        ...configInScript,
        component: true
      }
    }

    const distPath = {
      template: {
        filePath: cachedPath.replace(item.ext, '.wxml'),
        content: compiledTemplate
      },
      script: {
        filePath: cachedPath.replace(item.ext, '.js'),
        content: compiledScript + '\n' + mpRootFunc
      },
      style: {
        filePath: cachedPath.replace(item.ext, '.wxss'),
        content: compiledStyle
      },
      config: {
        filePath: cachedPath.replace(item.ext, '.json'),
        content: stringify(compiledConfig)
      }
    }

    // app.json中usingComponents无效
    if (fileType === 'app') {
      delete distPath.config.content.usingComponents
    }

    /* 创建文件 */
    Object.keys(distPath).forEach(tag => {
      const { filePath, content } = distPath[tag]

      /* 无需写入文件的所有情况 */
      const ignoreCases = [
        // app中template标签无效
        tag === 'template' && fileType === 'app'
      ]

      if (ignoreCases.some(c => c)) {
        return
      }
      fileUtils.createAndWriteFile(filePath, content)
    })
  })


}

function doDifferentAction(ext) {
  switch(ext) {
    case '.wpy':
      return 'compiled'
    case 'less':
      return 'copy'
    case '.js':
      return 'copy'
    default:
      return 'copy'
  }
}