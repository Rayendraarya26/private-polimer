import React from "react"
import { Col, Form, Row } from "react-bootstrap"
import styled from "styled-components"
import { toast } from "react-hot-toast"
import { ProfileClientType } from "../../../types/profile"
import { ParticipantData } from "../../../types/pelatihan"
import PhoneInputWithCountrySelect from "react-phone-number-input"
import 'react-phone-number-input/style.css'


const StyledRow = styled(Row)`
  gap: 1rem;
  @media screen and (min-width: 768px) { gap: 0; }
`


const MAX_FILE_SIZE = 3 * 1024 * 1024


const allowedTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg'
]


interface Props {
  formData: ParticipantData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onFieldChange: (name: string, value: any) => void
  jenisPelanggan: string | undefined
  detail: any
  pilihanProfil: string
  onPilihanProfilChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  isFieldDisabled: boolean
  fieldNamePrefix: string
}


const FormDataPeserta: React.FC<Props> = ({
  formData, onChange, onFieldChange,
  jenisPelanggan, detail, pilihanProfil,
  onPilihanProfilChange, isFieldDisabled, fieldNamePrefix,
}) => {


  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    label: string
  ) => {
    const file = e.target.files?.[0] ?? null


    if (!file) return


    // validasi size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Ukuran file ${label} maksimal 3 MB`)
      e.target.value = ''
      return
    }


    // validasi type
    if (!allowedTypes.includes(file.type)) {
      toast.error(`${label} harus berupa PDF atau gambar`)
      e.target.value = ''
      return
    }


    // set ke state
    onFieldChange(fieldName, file)
  }


  return (
    <div className="border rounded-3 p-3 bg-light d-flex flex-column gap-3">
      <div className="fs-5 fw-bold">Data Peserta</div>


      {jenisPelanggan !== ProfileClientType.PERORANGAN && (
        <Form.Group>
          <Form.Label>Peserta yang didaftarkan <span className="text-danger">*</span></Form.Label>
          <Form.Select value={pilihanProfil} onChange={onPilihanProfilChange} required>
            <option value="Manual">Isi Manual (Pegawai/Perwakilan)</option>
            <option value="pimpinan">Pimpinan ({detail?.pimpinan || 'Data Kosong'})</option>
            <option value="penanggung_jawab">Penanggung Jawab ({detail?.pj_nama || 'Data Kosong'})</option>
          </Form.Select>
        </Form.Group>
      )}


      <Form.Group>
        <Form.Label>Nama Lengkap <span className="text-danger">*</span></Form.Label>
        <Form.Control
          type="text"
          name="nama_lengkap"
          value={formData.nama_lengkap}
          onChange={onChange}
          disabled={isFieldDisabled}
          placeholder="Masukkan nama lengkap"
          required
        />
      </Form.Group>


      <StyledRow>
        <Col xs={12} lg={4}>
          <Form.Group>
            <Form.Label>Tempat Lahir <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="tempat_lahir"
              value={formData.tempat_lahir}
              onChange={onChange}
              placeholder="Masukkan tempat lahir"
              required
            />
          </Form.Group>
        </Col>


        <Col xs={12} lg={4}>
          <Form.Group>
            <Form.Label>Tanggal Lahir <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="date"
              name="tanggal_lahir"
              value={formData.tanggal_lahir}
              onChange={onChange}
              required
            />
          </Form.Group>
        </Col>


        <Col xs={12} lg={4}>
          <Form.Group>
            <Form.Label>Jenis Kelamin <span className="text-danger">*</span></Form.Label>
            <Form.Select name="gender" value={formData.gender} onChange={onChange} required>
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </StyledRow>


      <Form.Group>
        <Form.Label>Alamat Peserta <span className="text-danger">*</span></Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="alamat_peserta"
          value={formData.alamat_peserta}
          onChange={onChange}
          placeholder="Masukkan alamat lengkap"
          required
        />
      </Form.Group>


      <StyledRow>
        <Col xs={12} lg={4}>
          <Form.Group>
            <Form.Label>
              Nomor WhatsApp <span className="text-danger">*</span>
            </Form.Label>


            <PhoneInputWithCountrySelect
              defaultCountry="ID"
              placeholder="Masukkan nomor WhatsApp"
              className="align-items-stretch"
              value={formData.whatsapp || ''}
              onChange={(value) => {
                onChange({
                  target: {
                    name: "whatsapp",
                    value: value || ''
                  }
                } as any)
              }}
              disabled={isFieldDisabled}
            />


            <div style={{ fontSize: '0.65rem' }}>
              Pilih negara dan masukkan nomor anda. Contoh: Indonesia, 8123456789
            </div>
          </Form.Group>
        </Col>


        <Col xs={12} lg={4}>
          <Form.Group>
            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              disabled={isFieldDisabled}
              placeholder="Masukkan Email"
              required
            />
          </Form.Group>
        </Col>


        <Col xs={12} lg={4}>
          <Form.Group>
            <Form.Label>Nomor KTP / NIK <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="nik_peserta"
              value={formData.nik_peserta || ''}
              onChange={(e) => {
                const value = e.target.value
                  .replace(/\D/g, "") // hanya angka
                  .slice(0, 16) // maksimal 16 digit

                onChange({
                  ...e,
                  target: {
                    name: "nik_peserta",
                    value
                  }
                } as any)
              }}
              inputMode="numeric"
              maxLength={16}
              placeholder="Masukan 16 digit No KTP / NIK"
              required
            />
          </Form.Group>
        </Col>
      </StyledRow>


      <StyledRow>
        <Col xs={12} lg={4}>
          <Form.Group>
            <Form.Label>Pendidikan Terakhir <span className="text-danger">*</span></Form.Label>
            <Form.Select name="pendidikan" value={formData.pendidikan} onChange={onChange} required>
              <option value="">Pilih Pendidikan</option>
              <option value="S3">S3</option>
              <option value="S2">S2</option>
              <option value="S1">S1</option>
              <option value="D3">D3</option>
              <option value="D1 / SMA / SMK">D1 / SMA / SMK</option>
              <option value="Lainnya">Lainnya</option>
            </Form.Select>
          </Form.Group>
        </Col>


        <Col xs={12} lg={4}>
          <Form.Group>
            <Form.Label>Agama <span className="text-danger">*</span></Form.Label>
            <Form.Select
              name={`agama_${fieldNamePrefix}`}
              value={formData.agama || ""}
              onChange={(e) => onFieldChange("agama", e.target.value)}
              required
            >
              <option value="">Pilih Agama</option>
              <option value="Islam">Islam</option>
              <option value="Kristen">Kristen</option>
              <option value="Katolik">Katolik</option>
              <option value="Hindu">Hindu</option>
              <option value="Buddha">Buddha</option>
              <option value="Konghucu">Konghucu</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </StyledRow>


      <StyledRow>
        <Col xs={12} lg={6}>
          <Form.Group>
            <Form.Label>Upload KTP (maks. 3 MB) <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="file"
              accept=".pdf, image/*"
              onChange={(e) => handleFileChange(e, 'ktp_peserta', 'KTP')}
              required
            />
            {formData.ktp_peserta && (
              <div className="mt-2 text-success small">
                File dipilih: {formData.ktp_peserta.name}
              </div>
            )}
          </Form.Group>
        </Col>


        <Col xs={12} lg={6}>
          <Form.Group>
            <Form.Label>Upload Foto 3x4 (maks. 3 MB) <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'foto_peserta', 'Foto 3x4')}
              required
            />
            {formData.foto_peserta && (
              <div className="mt-2 text-success small">
                File dipilih: {formData.foto_peserta.name}
              </div>
            )}
          </Form.Group>
        </Col>
      </StyledRow>


    </div>
  )
}


export default FormDataPeserta

