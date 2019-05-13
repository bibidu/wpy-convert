/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 21:06:31 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-13 21:10:47
 */

const config = require('../config')
const cache = require('../utils/cache')


/**
 * 编译环境初始化
 */
module.exports = function initEnv() {
  cacheWepyrc()
  cacheConfig()
}

/**
 * 缓存wepy.config.js文件
 */
function cacheWepyrc() {
  try {
    cache.wepyrc = require(config.project.entry + '/wepy.config.js')
  } catch (error) {
    console.log(error);
    console.log(`未找到wepy.config.js`);
  }
}

/**
 * 缓存config.js文件
 */
function cacheConfig() {
  cache.config = config 
}