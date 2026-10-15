import api from '../utils/api'
import { FormPbaPayload, PbaProductItem, FormPbaDetail } from '../types/pba'
import { DefaultApiResponse } from '../types/api'

/**
 * Mengambil katalog produk bahan acuan standar
 */
export const getPbaCatalog = async (): Promise<PbaProductItem[]> => {
  try {
    const { data } = await api.get<DefaultApiResponse<{ products: PbaProductItem[] }>>('/eksternal/pba/catalog')
    return (data as any)?.data?.products || (data as any)?.results?.products || []
  } catch (error) {
    return [
      {
        id: 'plastisitas',
        nama: 'Plastisitas',
        deskripsi: 'Rubber Standar Material untuk Uji Plastisitas / PO / PRI',
        standar: 'SNI ISO 2930 / ASTM D3194',
        satuan: 'Sampel/Unit',
        is_featured: true,
      },
      {
        id: 'viskositas_mooney',
        nama: 'Viskositas Mooney',
        deskripsi: 'Rubber Standar Material untuk Uji Viskositas Mooney',
        standar: 'SNI ISO 289-1 / ASTM D1646',
        satuan: 'Sampel/Unit',
        is_featured: true,
      },
      {
        id: 'lainnya',
        nama: 'Yang lain',
        deskripsi: 'Bahan acuan standar karet, polimer, atau kulit kustom lainnya',
        standar: 'Spesifikasi Khusus Pemohon',
        satuan: 'Sampel/Unit',
        is_featured: false,
      },
    ]
  }
}

/**
 * Mengirim formulir permohonan Produsen Bahan Acuan baru
 */
export const submitPermohonanPba = async (form: FormPbaPayload): Promise<any> => {
  const formData = new FormData()

  formData.append('nama_perusahaan', form.nama_perusahaan)
  formData.append('alamat_perusahaan', form.alamat_perusahaan)
  formData.append('alamat_pengiriman', form.alamat_pengiriman)

  if (form.provinsi_id) formData.append('provinsi_id', form.provinsi_id)
  if (form.provinsi_nama) formData.append('provinsi_nama', form.provinsi_nama)
  if (form.kabupaten_id) formData.append('kabupaten_id', form.kabupaten_id)
  if (form.kabupaten_nama) formData.append('kabupaten_nama', form.kabupaten_nama)

  formData.append('contact_person', form.contact_person)
  formData.append('no_kontak', form.no_kontak)
  formData.append('email', form.email)

  formData.append('produk_pesanan', form.produk_pesanan)
  if (form.produk_lainnya) formData.append('produk_lainnya', form.produk_lainnya)
  formData.append('jumlah', String(form.jumlah || 1))
  if (form.satuan) formData.append('satuan', form.satuan)
  if (form.catatan) formData.append('catatan', form.catatan)

  formData.append('pernyataan_konfirmasi', form.pernyataan_konfirmasi ? '1' : '0')

  if (form.file_surat_permohonan) {
    formData.append('file_surat_permohonan', form.file_surat_permohonan)
  }

  const { data } = await api.post<DefaultApiResponse<any>>('/eksternal/pba', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return data
}

/**
 * Mengambil detail permohonan PBA berdasarkan UUID
 */
export const getDetailPba = async (id: string): Promise<FormPbaDetail> => {
  const { data } = await api.get<DefaultApiResponse<FormPbaDetail>>(`/eksternal/pba/${id}`)
  return (data as any)?.data || data?.results
}
