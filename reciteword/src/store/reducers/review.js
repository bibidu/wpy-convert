import { handleActions } from 'redux-actions'

import {
  UPDATE_TARGET,
  UPDATE_STAGE
} from '../constants'

const initState = {
    stage: 0,
    target: 0
}

export default handleActions({
    [UPDATE_TARGET] (state, action) {
        const { questions, qsIndex } = state
        return {
            ...state,
            target: action.payload
        }
    },

    [UPDATE_STAGE] (state, action) {
        return {
            ...state,
            stage: action.payload
        }
    }
}, {
    ...initState
})