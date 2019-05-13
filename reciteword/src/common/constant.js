// 根域名 [配置根路径]
// 正式服
const ROOT_URL = 'https://xcx.kaochong.com'

// 开发服
// const ROOT_URL = 'http://thyme.natappvip.cc'
// const ROOT_URL = 'http://172.16.1.49:8080'
//  
// 测试服
// const ROOT_URL = 'http://xcx.xuanke.com'
// const ROOT_URL = 'https://reciteqa.kaochong.com'

// const ROOT_URL = 'http://39.107.97.207:8080'

// 数据测试
// const ROOT_URL = 'http://47.94.196.36:8003'


// testin APP KEY
const TEST_AB_APP_KEY = 'TESTIN_w57a3fcf9-189b-45b8-8a3b-41fbafa2fa88'

// 答题 => 释义
const answer2mean = 350
// 释义 => 答题
const mean2answer = 150

const ANSWER_PARAMS = {
  answer: {
    countdown: 10
  },
  resolve: {
    countdown: 20
  }
}
// 不同单词书打卡图
const shareImgSrc = {
  4: 'https://xcx-cdn.kaochong.com/image/recitewordxcx_huo_5@2x.jpg',
  6: 'https://xcx-cdn.kaochong.com/image/recitewordxcx_huo_6@2x.jpg',
  7: 'https://xcx-cdn.kaochong.com/image/recitewordxcx_huo_1@2x.jpg',
  8: 'https://xcx-cdn.kaochong.com/image/recitewordxcx_huo_4@2x.jpg',
  9: 'https://xcx-cdn.kaochong.com/image/recitewordxcx_huo_3@2x.jpg',
  10: 'https://xcx-cdn.kaochong.com/image/recitewordxcx_huo_2@2x.jpg',
  11: 'https://xcx-cdn.kaochong.com/image/reciteword/xcx_tu_17@2x.png',
  12: 'https://xcx-cdn.kaochong.com/image/recitewordxcx_tu_1@2x.png',
  15: 'https://xcx-cdn.kaochong.com/image/reciteword/xcx_tu_2@2x.png',
  16: 'https://xcx-cdn.kaochong.com/image/recitewordxcx_tu_2@2x.png',
  17: 'https://xcx-cdn.kaochong.com/recite/image/xcx_tu_2@2x1.png',
  23: 'https://xcx-cdn.kaochong.com/recite/images/wordbook/read_unlock.png', // 四级阅读救命200词
  24: 'https://xcx-cdn.kaochong.com/recite/images/wordbook/read_unlock.png', // 六级阅读救命200词
  25: 'https://xcx-cdn.kaochong.com/recite/images/wordbook/listen_unlock.png', // 四级听力救命200词
  26: 'https://xcx-cdn.kaochong.com/recite/images/wordbook/listen_unlock.png', // 六级听力救命200词
  27: 'https://xcx-cdn.kaochong.com/recite/images/wordbook/write_unlock.png', // 四级写译救命200词
  28: 'https://xcx-cdn.kaochong.com/recite/images/wordbook/write_unlock.png', // 六级写译救命200词
  29: 'https://xcx-cdn.kaochong.com/recite/image/xcx_tu_5.png' // 考研写作必背270词
}
// 18年12月考前打卡图
const beforeTest_shareImgSrc = {
  4: 'https://xcx-cdn.kaochong.com/recite/image/46random1.jpg',
  6: 'https://xcx-cdn.kaochong.com/recite/image/46random2.jpg',
  7: 'https://xcx-cdn.kaochong.com/recite/image/xcx_tu_3@2x.png'
}
// 18年12月考前打卡文案
const beforeTest_shareText = {
  4: '考前必抱佛脚，轻松提分50+，点击帮我加速过级！',
  6: '背最少的词，涨最多的分，点击帮我加速涨分！',
  7: '不求头发少掉，但求分数上涨！帮我解锁考研必背词！'
}
// 选择单词书 => 切换书文案及按钮文案
const BOOK_MODAL_TEXT = [
  {
    text: '重新背会清除此单词书的全部学习数据，是否确认清除?',
    btnText: '重新背'
  },
  {
    text: '是否确认切换到刷词模式/深度模式？切换后今天的单词任务会重置哦~',
    btnText: '切换深度模式'
  },
  {
    text: '是否确认切换到刷词模式/深度模式？切换后今天的单词任务会重置哦~',
    btnText: '切换刷词模式'
  }
]

const NORMAL_TEXT = '我的背单词之魂在燃烧！帮我提前解锁明日任务吧～'
// 邀请好友解锁[初始阶段]
const RELOCK_START = '空空如也，暂时没有好友帮忙解锁任务'
// 邀请好友解锁[进行阶段]
const RELOCK_ING = '加油！马上就完成解锁任务啦~'
// 邀请好友解锁[完成阶段]
const RELOCK_SUCCESS = '恭喜你，已经完成解锁任务啦~'
// 分享解锁的卡片标题
const SHARE_TITLE = '分享一个我很喜欢的背单词小程序给你～'
// 抽奖文案
const LOTTERY_TITLE = '背完当天单词就能抽ipad，每天一台，快来帮我～'
// 不满足解锁条件时的文案
const DENY_RELOCK_TITLE = '当日任务完成后即可解锁'
// 返现的分享文案
const RET_MONEY_SHARE_TITLE = '背单词还能拿现金奖励，你不来试试？'

// 深度学习按钮
const DEEPLEARNBTN = [
  {
    text: ['认识', '不认识'],
    cb: ['know', 'unKnow']
  },
  {
    text: ['记对了', '记错了'],
    cb: ['rememberRight', 'rememberWrong']
  },
  {
    text: ['下一步'],
    cb: ['nextStep']
  },
  {
    text: ['下一词'],
    cb: ['nextWord']
  }
]

// 深度学习弹框
const DEEPLEARNMODAL = [
  {
    title: '解锁成功',
    img: 'https://xcx-cdn.kaochong.com/recite/image/xcx_shenwan_6@3x.png',
    des: '恭喜~你已成功解锁了考研核心1000深度模式',
    btn: ['深度模式是什么？']
  },
  {
    title: '完成学习',
    img: 'https://xcx-cdn.kaochong.com/recite/image/xcx_shenwan_1@3x.png',
    des: '恭喜~这个阶段的错词全部复习完啦晚上给自己加鸡腿吧~',
    btn: ['学得不过瘾，再来一组', '返回首页']
  },
  {
    title: '引导',
    img: 'https://xcx-cdn.kaochong.com/recite/image/xcx_shenwan_4@3x.png',
    des: '如果想要继续“刷单词”，可以在首页点击切换单词任务，选择正在背的单词书切换',
    btn: ['进入深度模式', '更换单词任务']
  },
  {
    title: '浏览',
    img: 'https://xcx-cdn.kaochong.com/recite/image/xcx_shenwan_3@3x.png',
    des: '在深度模式下，你可以更加沉浸的记忆单词的各类内容',
    btn: ['下一步']
  }
]
const RET_MONEY_MODAL = {
  'true': {
      icon: 'https://xcx-cdn.kaochong.com/recite/image/xcx_fantan_50@2x.png',
      title: '助力成功了!',
      msg: '背单词返30元现金，这种好事还不快来参加～',
      btnText1: '必须试下',
      btnText2: '算了，我只想正常背单词'
    },
  'false': {
    icon: 'https://xcx-cdn.kaochong.com/recite/image/xcx_fantan_6@2x.png',
    title: '已经有人帮好友助力过了〜',
    msg: '背单词返30元现金，这种好事还不快来参加～',
    btnText1: '必须试下',
    btnText2: '算了，我只想正常背单词'
  }
}
/**
 * 返现规则
 */
const RET_MONEY_RULES = [
  {
    imgUrl: 'https://xcx-cdn.kaochong.com/recite/image/xcx_fantan_2@2x.png',
    msg: '完成每日单词任务，好友助力成功即可获取今日返现',
    btnText: '下一步',
    next: 1
  },
  {
    imgUrl: 'https://xcx-cdn.kaochong.com/recite/image/xcx_fantan_3@2x.png',
    msg: '每位好友可以为你助力5次',
    btnText: '下一步',
    next: 2
  },
  {
    imgUrl: 'https://xcx-cdn.kaochong.com/recite/image/xcx_fantan_4@2x.png',
    msg: '完成全部任务即可全额提现',
    btnText: '开始学习',
    next: null
  }
]
// const RET_MONEY_NOTIFY_SHARE = {
//   imgUrl: 'https://xcx-cdn.kaochong.com/recite/image/xcx_retmoney_help_fail@2x.png',
//   msg: '还没有邀请给好友助力哦，点击“好友助力领返现”即可邀请好友助力~',
//   btnText: '我知道啦'
// }
// 返现 没有好友助力弹框信息
const RET_MONEY_NOTIFY_SHARE = {
  imgUrl: 'https://xcx-cdn.kaochong.com/recite/image/xcx_retmoney_help_fail@2x.png',
  title: '还没有邀请好友助力哦〜',
  msg: '点击“好友助力领奖学金”即可邀请好友助力',
  btnText: '我知道啦'
}
// 返现 切换非返现书弹框信息
const RET_MONEY_NO_FRIEND_HELP = {
  imgUrl: 'https://xcx-cdn.kaochong.com/recite/image/xcx_fantan_7@2x.png',
  title: '你在切换单词任务~',
  msg: '切换单词任务后别忘了切回返现的单词书哦',
  btnText: '我知道啦'
}
// ‘添加小程序到桌面’ - ios图片
const IOS_ADD_TO_DESKTOP_IMAGE = 'https://xcx-cdn.kaochong.com/recite/image/xcx_add_desktop_ios1.png'
// ‘添加小程序到桌面’ - android图片
const ANDROID_ADD_TO_DESKTOP_IMAGE = 'https://xcx-cdn.kaochong.com/recite/image/xcx_add_desktop_android.png'

// 抽奖规则
const LOTTERY_RULES = [
  '1.每人每天只有一次抽奖机会;',
  '2.当日帮你助力的好友，不可再帮其他人助力;',
  '3.越多好友助力，得奖几率越高;',
  '4.次日中午12点自动开奖，微信服务通知告知开奖结果;',
  '5.本活动最终解释权归单词天天背所有;'
]
// 返现规则
const RETMONEY_RULES = [
  '1.连续完成每日单词任务;',
  '2.有两次补签的机会;',
  '3.完成每日单词任务后，分享给好友，邀请好友点击助力;',
  '4.助力成功后，可获取今日奖学金，奖金在余额中实时查看;',
  '5.同一好友能够帮你助力5次;',
  '6.若单词计划中断，则不返还全部奖金;',
  '7.若好友助力中断，则扣除当日奖金;',
  '8.本活动不支持退款，请坚持背完哦'
]
// 提醒切换到返现单词书
const NOTIFY_TOGGLE_RETMONEY_BOOK = {
  imgUrl: 'https://xcx-cdn.kaochong.com/recite/image/xcx_qiehuan_1@2x.png',
  msg: '当前正在进行的单词任务不是返现任务哦~',
  btnText: '切换到单词挑战任务'
}
// ios设备支付时提示文案
const IOS_PAY_NOTIFICATION = '十分抱歉，由于相关规范，您暂时无法参与活动。'
// 五符图片资源
const FIVE_CHARM = [
  {
    blankImg: 'https://xcx-cdn.kaochong.com/recite/image/blank1.png',
    lockImg: 'https://xcx-cdn.kaochong.com/recite/image/sm1-.png',
    activeImg: 'https://xcx-cdn.kaochong.com/recite/image/sm1.png',
    ruleImg: 'https://xcx-cdn.kaochong.com/recite/image/mark1-rule.jpg',
    shareImg: 'https://xcx-cdn.kaochong.com/recite/image/mark1-rule.jpg'
  },
  {
    blankImg: 'https://xcx-cdn.kaochong.com/recite/image/blank2.png',
    lockImg: 'https://xcx-cdn.kaochong.com/recite/image/sm1-.png',
    activeImg: 'https://xcx-cdn.kaochong.com/recite/image/sm2.png',
    ruleImg: 'https://xcx-cdn.kaochong.com/recite/image/mark2-rule.jpg',
    shareImg: 'https://xcx-cdn.kaochong.com/recite/image/mark2-code.jpg'
  },
  {
    blankImg: 'https://xcx-cdn.kaochong.com/recite/image/blank3.png',
    lockImg: 'https://xcx-cdn.kaochong.com/recite/image/sm1-.png',
    activeImg: 'https://xcx-cdn.kaochong.com/recite/image/sm3.png',
    ruleImg: 'https://xcx-cdn.kaochong.com/recite/image/mark3-rule.jpeg',
    shareImg: 'https://xcx-cdn.kaochong.com/recite/image/mark3-code.jpg'
  },
  {
    blankImg: 'https://xcx-cdn.kaochong.com/recite/image/blank4.png',
    lockImg: 'https://xcx-cdn.kaochong.com/recite/image/sm1-.png',
    activeImg: 'https://xcx-cdn.kaochong.com/recite/image/sm4.png',
    ruleImg: 'https://xcx-cdn.kaochong.com/recite/image/mark4-rule.jpeg',
    shareImg: 'https://xcx-cdn.kaochong.com/recite/image/mark4-code.jpg'
  },
  {
    blankImg: 'https://xcx-cdn.kaochong.com/recite/image/blank5.png',
    lockImg: 'https://xcx-cdn.kaochong.com/recite/image/sm1-.png',
    activeImg: 'https://xcx-cdn.kaochong.com/recite/image/sm5.png',
    ruleImg: 'https://xcx-cdn.kaochong.com/recite/image/mark5-rule.jpeg',
    shareImg: 'https://xcx-cdn.kaochong.com/recite/image/mark5-code.jpg'
  }
]
// 五符的中间大图
const FIVE_CHARM_BG = [
  'https://xcx-cdn.kaochong.com/recite/image/f0.jpg',
  'https://xcx-cdn.kaochong.com/recite/image/f1.jpg',
  'https://xcx-cdn.kaochong.com/recite/image/f2.jpg',
  'https://xcx-cdn.kaochong.com/recite/image/F3.jpg',
  'https://xcx-cdn.kaochong.com/recite/image/f4.jpg',
  'https://xcx-cdn.kaochong.com/recite/image/f5.jpg'
]
// 新手引导
const FIVE_CHARM_GUIDE = [
  'https://xcx-cdn.kaochong.com/recite/image/guide1.png',
  'https://xcx-cdn.kaochong.com/recite/image/guide2.png',
  'https://xcx-cdn.kaochong.com/recite/image/guide3.png'
  // 'https://xcx-cdn.kaochong.com/recite/image/guide4.png'
]
// 首页背景图和标题色
const INDEX_BG_TITLE = [
  {
    titleBackgroundColor: '#52a8ee',
    withBackground: 'https://kaochong-xnr.oss-cn-beijing.aliyuncs.com/recite/fe/v2.1.0/index/backimg/morning/Icon.png',
    image: 'https://kaochong-xnr.oss-cn-beijing.aliyuncs.com/recite/fe/v2.1.0/index/backimg/morning/ttb_shou_1.png'
  },
  {
    titleBackgroundColor: '#ff6710',
    withBackground: 'https://kaochong-xnr.oss-cn-beijing.aliyuncs.com/recite/fe/v2.1.0/index/backimg/noon/Icon.png',
    image: 'https://kaochong-xnr.oss-cn-beijing.aliyuncs.com/recite/fe/v2.1.0/index/backimg/noon/ttb_shou_8.png'
  },
  {
    titleBackgroundColor: '#6c10f9',
    withBackground: 'https://kaochong-xnr.oss-cn-beijing.aliyuncs.com/recite/fe/v2.1.0/index/backimg/dusk/Icon.png',
    image: 'https://kaochong-xnr.oss-cn-beijing.aliyuncs.com/recite/fe/v2.1.0/index/backimg/dusk/ttb_shou_10.png'
  },
  {
    titleBackgroundColor: '#3a35b2',
    withBackground: 'https://kaochong-xnr.oss-cn-beijing.aliyuncs.com/recite/fe/v2.1.0/index/backimg/night/Icon.png',
    image: 'https://kaochong-xnr.oss-cn-beijing.aliyuncs.com/recite/fe/v2.1.0/index/backimg/night/ttb_shou_13.png'
  }
]
const activePlayer = 'https://xcx-cdn.kaochong.com/recite/image/ttb_lian_1@2x.gif'

const dftPlayer = 'https://xcx-cdn.kaochong.com/recite/image/ttb_lian_1@2x.png'

let yesSrc = 'https://xcx-cdn.kaochong.com/recite/yes.mp3'

let noSrc = 'https://xcx-cdn.kaochong.com/recite/no.mp3'
export {
  ROOT_URL,
  TEST_AB_APP_KEY,
  answer2mean,
  mean2answer,
  RELOCK_START,
  RELOCK_ING,
  RELOCK_SUCCESS,
  SHARE_TITLE,
  LOTTERY_TITLE,
  NORMAL_TEXT,
  shareImgSrc,
  ANSWER_PARAMS,
  DENY_RELOCK_TITLE,
  DEEPLEARNBTN,
  DEEPLEARNMODAL,
  BOOK_MODAL_TEXT,
  RET_MONEY_SHARE_TITLE,
  RET_MONEY_MODAL,
  RET_MONEY_RULES,
  RET_MONEY_NOTIFY_SHARE,
  IOS_ADD_TO_DESKTOP_IMAGE,
  ANDROID_ADD_TO_DESKTOP_IMAGE,
  RET_MONEY_NO_FRIEND_HELP,
  LOTTERY_RULES,
  RETMONEY_RULES,
  NOTIFY_TOGGLE_RETMONEY_BOOK,
  IOS_PAY_NOTIFICATION,
  FIVE_CHARM,
  FIVE_CHARM_BG,
  FIVE_CHARM_GUIDE,
  beforeTest_shareImgSrc,
  beforeTest_shareText,
  INDEX_BG_TITLE,
  activePlayer,
  dftPlayer,
  yesSrc,
  noSrc
}
