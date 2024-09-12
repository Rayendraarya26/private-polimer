import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LayananItem, SliderItem } from '../types/dashboard'

interface DashboardState {
  loadingLayanan: boolean
  layanan: LayananItem[]
  sliders: SliderItem[]
}

const initialState: DashboardState = {
  loadingLayanan: true,
  layanan: [],
  sliders: [],
}

const slice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setLoadingLayanan(state, action: PayloadAction<boolean>) {
      state.loadingLayanan = action.payload
    },
    setLayanan(state, action: PayloadAction<LayananItem[]>) {
      state.layanan = action.payload
    },
    setSliders(state, action: PayloadAction<SliderItem[]>) {
      state.sliders = action.payload
    },
  },
})

export const { setLoadingLayanan, setLayanan, setSliders } = slice.actions
export default slice.reducer
