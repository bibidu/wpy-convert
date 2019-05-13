
import http from '@/common/http'
import common from '@/common/common'


// 查询首页用户信息
async function indexV2() {
  const res = await http.get('/recite/api/beta/index')
  return common.serilize(res)()
}
async function canExperience(data) {
  const res = await http.get('/recite/api/beta/check/qualification', data)
  return common.serilize(res)()
}
async function getBookByTarget(data) {
  const res = await http.get('/recite/api/beta/wordbook', data)
  return common.serilize(res)()
}
// async function submitGroupRst(data) {
//   const res = await http.post('/recite/api/beta/group/answer', data)
//   return common.serilize(res)()
// }
// 获取某组题目
async function getGroupWords(data) {
  const res = await http.get('/recite/api/beta/group/words', data)
  let rst = common.serilize(res)()
  let wordsList = rst.wordsList
  wordsList = common.addOption(wordsList)
  return {...rst, wordsList}
}
// 开始学习前调用
async function beginLearn(data) {
  const res = await http.get('/recite/api/beta/begin/learn', data)
  return common.serilize(res)()
}
// 进入新版本
async function joinNewVersion(data) {
  const res = await http.post('/recite/api/beta/commit/choose', data)
  return common.serilize(res)()
}
// 上传用户所处新版答题的模式(学习/练习)
async function submitNewVersionModule(data) {
  const res = await http.post('/recite/api/beta/study/module', data)
  return common.serilize(res)()
}
// 上传学习模式的错题
async function submitNewVersionError(data) {
  const res = await http.post('/recite/api/beta/group/answer', data)
  return common.serilize(res)()
}

// 切换模式
async function switchAnswerVersion(data) {
  const res = await http.post('/recite/api/beta/change/version', data)
  return common.serilize(res)()
}
export default {
  canExperience,
  indexV2,
  getBookByTarget,
  // submitGroupRst,
  getGroupWords,
  beginLearn,
  joinNewVersion,
  submitNewVersionModule,
  submitNewVersionError,
  switchAnswerVersion
}