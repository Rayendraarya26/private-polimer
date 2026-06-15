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
  prov_id: string | null
  kab_id: string | null
  kec_id: string | null
  pemilik: string
  pimpinan: string
  badan_hukum: string
  jenis: string
  telepon: string
  fax: string
  surel: string
  whatsapp: string | null
  npwp: string | null
  nib: string | null
  iup?: string | null
  no_akta_pendirian?: string | null
  pj_nama: string
  pj_whatsapp: string
  pj_whatsapp_otp?: string
  pj_surel: string
  dok_npwp?: File | null
  dok_nib?: File | null
  dok_iup?: File | null
  dok_akta_pendirian?: File | null
  dok_lainnya?: File | null
}

export default () => {
  const navigate = useNavigate()
  const { profile, getMyProfile } = useProfile()
  const [submitting, setSubmitting] = useState<boolean>(false)
  const { executeRecaptcha } = useGoogleReCaptcha()

  const validationSchema = useMemo<yup.SchemaOf<Fields>>(
    () => {
      const { dok_npwp, dok_nib } = profile?.detail ?? {}

      return yup.object({
        nama: yup.string().default('').trim().required('Field ini wajib diisi').matches(/^[a-zA-Z\s]*$/, 'Nama hanya boleh huruf dan spasi'),
        alamat: yup.string().default('').trim().uppercase().required('Field ini wajib diisi'),
        prov_id: yup.string().required('Provinsi wajib dipilih'),
        kab_id: yup.string().required('Kabupaten wajib dipilih'),
        kec_id: yup.string().required('Kecamatan wajib dipilih'),
        pimpinan: yup.string().default('').trim().required('Field ini wajib diisi').matches(/^[a-zA-Z\s]*$/, 'Nama hanya boleh huruf dan spasi'),
        pemilik: yup.string().default('').trim().required('Field ini wajib diisi').matches(/^[a-zA-Z\s]*$/, 'Nama hanya boleh huruf dan spasi'),
        badan_hukum: yup.string().default('').trim().required('Field ini wajib diisi'),
        jenis: yup.string().default('').trim().required('Field ini wajib diisi'),
        telepon: yup.string().default('').trim().required('Field ini wajib diisi'),
        fax: yup.string().default('').trim().required('Field ini wajib diisi'),
        surel: yup.string().default('').trim().email('Email tidak valid').required('Field ini wajib diisi'),
        whatsapp: yup.string().required('Field ini wajib diisi').matches(/^\+[1-9]\d{1,14}$/, 'Nomor tidak valid').test('len', 'Nomor WhatsApp harus 9-15 digit', val => `${val || ''}`.length >= 9 && `${val || ''}`.length <= 15),
        npwp: yup.string().required('Field ini wajib diisi').test('len', 'Nomor NPWP harus 16 digit', val => `${val || ''}`.length === 16),
        nib: yup.string().required('Field ini wajib diisi').test('len', 'Nomor NIB harus 13 digit', val => `${val || ''}`.length === 13),
        iup: yup.string().nullable().optional(),
        no_akta_pendirian: yup.string().nullable().optional(),
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
          .test('required', 'Field in wajib diisi', (value) => {
            return dok_npwp ? true : !!value
          }),
        dok_nib: yup.mixed()
          .test('fileSize', 'Ukuran file maksimal 5MB', (value) => {
            return value ? value.size <= 5 * 1024 * 1024 : true
          })
          .test('fileType', 'Format file harus PDF', (value) => {
            return value ? ['application/pdf'].includes(value.type) : true
          })
          .test('required', 'Field in wajib diisi', (value) => {
            return dok_nib ? true : !!value
          }),
        dok_iup: yup.mixed()
          .test('fileSize', 'Ukuran file maksimal 5MB', (value) => {
            return value ? value.size <= 5 * 1024 * 1024 : true
          })
          .test('fileType', 'Format file harus PDF', (value) => {
            return value ? ['application/pdf'].includes(value.type) : true
          })
          .optional()
          .nullable(),
        dok_akta_pendirian: yup.mixed()
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
      })
    },
    [profile]
  )

  const defaultValues = useMemo<Fields>(
    () => {
      const {
        nama,
        alamat,
        prov_id,
        kab_id,
        kec_id,
        pemilik,
        pimpinan,
        badan_hukum,
        jenis,
        telepon,
        fax,
        surel,
        whatsapp,
        npwp,
        nib,
        iup,
        no_akta_pendirian,
        pj_nama,
        pj_whatsapp,
        pj_surel,
      } = profile?.detail ?? {}

      return {
        nama: nama || '',
        alamat: alamat || '',
        prov_id: prov_id ? String(prov_id) : '',
        kab_id: kab_id ? String(kab_id) : '',
        kec_id: kec_id ? String(kec_id) : '',
        pemilik: pemilik || '',
        pimpinan: pimpinan || '',
        badan_hukum: badan_hukum || '',
        jenis: jenis || '',
        telepon: telepon ? (telepon.startsWith('62') ? telepon.replace('62', '') : telepon) : '',
        fax: fax || '',
        surel: surel || '',
        whatsapp: whatsapp ? getE164PhoneNumber(whatsapp) : null,
        npwp: npwp || '',
        nib: nib || '',
        iup: iup || null,
        no_akta_pendirian: no_akta_pendirian || '',
        pj_nama: pj_nama || '',
        pj_whatsapp: pj_whatsapp ? getE164PhoneNumber(pj_whatsapp) || '' : '',
        pj_whatsapp_otp: '',
        pj_surel: pj_surel || '',
        dok_npwp: null,
        dok_nib: null,
        dok_iup: null,
        dok_akta_pendirian: null,
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
              if (['dok_npwp','dok_nib','dok_iup','dok_akta_pendirian','dok_lainnya'].includes(key)) {
                if (value) formData.append(key, value)
              } else {
                formData.append(key, value)
              }
            }
          }
        })
        await updateProfile(formData)
        getMyProfile()
        toast.success('Profile berhasil diperbarui')
        navigate('/dashboard', { replace: true });
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
