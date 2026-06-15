import React from "react"
import { Button, Form } from "react-bootstrap"
import { SharedData, ParticipantData } from "../../../types/pelatihan"
import { ProfileClientType } from "../../../types/profile"
import KapabilitasPelatihan from "./KapabilitasPelatihan"

interface Props {
  sharedData: SharedData
  setSharedData: React.Dispatch<React.SetStateAction<SharedData>>
  participants: ParticipantData[]                                      // Ditambahkan
  setParticipants: React.Dispatch<React.SetStateAction<ParticipantData[]>> // Ditambahkan
  jenisPelanggan: string | undefined
  detail: any
  participantCount: number
  submitting: boolean
  kapabilitas: any
  onBack: () => void
  onSubmit: (aksi: 'draft' | 'ajukan') => void
}

const StepDataBersama: React.FC<Props> = ({
  sharedData, setSharedData, participants, setParticipants, jenisPelanggan,
  participantCount, submitting, kapabilitas, onBack, onSubmit
}) => {
  const showLSPForm = kapabilitas === 1 && sharedData.program === "Pelatihan dan Uji Kompetensi" 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setSharedData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setSharedData(prev => ({ ...prev, [name]: value }))
    }
  }
  return (
    <div className="d-flex flex-column gap-4">
      {/* DATA INSTANSI */}
      <div className="border rounded-3 p-3 bg-light d-flex flex-column gap-3">
        <div className="fs-5 fw-bold">
          Data {jenisPelanggan === ProfileClientType.PERORANGAN ? 'Unit Usaha' : jenisPelanggan}
        </div>
        <Form.Group>
          <Form.Label>Nama {jenisPelanggan === ProfileClientType.PERORANGAN ? 'Usaha' : 'Instansi'} <span className="text-danger">*</span></Form.Label>
          <Form.Control type="text" name="nama_instansi" value={sharedData.nama_instansi} onChange={handleChange} placeholder="Masukan nama usaha" required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Alamat <span className="text-danger">*</span></Form.Label>
          <Form.Control as="textarea" rows={3} name="alamat_instansi" value={sharedData.alamat_instansi} onChange={handleChange} placeholder="Masukan alamat lengkap" required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Jenis Produk <span className="text-danger">*</span></Form.Label>
          <Form.Control type="text" name="jenis_produk" value={sharedData.jenis_produk} onChange={handleChange} placeholder="Masukan jenis produk" required />
        </Form.Group>
      </div>
      {/* INFORMASI PELATIHAN */}
      <div className="border rounded-3 p-3 bg-light d-flex flex-column gap-3">
        <div className="fs-5 fw-bold">Informasi Pelatihan</div>
        <Form.Group>
          <Form.Label>Permasalahan Terkait Materi <span className="text-danger">*</span></Form.Label>
          <Form.Control as="textarea" rows={3} name="masalah_materi" value={sharedData.masalah_materi} onChange={handleChange} placeholder="Masukan permasalahan yang timbul terkait materi" required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Hal yang Ingin Dipelajari <span className="text-danger">*</span></Form.Label>
          <Form.Control as="textarea" rows={3} name="hal_dipelajari" value={sharedData.hal_dipelajari} onChange={handleChange} placeholder="Masukan hal yang ingin anda pelajari" required />
        </Form.Group>
      </div>
      {/* PROGRAM */}
      <div className="border rounded-3 p-3 bg-light d-flex flex-column gap-3">
        <div className="fs-5 fw-bold">Program yang akan diikuti</div>
        <Form.Check type="radio" label="Pelatihan" name="program" value="Pelatihan" checked={sharedData.program === "Pelatihan"} onChange={handleChange} required />
        {kapabilitas === 1 && (
          <Form.Check type="radio" label="Pelatihan dan Uji Kompetensi" name="program" value="Pelatihan dan Uji Kompetensi" checked={sharedData.program === "Pelatihan dan Uji Kompetensi"} onChange={handleChange} />
        )}
      </div>
      {/* FORM TAMBAHAN LSP */}
      {showLSPForm && (
        <KapabilitasPelatihan participants={participants} setParticipants={setParticipants} />
      )}
      <div className="border rounded-3 p-3 bg-light d-flex flex-column">
        <div className="fs-5 fw-bold">Persetujuan</div>
        <div className="mt-3">
          <ol className="ps-3">
            <li>Saya akan mengikuti pelatihan sampai akhir.</li>
            <li>Saya menyetujui pembayaran biaya pelatihan.</li>
          </ol>
          <Form.Check className="mt-3 fw-semibold" type="checkbox" name="setuju_syarat" checked={sharedData.setuju_syarat} onChange={handleChange} required label={<>Dengan ini saya menyetujui syarat <span className="text-danger">*</span></>} />
        </div>
      </div>
      {participantCount > 1 && (
        <div className= "border rounded-3 p-3 bg-light d-flex flex-column gap-3">
          <div className="fs-5 fw-bold">Metode Pembayaran</div>
          <div className="text-muted small">
            Anda mendaftarkan <strong>{participantCount} peserta</strong>. Pilih cara pembayaran:
          </div>
          <Form.Check
            type="radio"
            id="billing_together"
            label={`Gabung Tagihan (1 invoice untuk ${participantCount} peserta)`}
            name="billing_type"
            value="together"
            checked={sharedData.billing_type === "together"}
            onChange={handleChange}
          />
          <Form.Check
            type="radio"
            id="billing_split"
            label="Split Bill (masing-masing peserta invoice sendiri)"
            name="billing_type"
            value="split"
            checked={sharedData.billing_type === "split"}
            onChange={handleChange}
          />

          {sharedData.billing_type === 'split' ? (
            <div className="alert alert-info py-2 mb-0 small">
              Setiap peserta mendapat tagihan sendiri.
            </div>
          ) : (
            <div className="alert alert-success py-2 mb-0 small">
              Satu tagihan mencakup semua {participantCount} peserta.
            </div>
          )}
        </div>
      )}

      {/* NAVIGASI */}
      <div className="d-flex justify-content-between mt-2">
        <Button variant="outline-secondary" onClick={onBack} disabled={submitting}>&larr; Kembali</Button>
        <div className="d-flex gap-2">
          <Button variant="secondary" disabled={submitting} onClick={() => onSubmit("draft")}>Simpan Draft</Button>
          <Button variant="primary" disabled={submitting} onClick={() => onSubmit("ajukan")}>
            {submitting ? "Mengirim..." : participantCount > 1 ? `Ajukan (${participantCount} Peserta)` : "Simpan & Ajukan"}
          </Button>
        </div>
      </div>
    </div>
  )
}
export default StepDataBersama


