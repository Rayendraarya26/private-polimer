import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import * as yup from 'yup'
import useHookForm from '../useHookForm'
import { getErrorMessage } from '../../utils/error'
import useProfile from '../useProfile'
import { updateProfile } from '../../services/profile'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { refEducations } from '../../constants/common'
import { useNavigate } from 'react-router-dom'
import { getE164PhoneNumber, getPlainE164PhoneNumber } from '../../utils/common'

export type Fields = {
  nama: string
  alamat: string
  prov_id: string | null
  kab_id: string | null
  kec_id: string | null
  tempat_lahir: string
  tanggal_lahir: string
  jenis_kelamin: string
  kewarganegaraan: string
  nik: number
  pendidikan_terakhir: string
  pendidikan_lainnya?: string | null
  surel: string
  whatsapp: string | null
  whatsapp_otp?: string
  npwp: string | null
  nib?: string | null
  dok_npwp?: File | null
  dok_nib?: File | null
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
        tempat_lahir: yup.string().default('').trim().required('Field ini wajib diisi'),
        tanggal_lahir: yup.string().default('').trim().required('Field ini wajib diisi'),
        jenis_kelamin: yup.string().default('').trim().required('Field ini wajib diisi'),
        kewarganegaraan: yup.string().default('').trim().required('Field ini wajib diisi'),
        nik: yup.number().required('Field ini wajib diisi').test('len', 'NIK harus 16 digit', val => `${val || ''}`.length === 16),
        pendidikan_terakhir: yup.string().default('').trim().required('Field ini wajib diisi'),
        pendidikan_lainnya: yup.string().when('pendidikan_terakhir', {
          is: (val: string) => val === 'OTHER',
          then: yup.string().default('').trim().required('Field ini wajib diisi'),
          otherwise: yup.string().default('').trim().nullable()
        }),
        surel: yup.string().default('').trim().email('Email tidak valid').required('Field ini wajib diisi'),
        whatsapp: yup.string().required('Field ini wajib diisi').matches(/^\+[1-9]\d{1,14}$/, 'Nomor tidak valid').test('len', 'Nomor WhatsApp harus 9-15 digit', val => `${val || ''}`.length >= 9 && `${val || ''}`.length <= 15),
        whatsapp_otp: yup.string().optional(),
        npwp: yup.string().required('Field ini wajib diisi').test('len', 'Nomor NPWP harus 16 digit', val => `${val || ''}`.length === 16),
        nib: yup.string().required('Field ini wajib diisi').test('len', 'Nomor NIB harus 13 digit', val => `${val || ''}`.length === 13),
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
        tempat_lahir,
        tanggal_lahir,
        jenis_kelamin,
        kewarganegaraan,
        nik,
        pendidikan_terakhir,
        surel,
        whatsapp,
        npwp,
        nib,
      } = profile?.detail ?? {}

      const pendidikan_lainnya = pendidikan_terakhir && (refEducations.reduce((arr, r) => r.value !== 'OTHER' ? [...arr, r.value] : arr, [] as string[])).includes(pendidikan_terakhir) ? null : pendidikan_terakhir

      return {
        nama: nama || '',
        alamat: alamat || '',
        prov_id: prov_id ? String(prov_id) : '',
        kab_id: kab_id ? String(kab_id) : '',
        kec_id: kec_id ? String(kec_id) : '',
        tempat_lahir: tempat_lahir || '',
        tanggal_lahir: tanggal_lahir || '',
        jenis_kelamin: jenis_kelamin || '',
        kewarganegaraan: kewarganegaraan || '',
        nik: nik || 0,
        pendidikan_terakhir: pendidikan_lainnya ? 'OTHER' : (pendidikan_terakhir || ''),
        pendidikan_lainnya,
        surel: surel || '',
        whatsapp: getE164PhoneNumber(whatsapp || ''),
        whatsapp_otp: '',
        npwp: npwp || '',
        nib: nib || '',
        dok_npwp: null,
        dok_nib: null,
        dok_lainnya: null,
      }
    },
    [profile]
  )

  const { errors, rhf } = useHookForm<Fields>(defaultValues, validationSchema)

  const onSubmit = rhf.handleSubmit(
    async ({ pendidikan_lainnya, ...payload }) => {
      if (!executeRecaptcha) return
      const toastId = toast.loading('Menyimpan perubahan')
      try {
        setSubmitting(true)
        const recaptcha = await executeRecaptcha()
        const formData = new FormData()
        payload = {
          ...payload,
          whatsapp: getPlainE164PhoneNumber(payload.whatsapp || ''),
          pendidikan_terakhir: payload.pendidikan_terakhir === 'OTHER' ? pendidikan_lainnya : payload.pendidikan_terakhir
        }
        Object.entries({ recaptcha, _method: 'patch', ...payload }).map(([key, value]) => {
          if (['dok_npwp', 'dok_nib', 'dok_lainnya'].includes(key)) {
            if (value) formData.append(key, value)
          } else {
            formData.append(key, value)
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
