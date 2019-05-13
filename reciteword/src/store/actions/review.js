import wepy from 'wepy'
import { createAction } from 'redux-actions'

import {
  UPDATE_TARGET,
  UPDATE_STAGE
} from '../constants'

// import api from '@/common/api'


export const updateTarget = createAction(UPDATE_TARGET, (target) => target)
export const updateStage = createAction(UPDATE_STAGE, (stage) => stage)