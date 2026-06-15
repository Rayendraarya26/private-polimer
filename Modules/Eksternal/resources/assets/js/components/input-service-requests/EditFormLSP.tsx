import React, { memo, useEffect, useState, useCallback } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import styled from "styled-components"
import { toast } from "react-hot-toast"
import { useParams } from "react-router-dom"
import { useLSP } from "../../hooks/service-requests/useLSP"

const BASE_STORAGE = "http://localhost:4700/storage/"

const StyledRow = styled(Row)`
  gap: 1rem;
  @media screen and (min-width: 768px) {
    gap: 0;
  }
`

const initialState = {
  nama_lengkap: '',
  gender: '',
  tempat_lahir: '',
  nik_peserta: '',
  tanggal_lahir: '',
  kewarganegaraan: '',
  kode_pos: '',
  pendidikan: '',
  whatsapp: '',
  email: '',
  alamat_peserta: '',

  ktp_peserta: null as File | null,
  ijazah: null as File | null,
  apl_01: null as File | null,
  apl_02: null as File | null,
  upload_lainya: null as File | null,

  nama_instansi: '',
  alamat_instansi: '',
  jenis_produk: '',
  jabatan: '',
  pengalaman_kerja: '',
  setuju_syarat: false,
}


const EditFormLSP: React.FC = () => {

  const { id } = useParams()
  const { getDetailLSP, updateLSP, submitting } = useLSP()

  const [formData, setFormData] = useState(initialState)

  const [previewFile, setPreviewFile] = useState<any>({
    ktp_peserta: '',
    ijazah: '',
    apl_01: '',
    apl_02: '',
    upload_lainya: '',
  })

  const buildFileUrl = (path: string) => {

    if (!path) return ''

    if (path.startsWith('http')) return path

    if (path.startsWith('/storage')) return `http://localhost:4700${path}`

    return `${BASE_STORAGE}${path}`

  }

  useEffect(() => {

    const fetchDetail = async () => {

      if (!id) return

      try {

        const res = await getDetailLSP(id)

        const data = res?.data ?? res
        const form = data?.results?.form

        if (!form) {
          toast.error("Data LSP tidak ditemukan")
          return
        }

        setFormData({
          ...initialState,

          nama_lengkap: form.nama_lengkap || '',
          gender: form.gender || '',
          tempat_lahir: form.tempat_lahir || '',
          nik_peserta: form.nik_peserta || '',
          tanggal_lahir: form.tanggal_lahir ? form.tanggal_lahir.substring(0, 10) : '',
          kewarganegaraan: form.kewarganegaraan || '',
          kode_pos: form.kode_pos || '',
          pendidikan: form.pendidikan || '',
          whatsapp: form.whatsapp || '',
          email: form.email || '',
          alamat_peserta: form.alamat_peserta || '',

          nama_instansi: form.nama_instansi || '',
          alamat_instansi: form.alamat_instansi || '',
          jenis_produk: form.jenis_produk || '',
          jabatan: form.jabatan || '',
          pengalaman_kerja: form.pengalaman_kerja || '',

          setuju_syarat: Boolean(form.setuju_syarat),

          ktp_peserta: null,
          ijazah: null,
          apl_01: null,
          apl_02: null,
          upload_lainya: null,
        })

        // ================= FIX PREVIEW =================
        setPreviewFile({
          ktp_peserta: buildFileUrl(form.ktp_peserta),
          ijazah: buildFileUrl(form.ijazah),
          apl_01: buildFileUrl(form.apl_01),
          apl_02: buildFileUrl(form.apl_02),
          upload_lainya: buildFileUrl(form.upload_lainya),
        })

      } catch (err) {

        console.error(err)
        toast.error("Gagal load data LSP")

      }

    }

    fetchDetail()

  }, [id])

  // ================= HANDLE CHANGE =================
  const handleChange = (e: any) => {

    const { name, type } = e.target

    if (type === "file") {

      const file = e.target.files?.[0]

      setFormData(prev => ({
        ...prev,
        [name]: file
      }))

      if (file) {

        const url = URL.createObjectURL(file)

        setPreviewFile((prev: any) => ({
          ...prev,
          [name]: url
        }))

      }

    } else if (type === "checkbox") {

      setFormData(prev => ({ ...prev, [name]: e.target.checked }))

    } else {

      setFormData(prev => ({ ...prev, [name]: e.target.value }))

    }

  }

  // ================= UPDATE =================
  const onSubmit = useCallback(async (e: React.FormEvent) => {

    e.preventDefault()

    if (!id) return

    if (!formData.setuju_syarat)
      return toast.error("Anda harus menyetujui syarat")

    await updateLSP(id, formData, () => {

      toast.success("Berhasil update LSP")

    })

  }, [formData, id, updateLSP])

  return (

<Form onSubmit={onSubmit}>

<Row>
<Col xs={12} className="d-flex flex-column gap-4">

{/* DATA PESERTA */}
<div className="border rounded-3 p-3 bg-light d-flex flex-column gap-3">

<div className="fs-5 fw-bold">Data Peserta</div>

<Form.Group>
<Form.Label>Nama Lengkap</Form.Label>
<Form.Control name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} required/>
</Form.Group>

<StyledRow>

<Col xs={12} lg={4}>
<Form.Group>
<Form.Label>Tempat Lahir</Form.Label>
<Form.Control name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange}/>
</Form.Group>
</Col>

<Col xs={12} lg={4}>
<Form.Group>
<Form.Label>Tanggal Lahir</Form.Label>
<Form.Control type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange}/>
</Form.Group>
</Col>

<Col xs={12} lg={4}>
<Form.Group>
<Form.Label>Jenis Kelamin</Form.Label>
<Form.Select name="gender" value={formData.gender} onChange={handleChange}>
<option value="">Pilih</option>
<option value="Laki-laki">Laki-laki</option>
<option value="Perempuan">Perempuan</option>
</Form.Select>
</Form.Group>
</Col>

</StyledRow>

<Form.Group>
<Form.Label>Alamat Peserta</Form.Label>
<Form.Control as="textarea" rows={2} name="alamat_peserta" value={formData.alamat_peserta} onChange={handleChange}/>
</Form.Group>

<Form.Group>
<Form.Label>NIK</Form.Label>
<Form.Control name="nik_peserta" value={formData.nik_peserta} onChange={handleChange}/>
</Form.Group>

<Form.Group>
<Form.Label>Kewarganegaraan</Form.Label>
<Form.Control name="kewarganegaraan" value={formData.kewarganegaraan} onChange={handleChange}/>
</Form.Group>

<Form.Group>
<Form.Label>Kode Pos</Form.Label>
<Form.Control name="kode_pos" value={formData.kode_pos} onChange={handleChange}/>
</Form.Group>

<Form.Group>
<Form.Label>Pendidikan</Form.Label>
<Form.Select name="pendidikan" value={formData.pendidikan} onChange={handleChange}>
<option value="">Pilih</option>
<option value="S3">S3</option>
<option value="S2">S2</option>
<option value="S1">S1</option>
<option value="D3">D3</option>
<option value="D1 / SMA / SMK">D1 / SMA / SMK</option>
<option value="Lainnya">Lainnya</option>
</Form.Select>
</Form.Group>

<Form.Group>
<Form.Label>WhatsApp</Form.Label>
<Form.Control name="whatsapp" value={formData.whatsapp} onChange={handleChange}/>
</Form.Group>

<Form.Group>
<Form.Label>Email</Form.Label>
<Form.Control name="email" value={formData.email} onChange={handleChange}/>
</Form.Group>

{/* KTP */}
<Form.Group>
<Form.Label>Upload KTP</Form.Label>
<Form.Control type="file" name="ktp_peserta" onChange={handleChange}/>
{previewFile.ktp_peserta && (
<img src={previewFile.ktp_peserta} alt="ktp" style={{width:200, marginTop:10}}/>
)}
</Form.Group>

{/* IJAZAH */}
<Form.Group>
<Form.Label>Upload Ijazah</Form.Label>
<Form.Control type="file" name="ijazah" onChange={handleChange}/>
{previewFile.ijazah && (
<img src={previewFile.ijazah} alt="ijazah" style={{width:200, marginTop:10}}/>
)}
</Form.Group>

{/* APL01 */}
<Form.Group>
<Form.Label>Upload APL-01</Form.Label>
<Form.Control type="file" name="apl_01" onChange={handleChange}/>
{previewFile.apl_01 && (
<img src={previewFile.apl_01} alt="apl01" style={{width:200, marginTop:10}}/>
)}
</Form.Group>

{/* APL02 */}
<Form.Group>
<Form.Label>Upload APL-02</Form.Label>
<Form.Control type="file" name="apl_02" onChange={handleChange}/>
{previewFile.apl_02 && (
<img src={previewFile.apl_02} alt="apl02" style={{width:200, marginTop:10}}/>
)}
</Form.Group>

{/* FILE LAIN */}
<Form.Group>
<Form.Label>Upload Dokumen Lainnya</Form.Label>
<Form.Control type="file" name="upload_lainya" onChange={handleChange}/>
{previewFile.upload_lainya && (
<img src={previewFile.upload_lainya} alt="lainnya" style={{width:200, marginTop:10}}/>
)}
</Form.Group>

</div>

{/* DATA INSTANSI */}
<div className="border rounded-3 p-3 bg-light d-flex flex-column gap-3">

<div className="fs-5 fw-bold">Data Instansi</div>

<Form.Group>
<Form.Label>Nama Instansi</Form.Label>
<Form.Control name="nama_instansi" value={formData.nama_instansi} onChange={handleChange}/>
</Form.Group>

<Form.Group>
<Form.Label>Alamat Instansi</Form.Label>
<Form.Control as="textarea" name="alamat_instansi" value={formData.alamat_instansi} onChange={handleChange}/>
</Form.Group>

<Form.Group>
<Form.Label>Jenis Produk</Form.Label>
<Form.Control name="jenis_produk" value={formData.jenis_produk} onChange={handleChange}/>
</Form.Group>

<Form.Group>
<Form.Label>Jabatan</Form.Label>
<Form.Control name="jabatan" value={formData.jabatan} onChange={handleChange}/>
</Form.Group>

<Form.Group>
<Form.Label>Pengalaman Kerja</Form.Label>
<Form.Control name="pengalaman_kerja" value={formData.pengalaman_kerja} onChange={handleChange}/>
</Form.Group>

</div>

{/* PERSETUJUAN */}
<div className="border rounded-3 p-3 bg-light">

<div className="fs-5 fw-bold">Persetujuan</div>

<ol className="ps-3 mt-3">
<li>Saya akan mengikuti pelatihan sampai akhir.</li>
<li>Saya akan menyelesaikan tugas instruktur.</li>
<li>Saya menyetujui pembayaran biaya pelatihan.</li>
</ol>

<Form.Check
className="mt-3 fw-semibold"
type="checkbox"
name="setuju_syarat"
checked={formData.setuju_syarat}
onChange={handleChange}
label="Dengan ini saya menyetujui syarat dan ketentuan yang berlaku *"
/>

</div>

<div className="d-flex justify-content-end">
<Button type="submit" disabled={submitting}>
{submitting ? "Menyimpan..." : "Update"}
</Button>
</div>

</Col>
</Row>

</Form>

  )
}

export default memo(EditFormLSP)
