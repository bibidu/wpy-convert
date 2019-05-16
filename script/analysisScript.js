/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 15:37:27 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-17 00:09:48
 */

const babel = require('babel-core')
const types = require('babel-types')
const generate = require('babel-generator').default

// const resolveConfigByAst = require('./resolveConfigByAst')
// const resolveCompsByAst = require('./resolveCompsByAst')
const createMpRootFunc = require('./createMpRootFunc')


const copyModuleRetNewPath = require('./resolveImportByAst/copyModuleRetNewPath')
const {
  safeGet,
  upperStart
} = require('../utils')

/**
 * 验证是否继承自wepy
 * 
 * @param {*} object 
 */
function verifyFilePrefix(object) {
  const baseName = 'wepy'
  if (object.name !== baseName) {
    throw `未继承自${baseName}`
  }
}

/**
 * 通过AST解析script代码
 * 
 * @param {*} compiledCode 
 */
function analysisScriptByAst(compiledCode, file) {
  const { filePath } = file
  let exportDefaultName
  let config = {}
  let components = {}
  let newCompsPaths = {}
  let mpRootFunc
  let fileType

  const visitor = {
    VariableDeclaration(path) {
      const { declarations, kind } = path.node
      let module
      declarations.forEach(dec => {
        // 引入第三方文件
        if (
          safeGet(dec, 'dec.init.type') === 'CallExpression'
          && safeGet(dec, 'dec.init.callee.name') === 'require'
        ) {
          module = dec.init.arguments[0].value
          dec.init.arguments[0].value = copyModuleRetNewPath(module, filePath)

          /* 保存k: 组件名 v: 更新后的路径(去除babel编译生成的下划线) */
          const key = dec.id.name
          newCompsPaths[key.replace(/^\_/, '')] = dec.init.arguments[0].value
        }
      })
    },

    CallExpression(path) {
      const { object, property } = path.node.callee
      if (safeGet(object, 'object.name') === 'Object' && safeGet(property, 'property.name') === 'defineProperty') {
        const params = path.node.arguments
        Array.from(params).forEach(param => {
          /* 解析config属性 */
          if (param.type === 'StringLiteral' && param.value === 'config') {
            
            const configureProperties = (
              Array.from(params).find(
                i => i.type === 'ObjectExpression'
              ) || {}
            ).properties

            const properties = Array.from(configureProperties).find(
              i => i.key.name === 'value'
            )
            
            Array.from(
              safeGet(properties, 'properties.value.properties', [])
            ).forEach(prop => {
              // config[prop.key.name] = prop.value.value

              // const configCode = generate(prop, {}).code
              const configKey = generate(prop.key, {}).code
              const configValue = generate(prop.value, {
                compact: true,
                jsonCompatibleStrings: true,
                comments: true,
              }).code
              config[configKey] = new Function(`return ${configValue}`)()
            })
            // path.remove()
          }

          /* 解析components属性 */
          if (param.type === 'StringLiteral' && param.value === 'components') {
            const configureProperties = (
              Array.from(params).find(
                i => i.type === 'ObjectExpression'
              ) || {}
            ).properties

            const properties = Array.from(configureProperties).find(
              i => i.key.name === 'value'
            )
            
            Array.from(
              safeGet(properties, 'properties.value.properties', [])
            ).forEach(prop => {
              components[prop.key.name] = prop.value.value || prop.key.name
            })
            path.remove()
          }
        })
      }
    },

    // require('babel-polyfill')
    ExpressionStatement(path) {
      const expression = safeGet(path, 'path.node.expression')
      if (expression
        && expression.type === 'AssignmentExpression'
      ) {
        if (expression.right.name) {
          // 保存该文件的默认导出类, eg: export.default = Banner
          let t
          if (t = safeGet(expression, 'expression.right.name')) {
            // AST中不存在的属性可能会是string类型的undefined
            if (t === 'undefined') {
              return
            }
            exportDefaultName = t
          }
        }
      }
      if (
        expression
        && expression.type === 'CallExpression'
        && safeGet(expression, 'expression.callee.name') === 'require'
      ) {
        module = path.node.expression.arguments[0].value
        path.node.expression.arguments[0].value = copyModuleRetNewPath(module, filePath)
      }

      /* 去除export语句 ·不需要删除 */
      // if (
      //   expression
      //   && safeGet(expression, 'expression.left.object.name') === 'exports'
      // ) {
      //   path.remove()
      // }
    },
    
    VariableDeclarator(path) {
      if (safeGet(path, 'path.node.id.name')) {
        const args = safeGet(path, 'path.node.init.superClass')
        if (args && args.object.name === 'wepy') {
          fileType = args.property.name
        }
      }
    },

  }
  let t = babel.transform(compiledCode, {
    presets: [
      ["es2015", { "loose": false }],

      "stage-1"
    ],
    plugins: [  
        ["transform-decorators-legacy"],
        
        { visitor },

        ["transform-class-properties", { "spec": true }],

    ]
  })

  /* 替换components的编译后路径 */
  replaceCompsPath(components, newCompsPaths)

  // console.log(t.code);
  return {
    script: t.code,
    config: config,
    fileType: fileType,
    usingComponents: components,
    mpRootFunc: `${upperStart(fileType)}(${exportDefaultName})`
  }
}

/**
 * 替换components的编译后路径
 * 
 * @param {*} components 
 * @param {*} newCompsPaths 
 */
function replaceCompsPath(components, newCompsPaths) {
  Object.keys(components).forEach(comp => {
    components[comp] = newCompsPaths[comp]
  })
}

module.exports = analysisScriptByAst

