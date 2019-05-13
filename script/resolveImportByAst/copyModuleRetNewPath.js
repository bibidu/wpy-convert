/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 16:46:46 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-13 16:47:58
 */

module.exports = function copyModuleRetNewPath(importPath) {
  console.log(importPath);
  return importPath + '$$$$$$'
}