import React from "react"
import { Col, Form, Row } from "react-bootstrap"
import styled from "styled-components"
import { toast } from "react-hot-toast"
import { ParticipantData } from "../../../types/pelatihan"


const StyledRow = styled(Row)`
  gap: 1rem;
  @media screen and (min-width: 768px) { gap: 0; }
`
const MAX_FILE_SIZE = 3 * 1024 * 1024


interface Props {
  participants: ParticipantData[]
  setParticipants: React.Dispatch<React.SetStateAction<ParticipantData[]>>
}


const KapabilitasPelatihan: React.FC<Props> = ({ participants, setParticipants }) => {


  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newParticipants = [...participants]
    newParticipants[index] = { ...newParticipants[index], [name]: value }
    setParticipants(newParticipants)
  }


  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof ParticipantData,
    label: string
  ) => {
    const file = e.target.files?.[0] ?? null


    if (file && file.size > MAX_FILE_SIZE) {
      toast.error(`Ukuran file ${label} maksimal 3 MB`)
      e.target.value = ''
      return
    }


    const newParticipants = [...participants]
    newParticipants[index] = {
      ...newParticipants[index],
      [fieldName]: file
    }
    setParticipants(newParticipants)
  }


  return (
    <div className="border border-primary rounded-3 p-3 bg-light d-flex flex-column gap-4">


      <div className="d-flex align-items-center gap-2 flex-wrap">
        <div className="fs-5 fw-bold">Data Tambahan Uji Kompetensi (LSP)</div>
        <span className="badge bg-primary" style={{ fontSize: '0.75rem' }}>
          Otomatis didaftarkan ke LSP
        </span>
      </div>


      <div className="text-muted small">
        Data ini wajib diisi untuk masing-masing peserta guna keperluan pendaftaran Uji Kompetensi (LSP).
      </div>


      {participants.map((p, index) => (
        <div key={p.id} className="p-3 border rounded bg-white shadow-sm">


          <h6 className="fw-bold mb-3 text-primary">
            Peserta {index + 1}: {p.nama_lengkap || 'Belum ada nama'}
          </h6>


          <StyledRow className="mb-3">
            <Col xs={12} lg={6}>
              <Form.Group>
                <Form.Label>Kewarganegaraan <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="kewarganegaraan"
                  value={p.kewarganegaraan || ''}
                  onChange={(e) => handleChange(index, e as any)}
                  placeholder="Masukan kewarganegaraan"
                  required
                />
              </Form.Group>
            </Col>


            <Col xs={12} lg={6}>
              <Form.Group>
                <Form.Label>Kode Pos</Form.Label>
                <Form.Control
                  type="text"
                  name="kode_pos"
                  value={p.kode_pos || ''}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, '')
                      .slice(0, 5)


                    handleChange(index, {
                      target: { name: 'kode_pos', value }
                    } as any)
                  }}
                  inputMode="numeric"
                  maxLength={5}
                  placeholder="Masukkan kode pos"
                  required
                />
              </Form.Group>
            </Col>
          </StyledRow>


          <StyledRow className="mb-3">
            <Col xs={12} lg={6}>
              <Form.Group>
                <Form.Label>Jabatan <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="jabatan"
                  value={p.jabatan || ''}
                  onChange={(e) => handleChange(index, e as any)}
                  placeholder="Masukan jabatan"
                  required
                />
              </Form.Group>
            </Col>


            <Col xs={12} lg={6}>
              <Form.Group>
                <Form.Label>Pengalaman Kerja <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="pengalaman_kerja"
                  value={p.pengalaman_kerja || ''}
                  onChange={(e) => handleChange(index, e as any)}
                  placeholder="Masukan pengalaman kerja"
                  required
                />
              </Form.Group>
            </Col>
          </StyledRow>


          <StyledRow>
            <Col xs={12} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label>Upload Ijazah <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf, image/*"
                  onChange={(e) =>
                    handleFileChange(index, e as any, 'ijazah', 'Ijazah')
                  }
                  required
                />
              </Form.Group>
            </Col>


            <Col xs={12} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label>Upload APL-01</Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf, image/*"
                  onChange={(e) =>
                    handleFileChange(index, e as any, 'apl_01', 'APL-01')
                  }
                />
              </Form.Group>
            </Col>


            <Col xs={12} lg={6}>
              <Form.Group>
                <Form.Label>Upload APL-02</Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf, image/*"
                  onChange={(e) =>
                    handleFileChange(index, e as any, 'apl_02', 'APL-02')
                  }
                />
              </Form.Group>
            </Col>


            <Col xs={12} lg={6}>
              <Form.Group>
                <Form.Label>Dokumen Lainnya</Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf, image/*"
                  onChange={(e) =>
                    handleFileChange(index, e as any, 'upload_lainya', 'Dokumen Lainnya')
                  }
                />
              </Form.Group>
            </Col>
          </StyledRow>


        </div>
      ))}
    </div>
  )
}


export default KapabilitasPelatihan

