/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 15:53:12 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-13 16:48:13
 */

const copyModuleRetNewPath = require('./copyModuleRetNewPath')
const {
  safeGet
} = require('../../utils')


function replaceImportPath(value) {
  return copyModuleRetNewPath(value)
}
 /**
 * 分析引入模块
 */
module.exports = function resolveImportByAst() {
  return {
    // const utils = require('../../common/utils')
    VariableDeclaration(path) {
      const { declarations, kind } = path.node
      let module
      declarations.forEach(dec => {
        if (
          safeGet(dec, 'dec.init.type') === 'CallExpression'
          && safeGet(dec, 'dec.init.callee.name') === 'require'
        ) {
          module = dec.init.arguments[0].value
          dec.init.arguments[0].value = replaceImportPath(module)
        }
      })
    },

    // require('babel-polyfill')
    ExpressionStatement(path) {
      // console.log('expressionStatement');
      // console.log(path.node.expression);
      const expression = safeGet(path, 'path.node.expression')
      if (
        expression
        && expression.type === 'CallExpression'
        && safeGet(expression, 'expression.callee.name') === 'require'
      ) {
        module = path.node.expression.arguments[0].value
        path.node.expression.arguments[0].value = replaceImportPath(module)
      }
    },
  
    // import b from 'b'
    ImportDeclaration(path) {
      const { source } = path.node
      module = source.value
      source.value = replaceImportPath(module)
    }
  }
}