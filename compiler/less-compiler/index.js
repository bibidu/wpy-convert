/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-05 18:19:33 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-23 07:39:48
 */

const less = require('less')
const {
  safeGet,
  logger
} = require('../../utils')

module.exports = function lessCompiler(lessCode) {
  return new Promise((resolve, reject) => {
    try {
        less.render(lessCode, (err, rst) => {
          if (err) return errorHandler(err)

          const compiled = safeGet(rst, 'rst.css', null)
          if (!compiled) {
            logger.warn(`The result of less->css is null`)
          }
          resolve(compiled)
        })
    } catch (error) {
      errorHandler(error)
    }
  })
}

function errorHandler(error) {
  logger.error(error)
}

