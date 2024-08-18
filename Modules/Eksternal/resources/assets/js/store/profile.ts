import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProfileType } from '../types/profile'

interface CommonState {
  loading: boolean,
  profile: ProfileType | null
}

const initialState: CommonState = {
  loading: true,
  profile: null
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
  },
})

export const { setLoading, setProfile } = slice.actions
export default slice.reducer
