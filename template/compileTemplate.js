/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-23 07:31:32 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-23 08:15:38
 */


const tpl2obj = require('./tpl2obj')
const obj2mp = require('./obj2mp')

const {
  logger
} = require('../utils')


module.exports = function compileTemplate(templateCode) {
  try {
    return obj2mp(tpl2obj(templateCode))
  } catch (error) {
    logger.error(`compileTemplate `, error);
  }
}

