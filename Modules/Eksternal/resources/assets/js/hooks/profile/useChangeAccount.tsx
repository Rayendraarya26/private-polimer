import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import * as yup from 'yup'
import useHookForm from '../useHookForm'
import { changeAccount } from '../../services/profile'
import { getErrorMessage } from '../../utils/error'
import useProfile from '../useProfile'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useNavigate } from 'react-router-dom'

export type ProfileChangeAccountFields = {
  name: string
}

export default () => {
  const navigate = useNavigate()
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [submitting, setSubmitting] = useState<boolean>(false)
  const { profile, getMyProfile } = useProfile()

  const validationSchema = useMemo<yup.SchemaOf<ProfileChangeAccountFields>>(
    () =>
      yup.object({
        name: yup.string().default('').required('Mohon isi password saat ini'),
      }),
    []
  )

  const defaultValues = useMemo<ProfileChangeAccountFields>(
    () => ({
      name: profile?.name || '',
    }),
    [profile]
  )

  useEffect(() => {
    rhf.setValue('name', profile?.name || '')
  }, [profile])

  const { errors, rhf } = useHookForm<ProfileChangeAccountFields>(defaultValues, validationSchema)

  const onSaveAccount = rhf.handleSubmit(
    async (payload) => {
      if (!executeRecaptcha) return
      const toastId = toast.loading('Menyimpan')
      try {
        setSubmitting(true)
        const recaptcha = await executeRecaptcha()
        await changeAccount({ recaptcha, ...payload })
        rhf.reset()
        getMyProfile()
        toast.success('Akun berhasil diubah')
        navigate('/dashboard')
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setSubmitting(false)
        toast.remove(toastId)
      }
    }
  )

  return {
    errors,
    rhf,
    submitting,
    onSaveAccount
  }
}
