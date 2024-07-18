import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CommonState {
  isShowSidebar: boolean,
  windowWidth: number
}

const initialState: CommonState = {
  isShowSidebar: true,
  windowWidth: window.innerWidth
}

const counterSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setShowSidebar(state, action: PayloadAction<boolean>) {
      state.isShowSidebar = action.payload
    },
    setWindowWidth(state, action: PayloadAction<number>) {
      state.windowWidth = action.payload
    },
  },
})

export const { setShowSidebar, setWindowWidth } = counterSlice.actions
export default counterSlice.reducer
