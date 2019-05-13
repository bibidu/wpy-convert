/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 15:50:04 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-13 16:09:47
 */

/**
 * 获取页面引入组件components信息
 * @param {*} bodys 
 */
module.exports = function resolveCompsByAst(bodys) {
  let comps = {}
  Array.from(bodys).forEach(body => {
    if (body.type === 'ClassProperty' && body.key.name === 'components') {
      const compsObj = body.value.properties
      compsObj.forEach(comp => {
        comps[comp.key.name] = comp.value.name
      })
    }
  })
  console.log(`[components] `, comps);
  return comps
}