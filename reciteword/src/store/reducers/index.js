import {combineReducers} from 'redux'
import practice from './practice'
import review from './review'

const rootReducer = combineReducers({
  practice,
  review
})

export default rootReducer