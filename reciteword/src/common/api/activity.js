import http from '@/common/http'
import common from '@/common/common'

// 中奖之后提交手机号
function prizeSubmitPhone(data) {
  return http.post('/recite/prize',data)
}
// 某次活动是否填写地址（抽奖）
async function fillAddress(data) {
  const res = await http.get('/recite/lottery/isLotteryAndFillAddress', data)
  return common.serilize(res)()
}
// 查询是否有填写地址的记录（抽奖）
async function isLottery() {
  const res = await http.get('/recite/lottery/notFillAddressRecords')
  return common.serilize(res)()
}
// 获取今日奖品 
async function currActivity() {
  const res = await http.get('/recite/lottery/currActivity')
  return common.serilize(res)()
}
async function assistanceRecord(data) {
  let res = await http.get('/recite/lottery/assistanceRecord', data)
  return common.serilize(res)()
}
// 提交地址信息
function saveAddress(data) {
  return http.get('/recite/lottery/saveAddress', data)
}
// 查询往期活动
function pastActivity(data) {
  return http.get('/recite/lottery/pastActivity', data)
}
// 往期活动详情
async function activityDetails(data) {
  let res = await http.get('/recite/lottery/activity/details', data)
  return common.serilize(res)()
}
// 抽奖助力
function lotteryHelp(data) {
  return http.get('/recite/lottery/lotteryHelp', data)
}
// 抽奖 预告助力
async function lotteryForecast() {
  let res = await http.get('/recite/lottery/activity/forecast')
  return common.serilize(res)()
}
// 查询活动列表
async function getActivityList() {
  const res = await http.get('/recite/activity/list')
  return common.serilize(res)()
}
// 查询活动icon等信息
async function getActivityIcon(data) {
  const res = await http.get('/recite/activity/icon', data)
  return common.serilize(res)()
}
async function test() {
  // return await http.get('/recite/activity/icon444')
}
export default {
  prizeSubmitPhone,
  fillAddress,
  isLottery,
  currActivity,
  assistanceRecord,
  saveAddress,
  pastActivity,
  activityDetails,
  lotteryHelp,
  lotteryForecast,
  getActivityList,
  getActivityIcon,
  test
}