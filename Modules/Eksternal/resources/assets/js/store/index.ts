import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import common from './common'
import profile from './profile'
import dashboard from './dashboard'

const rootReducer = combineReducers({
  common,
  profile,
  dashboard
})

const store = configureStore({
  reducer: rootReducer,
})

export default store
export type RootState = ReturnType<typeof rootReducer>