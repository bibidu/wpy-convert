import http from '@/common/http'
import common from '@/common/common'

// 【最新】根据返现活动id 查询返现活动
async function getCashActivityById2(data) {
  const res = await http.get('/recite/activity/newCashActivity', data)
  return common.serilize(res)()
}
// 1.7.0 查询多个返现活动信息
// async function getRetmoneyActivityInfo(data) {
//   const res = await http.get('/recite/activity/cash/list', data)
//   return common.serilize(res)()
// }
// 根据返现活动id 查询返现活动
async function getCashActivityById(data) {
  const res = await http.get('/recite/activity/cashActivity', data)
  return common.serilize(res)()
}
// 参与返现用户的账户
// async function cashAccount() {
//   const res = await http.get('/recite/cash/account')
//   return common.serilize(res)()
// }
// 查询支付状态
async function checkPayStatus(data) {
  const res = await http.get('/recite/cash/checkPayStatus', data)
  return common.serilize(res)()
}
// 立即报名
async function createOrder(data) {
  const res = await http.get('/recite/cash/createOrder', data)
  return common.serilize(res)()
}
// 返现好友助力
async function cashHelp(data) {
  const res = await http.get('/recite/cash/help', data)
  return common.serilize(res)()
}
// 支付
async function cashPay(data) {
  const res = await http.get('/recite/cash/pay', data)
  return common.serilize(res)()
}
// 查询是否支付过返现活动
async function checkJoinCashStatus(data) {
  const res = await http.get('/recite/cash/checkJoinStatus', data)
  return common.serilize(res)()
}
// 查询是否需要补签，并自动使用补签卡
async function isNeedRepairSign(data) {
  const res = await http.get('/recite/cash/isNeedRepairSign', data)
  return common.serilize(res)()
}
// 查询有多少人为我的返现助力
async function cashHelpLength(data) {
  const res = await http.get('/recite/cash/help/length', data)
  return common.serilize(res)()
}
// 查询用户正在进行的返现书
async function getUserStudyingRetmoneyBook(data) {
  const res = await http.get('/recite/cash/finishStatus', data)
  return common.serilize(res)()
}
// 1.7.0 查询是否可参与返现活动
async function checkIsNotCanJoinActivity(data) {
  const res = await http.get('/recite/cash/more/checkIsNotCanJoinActivity', data)
  return common.serilize(res)()
}
// 学习记录
async function learnRecord(data) {
  const res = await http.get('/recite/cash/more/learn/record', data)
  return common.serilize(res)()
}
// 查询交易记录
async function getCashTreadRecord(data) {
  const res = await http.get('/recite/cash/more/tread/record', data)
  return common.serilize(res)()
}
// 查询返现活动账户信息
async function getCashAccount(data) {
  const res = await http.get('/recite/cash/more/findCashAccount', data)
  return common.serilize(res)()
}
// 提现 
async function withdraw(data) {
  const res = await http.get('/recite/cash/more/withdraw', data)
  return common.serilize(res)()
}
// 学习日历
async function learnCalendar(data) {
  const res = await http.get('/recite/cash/more/learn/calendar', data)
  return common.serilize(res)()
}
// 查询参与所有返现活动的总人数
// async function getActivityTotalCount(data) {
//   const res = await http.get('/recite/cash/more/totalCount', data)
//   return common.serilize(res)()
// }
export default {
  getCashActivityById2,
  getCashActivityById,
  checkPayStatus,
  createOrder,
  cashHelp,
  cashPay,
  checkJoinCashStatus,
  isNeedRepairSign,
  cashHelpLength,
  getUserStudyingRetmoneyBook,
  checkIsNotCanJoinActivity,
  learnRecord,
  getCashTreadRecord,
  getCashAccount,
  withdraw,
  learnCalendar
}