/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-05 18:27:29 
 * @Last Modified by:   kc.duxianzhang 
 * @Last Modified time: 2019-05-05 18:27:29 
 */

const chalk = require('chalk')

const logger = {
  log: function(msg) {
    console.log(chalk.green('[log] ' + msg))
  },
  warn: function(msg) {
    console.log(chalk.yellow('[warn] ' + msg))
  },
  error: function(msg) {
    console.log(chalk.red('[error] ' + msg))
  },
}

module.exports = logger