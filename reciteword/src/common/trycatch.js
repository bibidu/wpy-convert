
// const wepy = require('wepy')
import wepy from 'wepy'

function merge(options) {
  if ( wepy
    && wepy.$error
    && wepy.$error.compsName
    && wepy.$error.methodName
    && wepy.$error.options
  ) {
    let config = {}
    for (let key in wepy.$error) {
      config[key] = (options && options[key]) || wepy.$error[key]
    }
    return {...config, flag: true}
  } else {
    return {...options, flag: false}
  }
}
function trycatch(initialOptions) {
  return function(target) {
    /**
     * wrapper by try catch
     * @param {*} method 
     */
    function wrapper(method) {
      return async (...args) => {
        try {
          await method.call(this, ...args)
        } catch (error) {
          console.log('source error')
          console.log(error)
          notifyErrorMsg.call(this, error, initialOptions)
        }
      }
    }
    /**
     * push error results to outside
     * @param {*} error 
     * @param {*} initialOptions 
     */
    function notifyErrorMsg(error, initialOptions) {
      const $error = merge(initialOptions)
      let { compsName, methodName, options, flag, hook } = $error 
      if (hook && typeof hook === 'function') {
        options = hook(JSON.stringify(error), options)
      }
      if (!flag) {
        this.onErrored && this.onErrored.call(this, options)
        this.errHandler && this.errHandler.call(this, options)
        return
      }
      this.$invoke(compsName, methodName, options)
    }
    /**
     * wrapp component of wepy
     */
    return class extends target {
      constructor() {
        super()
        // methods wrapper
        for (let key in this.methods) {
          let beforeMethod = this.methods[key]
          this.methods[key] = wrapper.call(this, beforeMethod)
        }
        // lifecycle wrapper
        Object.getOwnPropertyNames(target.prototype).forEach(item => {
          if (item !== 'constructor' && item !== 'onErrored') {
            this[item] = wrapper.call(this, target.prototype[item])
          }
        })
      }
    }
  }
}
export default trycatch