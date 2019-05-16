import {
  cet_signin_url,
  graduate_signin_url,
  graduate5k_signin_url,
} from './audio'
import {
  shareImgSrc,
  NORMAL_TEXT,
  RET_MONEY_MODAL,
  IOS_ADD_TO_DESKTOP_IMAGE,
  ANDROID_ADD_TO_DESKTOP_IMAGE,
  beforeTest_shareImgSrc,
  beforeTest_shareText,
  INDEX_BG_TITLE
} from './constant'
import wepy from 'wepy'

function colorMsg(type, msg, color) {
  if (type === 'API')
    console.log(`%c【${type}】`,'color:#fff;background:#33CCCC', msg)
}
function getErrorCode(msg) {
  console.log('-----------getErrorCode-----------')
  console.log(msg)
  if (!msg) return '网络加载异常(1100)'
  const rules = [
    {code: 1001, msg: 'connnect to', warnMsg: '网络加载失败(1001)'},
    {code: 1002, msg: 'downloadFile', warnMsg: '网络加载失败(1002)'},
    {code: 1003, msg: 'interrupted', warnMsg: '网络加载失败(1003)'},
    {code: 1004, msg: 'associated with hostname', warnMsg: '网络加载失败(1004)'},
    {code: 1005, msg: '音频加载超时', warnMsg: '当前网络环境异常，请检查网络'},
    {code: 1006, msg: '超时', warnMsg: '网络加载失败(1006)'},
    {code: 1007, msg: 'timed out', warnMsg: '网络加载失败(1007)'},
    {code: 1008, msg: 'timeout', warnMsg: '网络加载失败(1008)'}
  ]
  const item = rules.find((item) => JSON.stringify(msg).includes(item.msg))
  if (item) {
    return item.warnMsg
  }
  // fundebug.notify('自定义1000报错', msg)
  return '网络加载异常(1000)'
}
/**
 * 遍历条件返回对应结果
 * @param {*} conditions 条件
 * @param {*} conditions 结果
 */
function condi2res(conditions, rsts) {
  var res
  for (let i = 0; i < conditions.length; i++) {
    if (conditions[i]) {
      res = rsts[i]()
      return res
    }
  }
  return rsts[rsts.length - 1]()
}
/**
 * 格式化api返回值
 * @param {*} res 
 */
function serilize(res) {
  if (!res) throw new Error('cannot serilize null')
	return function(...args) {
    let styles = args && args[0]
    console.log(...args);
    
		let response = {
			code: res.code,
      errMsg: res.errMsg,
      timestamp: res.timestamp
		}
		let needParse
		if (styles) {
			needParse = styles.split('.')
				.reduce((prev, curr) => prev[curr], res)
		} else {
			needParse = res.data
		}
		return {...response, ...needParse}
	}
}
/**
 * 获取打卡视频
 * @param {*} target 
 * @param {*} stage 
 */
function getVideoInfo(target, stage) {
  target = parseInt(target)
  stage = parseInt(stage)
  if (!target || !stage) return {}
  switch (target) {
    case 4:
      return cet_signin_url[stage - 1]
      break
    case 6:
      return cet_signin_url[stage - 1]
      break
    case 7:
      return graduate_signin_url[stage - 1]
      break
    case 10:
      return graduate5k_signin_url[stage - 1]
    default:
      return {}
  }
}
function obj2url(obj) {
  let str = '?'
  Object.keys(obj).forEach(item => {
    str += `${item}=${obj[item]}&`
  })
	return str.substring(0, str.length - 1)
}
/**
 * 重组list(错误插到后8个 正确移除)
 * @param {*} list 
 * @param {*} flag 
 */
function reBuildQue(list, flag) {
  if (flag) return list.slice(1)
  const sep = list.shift()
  let headArr = list.slice(0, 8)
  let lastArr = list.slice(8)
  return [...headArr, sep, ...lastArr]
} 
/**
 * 倒计时数字的处理
 * @param {*} a
 */
function countDown(a) {
  return (parseInt(a) === a) ? a : (a > 0) ? (parseInt(a) + 1) : 0
}

/**
 * 计算答题进度条（自定义的计算逻辑）
 * @param {*} sum 分母
 * @param {*} curr 分子
 */
function caclProgress(sum, curr) {
  let trueNum = sum - curr
  return (trueNum / sum) * 100
}
/**
 * 计算掌握情况的百分比[四舍五入]
 * @param {*} curr 分子
 * @param {*} base 分母
 */
function getPersent(curr, base = 150) {
  let value = (100 * curr / base) < 1 ? 1 : (100 * curr / base)
  return Math.round(value)
}

/**
 * 计算打卡页的时间
 * @param {*} timestamp
 * @example 星期天 13：03
 *
 */
function getTime(timestamp) {
  console.log(timestamp)
  let arr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', ]
  let date = new Date(timestamp)
  // 判断是否需要加12小时
  let obj = {
    weekday: arr[date.getDay()],
    yearMonth: addZeroPrefix(date.getMonth() + 1) + '月' + addZeroPrefix(date.getDate()) + '日',
    year: date.getFullYear() + '年',
    month: addZeroPrefix(date.getMonth() + 1) + '月',
    time: addZeroPrefix(date.getHours()) + ':' + addZeroPrefix(date.getMinutes())
  }
  console.log(obj)
  return obj
}
function getMonthAndDay(time) {
  let date = time ? new Date(time) : new Date()
  const month = addZeroPrefix(date.getMonth() + 1)
  const day = addZeroPrefix(date.getDate())
  return `${month}-${day}`
}
function caclTimeSub(time1, time2) {
  let [month1, day1] = time1.split('-')
  let [month2, day2] = time2.split('-')
  month1 = parseInt(subZeroPrefix(month1))
  month2 = parseInt(subZeroPrefix(month2))
  day1 = parseInt(subZeroPrefix(day1))
  day2 = parseInt(subZeroPrefix(day2))
  if (month2 > month1) return 1
  if (day2 > day1) return 1
  return 0
}
function subZeroPrefix(str) {
  if (!str) return 1
  const [first, ...rest] = str.split('')
  if (first.toString() === '0') {
    return rest[0]
  }
  return str
}
/**
 * 返回特定格式的日期
 */
function getSpecialFomatterDate(theDate, special) {
  let year = theDate.getFullYear()
  let month = addZeroPrefix(theDate.getMonth() + 1)
  let day = addZeroPrefix(theDate.getDate())
  let hour = addZeroPrefix(theDate.getHours())
  let minutes = addZeroPrefix(theDate.getMinutes())
  let seconds = addZeroPrefix(theDate.getSeconds())
  return `${year}${special}${month}${special}${day} ${hour}:${minutes}:${seconds}`
}
/**
 * 时间添加‘0’ 前缀
 * @param {*} str
 */
function addZeroPrefix(str) {
  return ('0' + str).slice(-2)
}
/**
 * 去掉’0‘前缀
 * @param {*} str 
 */
function reduceZeroPrefix(str) {
  str = str.toString()
  var arr = str.split('');
  if (arr[0].toString() === '0') {
    return parseInt(arr[1])
  }
  return parseInt(str)
}
/**
 * 答题倒计时的粒度函数
 */
// @log
function afterOneTime(time = 100) {
  return new Promise(resolve => {
    let time = setTimeout(() => {
      resolve()
    }, time)
  })
}


// 微信toast框
function showWxModal(msg, duration = 2000) {
  wx.showToast({
    title: msg,
    icon: 'none',
    duration
  })
}

// 微信modal框
function showModal(content, title = '提示', showCancel = true) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      showCancel,
      success: (res) => {
        res.confirm ? resolve(1) : resolve(0)
      }
    })
  })
}
async function showModalSync(content, title = '提示', showCancel = true) {
  let rst = await wepy.showModal({
    title,
    content,
    showCancel
  })
  return rst.confirm ? 1 : 0
}

/**
 * 预处理单词列表
 *  1.错题排在最前
 *  2.给单词列表添加‘是否显示’字段
 */
function prehandleWordsList(wordslist) {
  let arr = []
  let reBuildList = []
  if (wordslist.length === 0) return wordslist
  wordslist.forEach((word, index) => {
    word['singleShow'] = true
    word['special'] = false
    word.rightSign ? arr.push(word) : reBuildList.push(word)
  })
  reBuildList = reBuildList.concat(arr)
  return reBuildList
}
/**
 * 获取返现成功、失败弹窗信息（icon，文案，按钮文案）
 * @param {*} flag false: 失败 true:成功
 */
function getRetMoneyModalInfo(flag) {
  return RET_MONEY_MODAL[flag.toString()]
}
/**
 * 根据设备操作系统获取 ‘添加小程序到桌面’的引导图
 *
 * @param {*} isIOS
 * @returns
 */
function getAddToDesktopImage(isIOS) {
  return isIOS ? IOS_ADD_TO_DESKTOP_IMAGE : ANDROID_ADD_TO_DESKTOP_IMAGE
}
// 计算是否是全面屏(手机‘设备’的长宽比大于2.16)【iphoneX：2.1653】
function isFullScreen({screenHeight, screenWidth}) {
  let x = (screenHeight / screenWidth).toFixed(2)
  return x > 2.15
}
function errHandler(error) {
  console.log(`errHandler ${error}`);
}
function sleep(time = 1000) {
  return new Promise(resolve => setTimeout(resolve, time))
}
/**
 * 根据当前时间获取首页标题背景色、背景图
 */
function getIndexStyleWithTime() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 10) return INDEX_BG_TITLE[0]
  if (hour >= 10 && hour < 17) return INDEX_BG_TITLE[1]
  if (hour >= 17 && hour < 19) return INDEX_BG_TITLE[2]
  return INDEX_BG_TITLE[3]
}
// 添加A B C D
function addOption(list) {
  const ens = ['A', 'B', 'C', 'D']
  return list.map(item => {
    let options = item.options
    options = options.map((op, index) => ({...op, option: ens[index]}))
    return {...item, options}
  })
}
function addOptionSingle(question) {
  const ens = ['A', 'B', 'C', 'D']
  const option = question.options
  const newOptions = option.map((op, index) => ({...op, option: ens[index]}))
  return {...question, options: newOptions}
}
function topx(screenWidth, px) {
  const base = 750
  return px * screenWidth / base
}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>

export default {
  addZeroPrefix,
  cet_signin_url,
  graduate_signin_url,
  getVideoInfo,
  countDown,
  caclProgress,
  getTime,
  showWxModal,
  afterOneTime,
  getPersent,
  prehandleWordsList,
  reBuildQue,
  showModal,
  showModalSync,
  obj2url,
  getMonthAndDay,
  caclTimeSub,
  getSpecialFomatterDate,
  serilize,
  getErrorCode,
  condi2res,
  reduceZeroPrefix,
  getRetMoneyModalInfo,
  getAddToDesktopImage,
  colorMsg,
  isFullScreen,
  errHandler,
  sleep,
  getIndexStyleWithTime,
  addOption,
  addOptionSingle,
  topx
}
