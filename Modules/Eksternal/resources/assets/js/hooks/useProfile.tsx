import { useCallback, useMemo } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import { useDispatch } from "react-redux"
import { setLoading, setProfile } from "../store/profile"
import { getErrorMessage } from "../utils/error"
import { getProfile } from "../services/profile"

export default () => {
  const { loading, profile } = useSelector(({ profile }: RootState) => profile)
  const dispatch = useDispatch()

  const getMyProfile = useCallback(
    async () => {
      try {
        dispatch(setLoading(true))
        const results = await getProfile()
        dispatch(setProfile(results))
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        dispatch(setLoading(false))
      }
    },
    []
  )

  return {
    loading,
    profile,
    getMyProfile,
    cleintType: useMemo(() => profile?.detail?.type, [profile])
  }
}