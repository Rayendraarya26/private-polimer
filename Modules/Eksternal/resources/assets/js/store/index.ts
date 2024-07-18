import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import common from './common'

const rootReducer = combineReducers({
  common,
})

const store = configureStore({
  reducer: rootReducer,
})

export default store
export type RootState = ReturnType<typeof rootReducer>