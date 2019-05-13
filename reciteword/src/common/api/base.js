import http from '@/common/http'
import common from '@/common/common'

// 查询banner信息
function banner(data) {
  return http.get('/recite/banner', data)
}
// 获取服务器最新时间
async function getServerTime() {
  const res = await http.get('/recite/nowTime')
  return common.serilize(res)()
}
// 收集formId
function collect(data) {
  return http.post('/recite/collect', data)
}
// 查询首页用户信息
function indexV1() {
  return http.get('/recite/v1/index')
}
// 发起一个解锁的分享房间
function createRelockShare(data) {
    return http.get('/recite/friend/help', data)
}
// 获取我发起的助力是否成功
async function getHelpStatus() {
  const res = await http.get('/recite/friend/help/status')
  return common.serilize(res)()
}
// 订阅模版消息
function subscript(data) {
  return http.post('/recite/user/subscript',data)
}
async function getBusiness() {
  const res = await http.get('/recite/operation/list')
  return common.serilize(res)()
}
export default {
  banner,
  getServerTime,
  collect,
  indexV1,
  createRelockShare,
  getHelpStatus,
  subscript,
  getBusiness
}
