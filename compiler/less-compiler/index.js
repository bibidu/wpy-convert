/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-05 18:19:33 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-05 18:29:53
 */

const less = require('less')
const {
  safeGet,
  logger
} = require('../../utils')

/**
 * 编译less -> css
 * @param {*} lessCode
 */
function compile(lessCode) {
  return new Promise((resolve, reject) => {
    try {
        less.render(lessCode, (err, rst) => {
          if (err) return errorHandler(error)

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

module.exports = compile
