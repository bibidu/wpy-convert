import http from '@/common/http'
import common from '@/common/common'

// 统计分享人数和次数
export function reportShare() {
  return http.get('/recite/share/statistics')
}
// 统计分享成功未解锁用户数
export function reportShareRelock() {
  return http.get('/recite/friend/share')
}
// 上报学习时长[times: (s)]
export function reportStudyTime(data) {
  return http.post('/recite/api/beta/learn/time', data)
}