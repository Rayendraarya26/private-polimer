import React from "react"
import { Col, Form, Row } from "react-bootstrap"
import styled from "styled-components"
import { toast } from "react-hot-toast"
import { ProfileClientType } from "../../../types/profile"
import { ParticipantLSP } from "../../../types/lsp"
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


// 🔥 helper email validation (tidak ganggu UI)
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)


interface Props {
  formData: ParticipantLSP
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  jenisPelanggan: string | undefined
  detail: any
  pilihanProfil: string
  onPilihanProfilChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  isFieldDisabled: boolean
  fieldNamePrefix: string
}


const FormDataPesertaLSP: React.FC<Props> = ({
  formData, onChange,
  jenisPelanggan, detail, pilihanProfil,
  onPilihanProfilChange, isFieldDisabled
}) => {


  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    label: string
  ) => {
    const file = e.target.files?.[0]


    if (!file) return


    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Ukuran file ${label} maksimal 3 MB`)
      e.target.value = ''
      return
    }


    if (!allowedTypes.includes(file.type)) {
      toast.error(`${label} harus berupa PDF atau gambar`)
      e.target.value = ''
      return
    }


    onChange(e as any)
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
            <Form.Control type="text" name="tempat_lahir" value={formData.tempat_lahir} onChange={onChange} required />
          </Form.Group>
        </Col>


        <Col xs={12} lg={4}>
          <Form.Group>
            <Form.Label>Tanggal Lahir <span className="text-danger">*</span></Form.Label>
            <Form.Control type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={onChange} required />
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
        <Form.Control as="textarea" rows={2} name="alamat_peserta" value={formData.alamat_peserta} onChange={onChange} required />
      </Form.Group>


      <StyledRow>
        <Col xs={12} lg={4}>
          <Form.Group>
            <Form.Label>NIK <span className="text-danger">*</span></Form.Label>
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


        <Col xs={12} lg={4}>
          <Form.Group>
            <Form.Label>
              Kewarganegaraan <span className="text-danger">*</span>
            </Form.Label>


            <Form.Select
              name="kewarganegaraan"
              value={formData.kewarganegaraan}
              onChange={onChange}
              required
            >
              <option value="">Pilih Kewarganegaraan</option>
              <option value="WNI">WNI</option>
              <option value="WNA">WNA</option>
            </Form.Select>
          </Form.Group>
        </Col>


        <Col xs={12} lg={4}>
          <Form.Group>
            <Form.Label>Kode Pos</Form.Label>
            <Form.Control
              type="text"
              name="kode_pos"
              value={formData.kode_pos || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 5)
                onChange({
                  ...e,
                  target: { name: "kode_pos", value }
                } as any)
              }}
              inputMode="numeric"
              maxLength={5}
              placeholder="Masukan kode pos"
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
              placeholder="Masukan email"
              required
            />
          </Form.Group>
        </Col>
      </StyledRow>


      <StyledRow>
        <Col xs={12} lg={6}>
          <Form.Group>
            <Form.Label>Jabatan <span className="text-danger">*</span></Form.Label>
            <Form.Control type="text" name="jabatan" value={formData.jabatan || ''} onChange={onChange} placeholder="Masukan jabatan" required />
          </Form.Group>
        </Col>


        <Col xs={12} lg={6}>
          <Form.Group>
            <Form.Label>Pengalaman Kerja <span className="text-danger">*</span></Form.Label>
            <Form.Control type="text" name="pengalaman_kerja" value={formData.pengalaman_kerja || ''} onChange={onChange} placeholder="Masukan pengalaman kerja" required />
          </Form.Group>
        </Col>
      </StyledRow>


      {/* Upload Dokumen */}
      <div className="border rounded-3 p-3 bg-white d-flex flex-column gap-3">


        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="fw-semibold text-secondary" style={{ fontSize: '0.9rem' }}>
            Upload Dokumen
          </div>
          <div className="text-muted" style={{ fontSize: '0.8rem' }}>
            Format: PDF, JPG, PNG, JPEG • Maks 3 MB
          </div>
        </div>


        <StyledRow>
          <Col xs={12} lg={6}>
            <Form.Group>
              <Form.Label>Upload KTP <span className="text-danger">*</span></Form.Label>
              <Form.Control type="file" name="ktp_peserta" accept=".pdf, image/*" onChange={(e) => handleFileChange(e, 'KTP')} required />
              {formData.ktp_peserta && (
                <div className="mt-2 text-success small">
                  File dipilih: {formData.ktp_peserta.name}
                </div>
              )}
            </Form.Group>
          </Col>


          <Col xs={12} lg={6}>
            <Form.Group>
              <Form.Label>Upload Ijazah <span className="text-danger">*</span></Form.Label>
              <Form.Control type="file" name="ijazah" accept=".pdf, image/*" onChange={(e) => handleFileChange(e, 'Ijazah')} />
              {formData.ijazah && (
              <div className="mt-2 text-success small">
                File dipilih: {formData.ijazah.name}
              </div>
            )}
            </Form.Group>
          </Col>
        </StyledRow>


        <StyledRow>
          <Col xs={12} lg={6}>
            <Form.Group>
              <Form.Label>Upload APL-01 <span className="text-danger">*</span></Form.Label>
              <Form.Control type="file" name="apl_01" accept=".pdf, image/*" onChange={(e) => handleFileChange(e, 'APL-01')} />
              {formData.apl_01 && (
              <div className="mt-2 text-success small">
                File dipilih: {formData.apl_01.name}
              </div>
            )}
            </Form.Group>
          </Col>


          <Col xs={12} lg={6}>
            <Form.Group>
              <Form.Label>Upload APL-02 <span className="text-danger">*</span></Form.Label>
              <Form.Control type="file" name="apl_02" accept=".pdf, image/*" onChange={(e) => handleFileChange(e, 'APL-02')} />
              {formData.apl_02 && (
              <div className="mt-2 text-success small">
                File dipilih: {formData.apl_02.name}
              </div>
            )}
            </Form.Group>
          </Col>
        </StyledRow>


        <Col xs={12} lg={6}>
          <Form.Group>
            <Form.Label>Upload Dokumen Lainnya <span className="text-muted small">(opsional)</span></Form.Label>
            <Form.Control type="file" name="upload_lainya" accept=".pdf, image/*" onChange={(e) => handleFileChange(e, 'Dokumen Lainnya')} />
            {formData.upload_lainya && (
              <div className="mt-2 text-success small">
                File dipilih: {formData.upload_lainya.name}
              </div>
            )}
          </Form.Group>
        </Col>


      </div>
    </div>
  )
}


export default FormDataPesertaLSP

