/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-06 10:42:27 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-26 12:30:26
 */
const {
  wpyAttrMapping,
  wpyTagMapping
} = require('./rules')
const {
  trim
} = require('../../utils')

/**
 * 根据映射规则替换属性k/v值
 * 
 * @param {*} value 原值
 * @param {*} mapping 映射规则
 */
function replaceWpyAttrKV({ name, value}) {
  let result = { name, value }
  for (let i = 0; i < wpyAttrMapping.length; i++) {
    const { key: k, value: v } = wpyAttrMapping[i]
    if (k.reg.test(name)) {
      result.name = name.replace(k.reg, k.replace)

        if (v.reg.test(value)) {
          if (v.multiMatch) {
            result.payload = value.match(v.reg)[v.payloadIndex]
          }
          result.value = value.replace(v.reg, v.replace)
        }
      break
    }
  }
  return result
}

/**
 * 根据映射规则替换dom标签
 * 
 * @param {*} value 原值
 * @param {*} mapping 映射规则
 */
function replaceWpyTag(tagName) {
  for (let i = 0; i < wpyTagMapping.length; i++) {
    const { key: k } = wpyTagMapping[i]
    if (k.reg.test(tagName)) {
      tagName = tagName.replace(k.reg, k.replace)
      break
    }
  }
  return tagName
}

function revertObjectClass(templateCode) {
  const reg = /:class=['"]\{(.+?)\}['"]/g

  let rst = templateCode.replace(reg, (s, m) => {
    const start = `class="`
    const end = `"`
    let t = ''
    const kvs = m.split(',')
    for (let i = 0; i < kvs.length; i++) {
      let [k, v] = kvs[i].split(':')
      k = trim(k), v = trim(v)
      k = ['\'', '"'].includes(k.charAt(0)) ? k : `'${k}'`
      t += `{{ ${v} ? ${k} : '' }} `
    }
    return `${start}${t}${end}`
  })
  return rst
}

module.exports = {
  replaceWpyAttrKV,
  replaceWpyTag,
  revertObjectClass
}