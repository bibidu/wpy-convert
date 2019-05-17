/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-06 10:41:52 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-17 13:00:04
 */

//  替换wpy的事件语法糖
const wpyMethodInTplSugarReg = {
  reg: /(\w+)\((.+)\)/,
  replace: '$1',
  multiMatch: true,
  payloadIndex: 2,
  example: 'moveEvent({{item.value}}) -> moveEvent | {{item.value}}'
}

//  属性映射
const wpyAttrMapping = [
  {
    key: {
      reg: /^\:(\w+)\.sync/,
      replace: '$1',
      example: ':name.sync -> name'
    },
    value: {
      reg: /([\w.!]+)/,
      replace: '{{$1}}',
      example: 'current -> {{current}}'
    }
  },
  {
    key: {
      reg: /^\:(\w+)/,
      replace: '$1',
      example: ':name -> name'
    },
    value: {
      reg: /([\w.!]+)/,
      replace: '{{$1}}',
      example: 'current -> {{current}}'
    }
  },
  {
    key: {
      reg: /\@(\w+)\.stop/,
      replace: 'catch$1',
      example: '@tap.stop -> catchtap'
    },
    value: wpyMethodInTplSugarReg
  },
  {
    key: {
      reg: /\@(\w+)\.user/,
      replace: 'bind$1',
      example: '@tap.user -> bindtap'
    },
    value: wpyMethodInTplSugarReg
  },
  {
    key: {
      reg: /\@(\w+)/,
      replace: 'bind$1',
      example: '@tap -> bindtap'
    },
    value: wpyMethodInTplSugarReg
  }
]

const wpyTagMapping = [
  {
    key: {
      reg: /^repeat$/,
      replace: 'block',
      example: 'repeat -> block'
    },
    value: {}
  },
  {
    key: {
      reg: /^img$/,
      replace: 'image',
      example: 'img -> image'
    },
    value: {}
  }
]

module.exports = {
  wpyAttrMapping,
  wpyTagMapping
}