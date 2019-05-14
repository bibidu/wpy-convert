/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-14 13:29:22 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-14 16:05:50
 */

/**
 * 获取页面配置config信息
 * @param {*} bodys 
 */
module.exports = function resolveConfigByAst(bodys) {
  console.log('config');
  let config = {}
  Array.from(bodys).forEach(body => {
    if (body.type === 'ClassProperty' && body.key.name === 'config') {
      const configObj = body.value.properties
      configObj.forEach(cfg => {
        config[cfg.key.name] = cfg.value.name
      })
    }
  })
  console.log(`[config] `, config);
  return config
}