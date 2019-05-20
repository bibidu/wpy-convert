/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-19 23:26:15 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-20 08:33:51
 */
const fs = require('fs')
const path = require('path')
const babelCompiler = require('../compiler/babel-compiler')
const {
  checkAndReplaceAlias,
  appendFileSuffix
} = require('../script/utils')
const {
  // traverseRequire,
  // autoAddExtAccordRelativePath,
  // addExt,
  isNpm,
  resolveNpmFromDevModule
} = require('../npm')
const {
  logger,
  stringify,
  safeGet
} = require('../utils')

module.exports = function traverseJs({ entry }) {
  console.log('traverseJs');
  console.log(entry);
  babelCompiler(fs.readFileSync(entry), {
    // TODO: ast修改require中的别名
    VariableDeclaration(_path) {
      const { declarations, kind } = _path.node
      let module
      declarations.forEach(dec => {
        if (
          safeGet(dec, 'dec.init.type') === 'CallExpression'
          && safeGet(dec, 'dec.init.callee.name') === 'require'
        ) {
          module = dec.init.arguments[0].value
          const { flag: hasAlias, alias, aliasValue } = checkAndReplaceAlias(module)
          if (hasAlias) {
            const importAbsolutePath = appendFileSuffix(module.replace(alias, aliasValue))
            let importRelativePath = path.relative(path.dirname(entry), path.dirname(importAbsolutePath)) || '.'
            dec.init.arguments[0].value = importRelativePath + '/' + path.basename(importAbsolutePath)
            console.log('[ALIAS]');
            console.log(importAbsolutePath);
            console.log(importRelativePath);
            console.log(dec.init.arguments[0].value);
            return
          }
          const { flag: npm } = isNpm(module)
          if (npm) {
            let t = resolveNpmFromDevModule({
              npmModuleName: module,
              entry: entry
            })
            dec.init.arguments[0].value = t
          }
        }
      })
    },
  }).code
}