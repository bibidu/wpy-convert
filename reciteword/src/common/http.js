import wepy from 'wepy'
import { ROOT_URL } from '@/common/constant'
import storage from '@/common/storage'

let clearStorageSync = wx.removeStorageSync

const timer = (time) => time ? +new Date(time) : +new Date()

const getUrl = (url) => ROOT_URL + url

const getMethod = (method) => method || 'GET'

const getHeader = (method) => ({
  'content-type': method ? 'application/x-www-form-urlencoded' : 'application/json'
})


function fetch({url, header, method, data}) {
    return new Promise(async (resolve, reject) => {
      let page = wepy.$instance.__prevPage__
      try {
        const token = await storage.get('token') || ''
        data = {...data, token}

        let res = await wepy.request({
          url: getUrl(url),
          method: getMethod(method),
          header: getHeader(method),
          data
        })
        
        // 异常
        if (res.statusCode !== 200 || res.data.code === 500) {
          console.log('fetch error');
          // page = wepy.$instance.__prevPage__
          if (res.statusCode === 404) {
            return page.$redirect('nopage')
          }
          if (page) {
            if (typeof page.resolveException === 'function') {
              page.resolveException(res)
            }
            if (typeof page.errHandler === 'function') {
              page.errHandler('服务器异常')
            }
          }
          // page && page.resolveException(res) && page.errHandler('服务器异常')
          return reject(res)
        }
        if (res.data.code === 3 || res.data.code === 4) {
          token && clearStorageSync('token')
        }

        resolve({...res.data, timestamp: timer(res.header.Date)})
      } catch (error) {
        if (page) {
          if (typeof page.resolveException === 'function') {
            page.resolveException(error)
          }
          if (typeof page.errHandler === 'function') {
            page.errHandler(error)
          }
        }
      }
    })
}

let get = (url, data) => fetch({url, data})
let post = (url, data) => fetch({url, data, method: 'POST'})

/**
 * 添加请求时间
 * @param {*} fn 
 */
const withTime = (fn) => {
  return async (...args) => {
    let start = timer()
    let rst = await fn.apply(this, args)
    console.log(`【API】${args[0]}：${timer() - start}`)
    return rst
  }
}

export default {
  get: withTime(get),
  post: withTime(post)
}
