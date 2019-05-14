/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 15:37:27 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-14 18:58:26
 */

const babel = require('babel-core')
const types = require('babel-types')

const resolveConfigByAst = require('./resolveConfigByAst')
const resolveCompsByAst = require('./resolveCompsByAst')
const createMpRootFunc = require('./createMpRootFunc')


const copyModuleRetNewPath = require('./resolveImportByAst/copyModuleRetNewPath')
const {
  safeGet,
  stringify
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
  let fileType

  const visitor = {
    // ExportDefaultDeclaration(path) {
    //   if (path.node && path.node.declaration.type === 'ClassDeclaration') {
    //     const classInner = path.node.declaration
    //     const { object, property } = classInner.superClass

    //     verifyFilePrefix(object)

    //     fileType = property.name
        
    //     if (classInner.body.type === 'ClassBody') {
    //       const bodys = classInner.body.body
    //       console.log('fileType');
    //       console.log(fileType);
    //       // [解析声明的config] 获取引入config信息
    //       fileType !== 'component' && resolveConfigByAst(bodys)
    //       // [解析声明的components] 获取引入component信息
    //       fileType === 'page' && resolveCompsByAst(bodys)
    //       // [创建根函数] 替换class为小程序根函数
    //       path.replaceWith(createMpRootFunc(types, classInner))
    //     }
    //   }
    // },

    // const utils = require('../../common/utils')
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
          // console.log('VariableDeclaration ', module);
          dec.init.arguments[0].value = copyModuleRetNewPath(module, filePath)
        }
      })
    },

    CallExpression(path) {
      const { object, property } = path.node.callee
      // console.log('object');
      // console.log(object && object.name);
      // console.log(property && property.name);
      if (safeGet(object, 'object.name') === 'Object' && safeGet(property, 'property.name') === 'defineProperty') {
        const params = path.node.arguments
        Array.from(params).forEach(param => {
          // console.log('param.type');
          // console.log(param.type);
          // console.log(param.value);
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
              config[prop.key.name] = prop.value.value
            })
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
          exportDefaultName = expression.right.name
          console.log('exportDefaultName');
          console.log(exportDefaultName);
        }
      }
      if (
        expression
        && expression.type === 'CallExpression'
        && safeGet(expression, 'expression.callee.name') === 'require'
      ) {
        module = path.node.expression.arguments[0].value
        // console.log('ExpressionStatement ', module);
        path.node.expression.arguments[0].value = copyModuleRetNewPath(module, filePath)
      }
    },
    
    VariableDeclarator(path) {
      console.log(78);
      console.log(path.node.id.name);
      console.log(exportDefaultName);
      if (path.node.id.name === exportDefaultName) {
        console.log('13131');
        console.log('VariableDeclarator .', exportDefaultName)
        console.log(path.node.arguments[0].property.name);
        fileType = path.node.arguments[0].property.name
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

        ["transform-class-properties", { "spec": true }],

        { visitor },
    ]
  })
  return {
    script: t.code,
    config: stringify(config),
    fileType: fileType
  }
}

module.exports = analysisScriptByAst

