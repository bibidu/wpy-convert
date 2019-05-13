import { handleActions } from 'redux-actions'

import {
    // MODIFY_CURRENT_QS,
    UPDATE_QUESTION,
    ADD_PART_QUESTIONS,
    ADD_QUESTION_RESULT_ITEM,
    MODIFY_QS_INDEX,
    INC_QS_INDEX,
    UPDATE_PROGRESS,
    TOGGLE_STATE,
    SAVE_CACHE_PKGNAME,
    SAVE_TARGET,
    SAVE_PART,
    CLEAR_QS_INDEX,
    INC_PART,
    RESET_QUESTION_RESULTS,
    SAVE_CACHE_AUDIOS,
    UPDATE_QUESTION_AUDIO,
    MODIFY_CACHE_DAY,
    MODIFY_QUESTION
} from '../constants'

const initState = {
    question: {},
    questions: [],
    questionResults: [],
    qsIndex: 0,
    progress: 0,
    state: 0,
    cacheName: '',
    part: 0,
    target: 0,
    cacheAudios: [],
    day: 0
}

export default handleActions({

    [UPDATE_QUESTION] (state, action) {
        const { questions, qsIndex } = state
        return {
            ...state,
            question: questions[qsIndex]
        }
    },

    [MODIFY_QUESTION] (state, action) {
        return {
            ...state,
            question: action.payload
        }
    },

    [ADD_PART_QUESTIONS] (state, action) {
        return {
            ...state,
            questions: action.payload
        }
    },

    [ADD_QUESTION_RESULT_ITEM] (state, action) {
        return {
            ...state,
            questionResults: [...state.questionResults, ...action.payload]
        }
    },

    [RESET_QUESTION_RESULTS] (state, action) {
        return {
            ...state,
            questionResults: action.payload
        }
    },
    
    [MODIFY_QS_INDEX] (state, action) {
        return {
            ...state,
            qsIndex: action.payload
        }
    },

    [INC_QS_INDEX] (state, action) {
        return {
            ...state,
            qsIndex: state.qsIndex + action.payload
        }
    },
    
    [CLEAR_QS_INDEX] (state, action) {
        return {
            ...state,
            qsIndex: 0
        }
    },

    
    [UPDATE_PROGRESS] (state, action) {
        const { qsIndex, questions } = state
        const isRight = action.payload
        return {
            ...state,
            progress: qsIndex > questions.length ? 100 : ((qsIndex + (isRight ? 1 : 0)) / questions.length) * 100
        }
    },

    [TOGGLE_STATE] (state, action) {
        return {
            ...state,
            state: action.payload
        }
    },

    [SAVE_CACHE_PKGNAME] (state, action) {
        return {
            ...state,
            cacheName: action.payload
        }
    },

    [SAVE_TARGET] (state, action) {
        return {
            ...state,
            target: action.payload
        }
    },

    [SAVE_PART] (state, action) {
        return {
            ...state,
            part: parseInt(action.payload)
        }
    },

    [INC_PART] (state, action) {
        return {
            ...state,
            part: state.part + action.payload
        }
    },

    [SAVE_CACHE_AUDIOS] (state, action) {
        return {
            ...state,
            cacheAudios: action.payload
        }
    },

    [UPDATE_QUESTION_AUDIO] (state, action) {
        return {
            ...state,
            question: {...state.question, voice: action.payload}
        }
    },

    [MODIFY_CACHE_DAY] (state, action) {
        return {
            ...state,
            day: action.payload
        }
    }
    
}, {
    ...initState
})