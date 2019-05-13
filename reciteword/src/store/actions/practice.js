import wepy from 'wepy'
import { createAction } from 'redux-actions'
import common from '../../common/common'

// import storage from '@/common/storage'
import {
  // MODIFY_CURRENT_QS,
  QUERY_PART_QUESTIONS,
  ADD_PART_QUESTIONS,
  UPDATE_QUESTION,
  ADD_QUESTION_RESULT_ITEM,
  RESET_QUESTION_RESULTS,
  MODIFY_QS_INDEX,
  INC_QS_INDEX,
  UPDATE_PROGRESS,
  TOGGLE_STATE,
  SAVE_CACHE_PKGNAME,
  SAVE_TARGET,
  SAVE_PART,
  CLEAR_QS_INDEX,
  INC_PART,
  SAVE_CACHE_AUDIOS,
  UPDATE_QUESTION_AUDIO,
  MODIFY_CACHE_DAY,
  MODIFY_QUESTION
} from '../constants'

import api from '@/common/api'

// 缓存part题目前缀
const cachePrefix = 'v2-qs-'

// export const modifyCurrentQs = createAction(MODIFY_CURRENT_QS, (question) => question)
export const addPartQuestions = createAction(ADD_PART_QUESTIONS, (questions) => questions)
export const updateQuestion = createAction(UPDATE_QUESTION)
export const modifyQuestion = createAction(MODIFY_QUESTION, (question) => question)
export const addQuestionResultItem = createAction(ADD_QUESTION_RESULT_ITEM, (errorId) => errorId)
export const resetQuestionResults = createAction(RESET_QUESTION_RESULTS, (questionResults) => questionResults)
export const modifyQsIndex = createAction(MODIFY_QS_INDEX, (qsIndex) => qsIndex)
export const incQsIndex = createAction(INC_QS_INDEX, (num) => num)
export const clearQsIndex = createAction(CLEAR_QS_INDEX)
export const updateProgress = createAction(UPDATE_PROGRESS, isRight => isRight)
export const toggleState = createAction(TOGGLE_STATE, state => state)
export const saveCachePkgname = createAction(SAVE_CACHE_PKGNAME, cacheName => cacheName)
export const saveTarget = createAction(SAVE_TARGET, target => target)
export const savePart = createAction(SAVE_PART, part => part)
export const incPart = createAction(INC_PART, num => num)
export const updateQuestionAudio = createAction(UPDATE_QUESTION_AUDIO, audios => audios)
export const modifyCacheDay = createAction(MODIFY_CACHE_DAY, day => day)


const cacheQs = function () {
  return (dispatch, getState) => {
    const { questions, qsIndex, questionResults, cacheName, day } = getState().practice
    wepy.setStorageSync(cacheName, { questions, qsIndex, questionResults, day })
  }
}

export function saveCacheAudios(audios) {
  return (dispatch, getState) => {
    let { questions } = getState().practice
    let withCachedAudioQs = questions.map(qs => {
      let audioRst = audios.find(audio => audio.id === qs.id)
      return {...qs, cachedVoice: audioRst.voice}
    })
    dispatch(addPartQuestions(withCachedAudioQs))
    // dispatch(cacheQs())
  }
}
// export function getQuestionWithCachedAudio() {
//   return (dispatch, getState) => {
//     const { cacheAudios } = getState().practice
//     dispatch(updateQuestion())
//     const { question } = getState().practice
//     const cacheRst = cacheAudios.find(cache => cache.id === question.id)
//     console.log(cacheRst)
//     dispatch(updateQuestionAudio(cacheRst.voice))
//   }
// }
// 练习模式（初始化）
export function queryPartQuestions (newTarget) {
  return async (dispatch, getState) => {
    const { part, target } = getState().practice
    const cacheName = `${cachePrefix}${newTarget || target}`
    let cacheData = wepy.getStorageSync(cacheName)
    let { timestamp } = await api.getServerTime()
    const serverDay = new Date(timestamp).getDate()
    if (!cacheData || cacheData.day !== serverDay) {
      let { wordsList } = await api.getGroupWords({ part })
      cacheData = {
        questions: wordsList,
        questionResults: [],
        qsIndex: 0,
        day: serverDay
      }
    }
    const { questions, qsIndex, questionResults, day } = cacheData
    dispatch(saveCachePkgname(cacheName))
    dispatch(modifyQsIndex(qsIndex))
    dispatch(modifyCacheDay(day))
    dispatch(addPartQuestions(questions))
    // dispatch(getQuestionWithCachedAudio())
    dispatch(resetQuestionResults(questionResults))
    dispatch(cacheQs())
    dispatch(toggleState(0))
    dispatch(updateProgress())
  }
}
// 最终测试[练习]模式（选择选项）
export function replyAnswerFinal(isRight) {
  return (dispatch, getState) => {
    const { question } = getState().practice
    if (!isRight) {
      dispatch(addQuestionResultItem([question.id]))
    }
    dispatch(updateProgress(true))
    dispatch(incQsIndex(1))
    dispatch(cacheQs())
  }
}
// 练习模式（选择选项）
export function replyAnswer (isRight) {
  return async (dispatch, getState) => {
    const { question, qsIndex, questions } = getState().practice
    // 最后一题
    const lastQs = qsIndex === questions.length - 1
    if (isRight) {
      dispatch(updateProgress(true))
      dispatch(incQsIndex(1))
      if (!lastQs) {
        dispatch(cacheQs())
      }
    } else {
      dispatch(addQuestionResultItem([question.id]))
      dispatch(cacheQs())
    }
  }
}
// 混淆选项
export function confuseQuestion() {
  return async (dispatch, getState) => {
    // 获取最新答案
    const getNewKey = (source) => {
      return { 1: 3, 2: 4, 3: 2, 4: 1 }[source]
    }
    const { question } = getState().practice
    const ops = question.options
    const newOps = [ops[3], ops[2], ops[0], ops[1]]
    dispatch(modifyQuestion(common.addOptionSingle({
      ...question,
      options: newOps,
      realAnswer: getNewKey(question.realAnswer)
    })))
    // const ops = question.options
    // let newOps = [ops[3], ops[2], ops[0], ops[1]]
  }
}
// 学习模式（上一页/下一页）/slot函数
export function studyStep(step) {
  return async (dispatch, getState) => {
    const { questions, qsIndex } = getState().practice
    
    if (step === 1) {
      dispatch(incQsIndex(1))
      dispatch(updateProgress())
      dispatch(updateQuestion())
      dispatch(cacheQs())
    }
    if (step === -1) {
      dispatch(incQsIndex(-1))
      dispatch(updateProgress())
      dispatch(updateQuestion())
    }
    
  }
}
// 完成学习模式
export function finishEntireStudy() {
  return async (dispatch, getState) => {
    const { part } = getState().practice
    await api.submitNewVersionModule({ part, module: 0 })
    dispatch(clearQsIndex())
    dispatch(cacheQs())
  }
}