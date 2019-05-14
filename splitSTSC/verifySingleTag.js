/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-14 10:19:09 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-14 13:01:23
 */

const {
  logger
} = require('../utils')
 /**
  * 验证文本中是否只有一对标签
  * 
  * @param {*} content 
  * @param {*} tag 
  */
module.exports = function verifySingleTag(file, content, tag) {
  const tagsArr = [`<${tag}`, `</${tag}>`]
  for (let i = 0; i < tagsArr.length; i++) {
    let index = content.indexOf(tagsArr[i])
    if (!(
      index === content.lastIndexOf(tagsArr[i])
      && index > -1
    )) {
      // console.log(index);
      // console.log(content);
      const err = `verifySingleTag: the count of '${tag}' tag should be one`
      logger.error(err)
    }
  }
}