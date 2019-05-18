/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-17 14:28:18 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-18 07:52:10
 */

let { parseFragment, serialize } = require('parse5')

const RAMDOM_NUM = 'UUU'
const autoClosedTags = [
  'input'
]

const sourceSerialize = serialize
const sourceParseFragment = parseFragment

function traverseReplace(obj) {
  if (obj.tagName && autoClosedTags.includes(obj.tagName)) {
    obj.tagName = obj.tagName + RAMDOM_NUM
  }
  if (obj.childNodes) {
    let t
    (t = Array.from(obj.childNodes)).forEach(
      (child, index) => {
        return traverseReplace(t[index])
      }
    )
  }
  return obj
}

parseFragment = function(needParse) {
  let rst = sourceParseFragment(needParse)
  rst = traverseReplace(rst)
  return rst
}

serialize = function(needSerialize) {
  let rst = sourceSerialize(needSerialize)
  const reg = new RegExp(`(input)${RAMDOM_NUM}`, 'g')
  rst = rst.replace(reg, '$1')
  return rst
}

module.exports = {
  parseFragment,
  serialize
}



