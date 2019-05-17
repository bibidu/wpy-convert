/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-16 08:01:08 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-18 00:40:49
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
function isNpm(current, currDependencies) {
  const [ moduleName, ...rest ] = current.split('/')

  const entry = config.project.entry
  const _project = require(entry + '/package.json')
  project = _project
  const dependencies = currDependencies || _project.dependencies
  const flag = Object.keys(dependencies).indexOf(moduleName) > -1

  return {
    flag, moduleName, rest
  }
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
  
  // 读取入口文件引入项、遍历复制文件、npm模块绝对路径
  traverseRequire({ entry, pkg, source })
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
function traverseRequire({ entry, pkg, source }) {
  const distPath = npmEntry2opt(projectEntry2opt(entry))
  /* 去除原src目录 */
    .replace(config.project.sourceEntry, '')
  let content = fs.readFileSync(entry)
  if (!content) {
    return logger.error(`traverseRequire method: file should not be null in entry ${entry}`)
  }
  content = content.toString()
  // 获取文件依赖并替换其中npm模块路径
  let {
    dependencies: relativeDeps,
    code: newContent
  } = grabDependencies({entry, source, distPath, pkg, content})

  /* 写入npm模块文件到dist */
  fileUtils.createAndWriteFile(distPath, newContent)
  // fileUtils.createAndWriteFile(distPath, content)
  
  let absoluteDeps = []
  let current
  for (let i = 0; i < relativeDeps.length; i++) {
    current = relativeDeps[i]
    
    
    const { flag, moduleName, rest } = isNpm(current, pkg.dependencies || {})
    if (flag) {
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
    traverseRequire({
      entry: dep,
      pkg: pkg,
      source: source
    })
  })
}

/**
 * 获取文件依赖并替换其中npm模块路径
 * 
 * @param {*} entry 
 * @param {*} content 
 */
function grabDependencies({entry, source, distPath, pkg, content}) {
  let dependencies = []
  const visitor = {
    CallExpression(_path) {
      const { callee, arguments } = _path.node
      if (callee.name === 'require') {
        const depName = arguments[0].value
        dependencies.push(depName)

        const { flag, moduleName, rest } = isNpm(depName, pkg.dependencies || {})
        if (flag) {
          const project = config.project

          const innerNpmDir = project.entry + '/node_modules/' + moduleName
          const entryInfo = grabNpmEntryInfo(innerNpmDir)
          const innerNpmDistDir = entryInfo.entry
            .replace(project.entry, project.output)
            .replace('node_modules', 'npm')
          const relativePath = path.relative(
            path.dirname(distPath),
            path.dirname(innerNpmDistDir)
          )
          // arguments[0].value = path.join(
          //   relativePath,
          //   rest.reduce((p, c) => p + c, '/'),
          //   pkg.main
          // )
          arguments[0].value = path.join(
            relativePath,
            rest.length ? rest.reduce((p, c) => p + c, '/') : '',
          )
        }
      }
    }
  }
  let t = babel.transform(content, {
    plugins: [
        { visitor },
    ]
  })
  return {
    dependencies,
    code: t.code
  }
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