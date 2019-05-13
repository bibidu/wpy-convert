import wepy from 'wepy'

function set(key, value) {
  return new Promise((resolve, reject) => {
    wepy.setStorage({key: key, data: value}).then(res => {
      resolve()
    }).catch(res => {
      console.log(`异步存储缓存${key}失败`)
      // console.log(res)
      resolve()
    })

  })
}
function get(key) {
  return new Promise((resolve, reject) => {
    wepy.getStorage({key: key}).then(res => {
      resolve(res.data)
    }).catch(res => {
      console.log(`【缓存】缓存不存在${key}`)
      // console.log(res)
      resolve()
    })
  })
}
export function setCached(key, value) {
  wepy.setStorageSync(key, value)
}
export function getCached(key) {
  return wepy.getStorageSync(key)
}
export function removeCached(key) {
  wepy.removeStorageSync(key)
}
export default {
  set,
  get
}