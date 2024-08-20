import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProfileType } from '../types/profile'

interface CommonState {
  loading: boolean,
  profile: ProfileType | null
  unreadNotifCount: number
}

const initialState: CommonState = {
  loading: true,
  profile: null,
  unreadNotifCount: 0
}

const slice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setProfile(state, action: PayloadAction<ProfileType | null>) {
      state.profile = action.payload
    },
    setUnreadNotifCount(state, action: PayloadAction<number>) {
      state.unreadNotifCount = action.payload
    },
  },
})

export const { setLoading, setProfile, setUnreadNotifCount } = slice.actions
export default slice.reducer
