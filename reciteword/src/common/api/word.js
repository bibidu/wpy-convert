import http from '@/common/http'
import common from '@/common/common'

// 选择单词书
function target(data) {
  return http.post('/recite/target', data)
}
// 首次查询题目信息
async function begin() {
  const res = await http.get('/recite/begin')
  return common.serilize(res)()
}
// 提交当前题目答案并获取下一题
async function answer(id) {
  const res = await http.post('/recite/answer', {answerIndex: id, index: 1})
  return common.serilize(res)()
}
// 查看
function getWords(data) {
  return http.get('/recite/learn/list', data)
}
// 提前解锁下一任务
function openNext() {
  return http.get('/recite/open/next')
}
// 获取当天所有题目的音频
async function getTodayPackage() {
  const res = await http.get('/recite/today/words')
  return common.serilize(res)()
}
// 获取单词进度
// function getStudySchedule() {
//   return http.get('/recite/study/schedule')
// }
// 重置单词进度
function resetWordProgress(data) {
  return http.post('/recite/reset/target', data)
}
function getStageWords(data) {
  return http.get('/recite/review/mistakes', data)
}
// 获取某阶段是否有错题
function getErrorOfStage(data) {
  return http.get('/recite/review/mistakes/count', data)
}
// 获取单词书列表
// function getBooklist() {
//   return http.get('/recite/word/book/list')
// }
// 查询是否有新书上架
// function getNewBookList() {
//   return http.get('/recite/word/newbook/list')
// }
// 获取书籍的分类
async function getBookClassify() {
  // const res = await http.get('/recite/category/list')
  const res = await http.get('/recite/category/recommend')
  return common.serilize(res)()
}
// 根据书籍分类查询书籍
async function getBookByCate(data) {
  // const res = await http.get('/recite/wordbook/findByCategory', data)
  const res = await http.get('/recite/category/recommend/books', data)
  return common.serilize(res)()
}
// 查询所有书籍（新增）
function findAll() {
  return http.get('/recite/wordbook/findAll')
}
export default {
  target,
	begin,
  answer,
  getWords,
  openNext,
  getTodayPackage,
  // getStudySchedule,
  resetWordProgress,
  getStageWords,
  getErrorOfStage,
  // getBooklist,
  // getNewBookList,
  getBookClassify,
  getBookByCate,
  findAll
}