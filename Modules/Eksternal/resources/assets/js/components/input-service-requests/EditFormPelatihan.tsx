import React, { memo, useEffect, useState, useCallback } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import styled from "styled-components"
import { toast } from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import usePelatihan from "../../hooks/service-requests/usePelatihan"

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || ""

const StyledRow = styled(Row)`
  gap: 1rem;
  @media screen and (min-width: 768px) {
    gap: 0;
  }
`
const initialState = {
  skema_id: '',
  nama_lengkap: '',
  gender: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  pendidikan: '',
  whatsapp: '',
  alamat_peserta: '',
  email: '',
  nik_peserta: '',
  agama: '',
  nama_instansi: '',
  alamat_instansi: '',
  jenis_produk: '',
  masalah_materi: '',
  hal_dipelajari: '',
  setuju_syarat: false,
  ktp_peserta: null as File | null,
  foto_peserta: null as File | null,
}
const EditFormPelatihan: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getDetailPelatihan, updatePelatihan, submitting } = usePelatihan()
  const [formData, setFormData] = useState(initialState)
  const [previewKtp, setPreviewKtp] = useState<string | null>(null)
  const [previewFoto, setPreviewFoto] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return
      try {
        const data = await getDetailPelatihan(id)
        if (!data?.form) {
          toast.error("Data pelatihan tidak ditemukan")
          return
        }
        const form = data.form
        setFormData({
          ...initialState,
          skema_id: data.permohonan?.lingkup_layanan_id || '',
          nama_lengkap: form.nama_lengkap || '',
          gender: form.gender || '',
          tempat_lahir: form.tempat_lahir || '',
          tanggal_lahir: form.tanggal_lahir ? form.tanggal_lahir.substring(0, 10) : '',
          pendidikan: form.pendidikan || '',
          whatsapp: form.whatsapp || '',
          alamat_peserta: form.alamat_peserta || '',
          email: form.email || '',
          nik_peserta: form.nik_peserta || '',
          agama: form.agama || '',
          nama_instansi: form.nama_instansi || '',
          alamat_instansi: form.alamat_instansi || '',
          jenis_produk: form.jenis_produk || '',
          masalah_materi: form.masalah_materi || '',
          hal_dipelajari: form.hal_dipelajari || '',
          setuju_syarat: Boolean(form.setuju_syarat),
          ktp_peserta: null,
          foto_peserta: null
        })
        setPreviewKtp(
          form.ktp_peserta ? `${STORAGE_URL}/storage/${form.ktp_peserta}` : null
        )
        setPreviewFoto(
          form.foto_peserta ? `${STORAGE_URL}/storage/${form.foto_peserta}` : null
        )
      } catch (error) {
        console.error(error)
        toast.error("Gagal mengambil data pelatihan")
      }
    }
    fetchDetail()
  }, [id, getDetailPelatihan])
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type } = e.target as HTMLInputElement
    if (type === "file") {
      const fileInput = e.target as HTMLInputElement
      const file = fileInput.files ? fileInput.files[0] : null
      setFormData(prev => ({
        ...prev,
        [name]: file
      }))
      if (file) {
        const url = URL.createObjectURL(file)
        if (name === "ktp_peserta") setPreviewKtp(url)
        if (name === "foto_peserta") setPreviewFoto(url)
      }
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      const { value } = e.target
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!id) {
      toast.error("ID tidak ditemukan")
      return
    }

    await updatePelatihan(id, formData, () => {
      toast.success("Berhasil update pelatihan")
      navigate(-1) // kembali ke halaman sebelumnya (dashboard)
    })

  }, [id, formData, updatePelatihan, navigate])

  return (

    <Form onSubmit={onSubmit}>

      <Row>

        <Col xs={12} className="d-flex flex-column gap-4">

          <div className="border rounded-3 p-3 bg-light d-flex flex-column gap-3">

            <div className="fs-5 fw-bold">Data Peserta</div>

            <Form.Group>
              <Form.Label>Nama Lengkap</Form.Label>
              <Form.Control
                type="text"
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
              />
            </Form.Group>

            <StyledRow>

              <Col lg={4}>
                <Form.Group>
                  <Form.Label>Tempat Lahir</Form.Label>
                  <Form.Control
                    type="text"
                    name="tempat_lahir"
                    value={formData.tempat_lahir}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col lg={4}>
                <Form.Group>
                  <Form.Label>Tanggal Lahir</Form.Label>
                  <Form.Control
                    type="date"
                    name="tanggal_lahir"
                    value={formData.tanggal_lahir}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col lg={4}>
                <Form.Group>
                  <Form.Label>Jenis Kelamin</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Pilih</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </Form.Select>
                </Form.Group>
              </Col>

            </StyledRow>

            <Form.Group>
              <Form.Label>Alamat Peserta</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="alamat_peserta"
                value={formData.alamat_peserta}
                onChange={handleChange}
              />
            </Form.Group>

            <StyledRow>

              <Col lg={4}>
                <Form.Group>
                  <Form.Label>WhatsApp</Form.Label>
                  <Form.Control
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col lg={4}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col lg={4}>
                <Form.Group>
                  <Form.Label>NIK</Form.Label>
                  <Form.Control
                    type="text"
                    name="nik_peserta"
                    value={formData.nik_peserta}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </StyledRow>
            <Form.Group>
              <Form.Label>KTP Peserta</Form.Label>
              <Form.Control type="file" name="ktp_peserta" accept="image/*" onChange={handleChange} />
              {previewKtp && (
                <img src={previewKtp} style={{ width: 200, marginTop: 10, borderRadius: 8 }} />
              )}
            </Form.Group>

            <Form.Group>
              <Form.Label>Foto Peserta</Form.Label>
              <Form.Control type="file" name="foto_peserta" accept="image/*" onChange={handleChange} />
              {previewFoto && (
                <img src={previewFoto} style={{ width: 200, marginTop: 10, borderRadius: 8 }} />
              )}
            </Form.Group>
          </div>

          <div className="border rounded-3 p-3 bg-light d-flex flex-column gap-3">

            <div className="fs-5 fw-bold">Data Instansi</div>

            <Form.Group>
              <Form.Label>Nama Instansi</Form.Label>
              <Form.Control
                type="text"
                name="nama_instansi"
                value={formData.nama_instansi}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Alamat Instansi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="alamat_instansi"
                value={formData.alamat_instansi}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Jenis Produk</Form.Label>
              <Form.Control
                type="text"
                name="jenis_produk"
                value={formData.jenis_produk}
                onChange={handleChange}
              />
            </Form.Group>

          </div>

          <div className="border rounded-3 p-3 bg-light d-flex flex-column gap-3">

            <div className="fs-5 fw-bold">Informasi Pelatihan</div>

            <Form.Group>
              <Form.Label>Permasalahan Materi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="masalah_materi"
                value={formData.masalah_materi}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Hal yang ingin dipelajari</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="hal_dipelajari"
                value={formData.hal_dipelajari}
                onChange={handleChange}
              />
            </Form.Group>

          </div>

          <div className="border rounded-3 p-3 bg-light d-flex flex-column">

            <div className="fs-5 fw-bold">Persetujuan</div>

            <div className="mt-3">

              <ol className="ps-3">
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
                label={
                  <span>
                    Dengan ini saya menyetujui syarat dan ketentuan yang berlaku
                    <span className="text-danger">*</span>
                  </span>
                }
              />

            </div>

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

export default memo(EditFormPelatihan)

