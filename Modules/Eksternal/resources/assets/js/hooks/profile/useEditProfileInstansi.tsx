import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import * as yup from 'yup'
import useHookForm from '../useHookForm'
import { getErrorMessage } from '../../utils/error'
import useProfile from '../useProfile'
import { updateProfile } from '../../services/profile'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useNavigate } from 'react-router-dom'
import { getE164PhoneNumber, getPlainE164PhoneNumber } from '../../utils/common'

export type Fields = {
  nama: string
  alamat: string
  pimpinan: string
  telepon: string
  fax: string
  surel: string
  whatsapp: string | null
  npwp: string | null
  nib?: string | null
  sk_nomenklatur: string
  pj_nama: string
  pj_whatsapp: string
  pj_whatsapp_otp?: string
  pj_surel: string
  dok_npwp?: File | null
  dok_nib?: File | null
  dok_sk_nomenklatur?: File | null
  dok_lainnya?: File | null
}

export default () => {
  const navigate = useNavigate()
  const { profile, getMyProfile } = useProfile()
  const [submitting, setSubmitting] = useState<boolean>(false)
  const { executeRecaptcha } = useGoogleReCaptcha()

  const validationSchema = useMemo<yup.SchemaOf<Fields>>(
    () =>
      yup.object({
        nama: yup.string().default('').trim().required('Field ini wajib diisi').matches(/^[a-zA-Z\s]*$/, 'Nama hanya boleh huruf dan spasi'),
        alamat: yup.string().default('').trim().required('Field ini wajib diisi'),
        pimpinan: yup.string().default('').trim().required('Field ini wajib diisi').matches(/^[a-zA-Z\s]*$/, 'Nama hanya boleh huruf dan spasi'),
        telepon: yup.string().default('').trim().required('Field ini wajib diisi'),
        fax: yup.string().default('').trim().required('Field ini wajib diisi'),
        surel: yup.string().default('').trim().email('Email tidak valid').required('Field ini wajib diisi'),
        whatsapp: yup.string().required('Field ini wajib diisi').matches(/^\+[1-9]\d{1,14}$/, 'Nomor tidak valid').test('len', 'Nomor WhatsApp harus 9-15 digit', val => `${val || ''}`.length >= 9 && `${val || ''}`.length <= 15),
        npwp: yup.string().required('Field ini wajib diisi').test('len', 'Nomor NPWP harus 16 digit', val => `${val || ''}`.length === 16),
        nib: yup.string().nullable().optional().test('len', 'Nomor NPWP harus 13 digit', val => val ? `${val || ''}`.length === 13 : true),
        sk_nomenklatur: yup.string().default('').trim().required('Field ini wajib diisi'),
        pj_nama: yup.string().default('').trim().required('Field ini wajib diisi').matches(/^[a-zA-Z\s]*$/, 'Nama hanya boleh huruf dan spasi'),
        pj_whatsapp: yup.string().default('').trim().required('Field ini wajib diisi').matches(/^\+[1-9]\d{1,14}$/, 'Nomor tidak valid').test('len', 'Nomor WhatsApp harus 9-15 digit', val => `${val || ''}`.length >= 9 && `${val || ''}`.length <= 15),
        pj_whatsapp_otp: yup.string().optional(),
        pj_surel: yup.string().default('').trim().email('Email tidak valid').required('Field ini wajib diisi'),
        dok_npwp: yup.mixed()
          .test('fileSize', 'Ukuran file maksimal 5MB', (value) => {
            return value ? value.size <= 5 * 1024 * 1024 : true
          })
          .test('fileType', 'Format file harus PDF', (value) => {
            return value ? ['application/pdf'].includes(value.type) : true
          })
          .optional()
          .nullable(),
        dok_nib: yup.mixed()
          .test('fileSize', 'Ukuran file maksimal 5MB', (value) => {
            return value ? value.size <= 5 * 1024 * 1024 : true
          })
          .test('fileType', 'Format file harus PDF', (value) => {
            return value ? ['application/pdf'].includes(value.type) : true
          })
          .optional()
          .nullable(),
        dok_sk_nomenklatur: yup.mixed()
          .test('fileSize', 'Ukuran file maksimal 5MB', (value) => {
            return value ? value.size <= 5 * 1024 * 1024 : true
          })
          .test('fileType', 'Format file harus PDF', (value) => {
            return value ? ['application/pdf'].includes(value.type) : true
          })
          .optional()
          .nullable(),
        dok_lainnya: yup.mixed()
          .test('fileSize', 'Ukuran file maksimal 5MB', (value) => {
            return value ? value.size <= 5 * 1024 * 1024 : true
          })
          .test('fileType', 'Format file harus PDF/zip', (value) => {
            return value ? ['application/pdf','application/zip'].includes(value.type) : true
          })
          .optional()
          .nullable(),
      }),
    []
  )

  const defaultValues = useMemo<Fields>(
    () => {
      const {
        nama,
        alamat,
        pimpinan,
        telepon,
        fax,
        surel,
        whatsapp,
        npwp,
        nib,
        sk_nomenklatur,
        pj_nama,
        pj_whatsapp,
        pj_surel,
      } = profile?.detail ?? {}

      return {
        nama: nama || '',
        alamat: alamat || '',
        pimpinan: pimpinan || '',
        telepon: telepon ? (telepon.startsWith('62') ? telepon.replace('62', '') : telepon) : '',
        fax: fax || '',
        surel: surel || '',
        whatsapp: whatsapp ? getE164PhoneNumber(whatsapp) : null,
        npwp: npwp || null,
        nib: nib || null,
        sk_nomenklatur: sk_nomenklatur || '',
        pj_nama: pj_nama || '',
        pj_whatsapp: pj_whatsapp ? getE164PhoneNumber(pj_whatsapp) || '' : '',
        pj_whatsapp_otp: '',
        pj_surel: pj_surel || '',
        dok_npwp: null,
        dok_nib: null,
        dok_sk_nomenklatur: null,
        dok_lainnya: null,
      }
    },
    [profile]
  )

  const { errors, rhf } = useHookForm<Fields>(defaultValues, validationSchema)

  const onSubmit = rhf.handleSubmit(
    async (payload) => {
      if (!executeRecaptcha) return
      const toastId = toast.loading('Menyimpan perubahan')
      try {
        setSubmitting(true)
        const recaptcha = await executeRecaptcha()
        const formData = new FormData()
        payload = {
          ...payload,
          whatsapp: getPlainE164PhoneNumber(payload.whatsapp || ''),
          pj_whatsapp: getPlainE164PhoneNumber(payload.pj_whatsapp || '')
        }
        Object.entries({ recaptcha, _method: 'patch', ...payload }).map(([key, value]) => {
          if (value) {
            if (['telepon'].includes(key)) {
              formData.append(key, `62${value}`)
            } else {
              formData.append(key, value)
            }
          }
        })
        await updateProfile(formData)
        getMyProfile()
        toast.success('Profile berhasil diperbarui')
        navigate(-1)
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
    onSubmit
  }
}
