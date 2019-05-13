import http from '@/common/http'
import common from '@/common/common'

// 获取openId
async function getOpenId(data) {
  const res = await http.get('/recite/wechat/getOpenId', data, true)
  return common.serilize(res)()
}
// 登录
async function login(data) {
  const res = await http.post('/recite/wechat/login', data, true)
  return common.serilize(res)()
}
export default {
  getOpenId,
  login
}