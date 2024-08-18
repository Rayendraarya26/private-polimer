import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import * as yup from 'yup'
import { REGEX } from '../../utils/common'
import useHookForm from '../useHookForm'
import { changePassword } from '../../services/profile'
import { getErrorMessage } from '../../utils/error'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

export type ProfileChangePasswordFields = {
  old_password: string
  new_password: string
  new_password_confirmation: string
}

export default () => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [submitting, setSubmitting] = useState<boolean>(false)

  const validationSchema = useMemo<yup.SchemaOf<ProfileChangePasswordFields>>(
    () =>
      yup.object({
        old_password: yup.string().default('').required('Mohon isi password saat ini'),
        new_password: yup
          .string()
          .default('')
          .required('Mohon isi password baru')
          .min(8, 'Minimal 8 karakter')
          .matches(REGEX.noWhiteSpace, 'Jangan menggunakan spasi pada password'),
          // .matches(REGEX.oneLowercase, 'Harus mengandung setidaknya satu huruf kecil')
          // .matches(REGEX.oneUppercase, 'Harus mengandung setidaknya satu huruf besar')
          // .matches(REGEX.oneNumber, 'Harus mengandung setidaknya satu angka')
          // .matches(REGEX.oneSymbol, 'Harus mengandung setidaknya satu karakter khusus'),
        new_password_confirmation: yup
          .string()
          .default('')
          .required('Mohon isi konfirmasi password baru')
          .oneOf([yup.ref('new_password'), null], 'Konfirmasi password baru tidak cocok')
      }),
    []
  )

  const defaultValues = useMemo<ProfileChangePasswordFields>(
    () => ({
      old_password: '',
      new_password: '',
      new_password_confirmation: ''
    }),
    []
  )

  const { errors, rhf } = useHookForm<ProfileChangePasswordFields>(defaultValues, validationSchema)

  const onSavePassword = rhf.handleSubmit(
    async (payload) => {
      if (!executeRecaptcha) return
      const toastId = toast.loading('Menyimpan')
      try {
        setSubmitting(true)
        const recaptcha = await executeRecaptcha()
        await changePassword({ recaptcha, ...payload })
        rhf.reset()
        toast.success('Kata sandi berhasil diubah')
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
    onSavePassword
  }
}
