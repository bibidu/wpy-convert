/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 15:37:27 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-20 16:24:23
 */

const babel = require('babel-core')
const types = require('babel-types')
const generate = require('babel-generator').default


const babelCompiler = require('../compiler/babel-compiler')
const copyModuleRetNewPath = require('./copyModuleRetNewPath')
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
          dec.init.arguments[0].value = copyModuleRetNewPath(filePath, module)

          /* 保存k: 组件名 v: 更新后的路径(去除babel编译生成的下划线) */
          const key = dec.id.name
          newCompsPaths[key.replace(/^\_/, '')] = (dec.init.arguments[0].value).replace('.wpy', '')
          
          /* 移除引入的wpy.component */
          if (module.includes('components/')) {
            path.remove()
          }
        }
      })
    },

    CallExpression(path) {
      const { object, property } = path.node.callee
      if (
        safeGet(object, 'object.name') === 'Object'
        && safeGet(property, 'property.name') === 'defineProperty'
      ) {
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
              const configKey = generate(prop.key, {}).code
              const configValue = generate(prop.value, {
                compact: true,
                jsonCompatibleStrings: true,
                comments: true,
              }).code
              config[configKey] = new Function(`return ${configValue}`)()
            })
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

    ExpressionStatement(path) {
      const expression = safeGet(path, 'path.node.expression')
      if (expression
        && expression.type === 'AssignmentExpression'
        && expression.right.name
      ) {
        let t
        if (t = safeGet(expression, 'expression.right.name')) {
          // AST中不存在的属性可能会是string类型的undefined
          if (t === 'undefined') {
            return
          }
          exportDefaultName = t
        }
      }
      // 创建引用文件并更改调用路径
      if (
        expression
        && expression.type === 'CallExpression'
        && safeGet(expression, 'expression.callee.name') === 'require'
      ) {
        module = path.node.expression.arguments[0].value
        path.node.expression.arguments[0].value = copyModuleRetNewPath(filePath, module)
      }

    },
    
    // 解析wpy文件类型: [app|page|component]
    VariableDeclarator(path) {
      if (safeGet(path, 'path.node.id.name')) {
        const args = safeGet(path, 'path.node.init.superClass')
        if (args && args.object.name === 'wepy') {
          fileType = args.property.name
        }
      }
    },

  }
  let t = babelCompiler(compiledCode, visitor)

  /* 替换components的编译后路径 */
  replaceCompsPath(components, newCompsPaths)

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

