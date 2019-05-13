import activity from './activity'
import base from './base'
import wechat from './wechat'
import word from './word'
import newAnswer from './newAnswer'
import * as report from './report'

export default {
  ...activity,
  ...base,
  ...wechat,
  ...word,
  ...newAnswer,
  ...report
}