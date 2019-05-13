/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-13 15:37:27 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-13 19:00:43
 */

const babel = require('babel-core')
const types = require('babel-types')

const resolveImportByAst = require('./resolveImportByAst')
const resolveCompsByAst = require('./resolveCompsByAst')
const createMpRootFunc = require('./createMpRootFunc')

/**
 * 验证是否继承自wepy
 * 
 * @param {*} object 
 */
function verifyFilePrefix(object) {
  const baseName = 'wepy'
  if (object.name !== baseName) {
    throw `未继承自${baseName}`
  }
}

/**
 * 通过AST解析script代码
 * 
 * @param {*} compiledCode 
 */
function analysisScriptByAst(compiledCode) {
  let visitor = {
    ExportDefaultDeclaration(path) {
      if (path.node && path.node.declaration.type === 'ClassDeclaration') {
        const classInner = path.node.declaration
        const { object, property } = classInner.superClass

        verifyFilePrefix(object)

        const fileType = property.name
        
        if (classInner.body.type === 'ClassBody') {
          const bodys = classInner.body.body
          // [解析声明的components] 获取引入component信息
          resolveCompsByAst(bodys)
          // [创建根函数] 替换class为小程序根函数
          path.replaceWith(createMpRootFunc(types, classInner))
        }
      }
    },

    ...resolveImportByAst()
  }
  let t = babel.transform(compiledCode, {
    plugins: [
        ["transform-class-properties", { "spec": true }],
        { visitor }
    ]
  })
  console.log(t.code);
  return t.code
}

var code = `
import wepy from 'wepy'
import storage from '@/common/storage'

import { bindEvent, removeAllEvent } from '@/common/dep'
import api from '@/common/api'
import { bunchDownload, stopDownload } from '@/common/download'
import {
  mean2answer,
  answer2mean,
  SHARE_TITLE,
  ANSWER_PARAMS
} from '@/common/constant'
import common from '@/common/common.js'
import kcLoading from '@/components/kcLoading' // loading框
import kcNotification from '@/components/kcNotification' // 通知提醒框
import { getStore } from 'wepy-redux'
const store = getStore()

let lockChoose = false // 防二次提交的选择锁
let remark = 'Beizhu' // 防二次提交的选择锁

export default class Answer extends wepy.component {
  config = {
    navigationBarTitleText: '单词天天背'
  }
  components = {
    authModal: authModal1,
    Modal,
  }
}`
analysisScriptByAst(code)
module.exports = analysisScriptByAst

