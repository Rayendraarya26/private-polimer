import React from "react"
import { Button, Form } from "react-bootstrap"
import { SharedDataLSP } from "../../../types/lsp"
import { ProfileClientType } from "../../../types/profile"

interface Props {
  sharedData: SharedDataLSP
  setSharedData: React.Dispatch<React.SetStateAction<SharedDataLSP>>
  jenisPelanggan: string | undefined
  participantCount: number
  submitting: boolean
  onBack: () => void
  onSubmit: (aksi: 'draft' | 'ajukan') => void
}

const StepDataBersamaLSP: React.FC<Props> = ({
  sharedData, setSharedData, jenisPelanggan,
  participantCount, submitting, onBack, onSubmit,
}) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          <Form.Label>
            {jenisPelanggan === ProfileClientType.PERORANGAN ? 'Nama Usaha' :
              jenisPelanggan === ProfileClientType.INSTANSI_PEMERINTAH ? 'Nama Instansi' : 'Nama Perusahaan'}
            <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text" name="nama_instansi" value={sharedData.nama_instansi}
            onChange={handleChange} placeholder="Masukan nama usaha" required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Alamat <span className="text-danger">*</span></Form.Label>
          <Form.Control
            as="textarea" rows={3} name="alamat_instansi"
            value={sharedData.alamat_instansi} onChange={handleChange}
            placeholder="Masukan alamat lengkap" required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Jenis Bidang Industri <span className="text-danger">*</span></Form.Label>
          <Form.Control
            type="text" name="jenis_produk" value={sharedData.jenis_produk}
            onChange={handleChange} placeholder="Masukan bidang industri" required
          />
        </Form.Group>
      </div>

      {/* ✅ METODE PEMBAYARAN — hanya tampil jika peserta > 1 */}
      {participantCount > 1 && (
        <div className="border rounded-3 p-3 bg-light d-flex flex-column gap-3">
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
              Setiap peserta mendapat nomor permohonan dan tagihan sendiri.
            </div>
          ) : (
            <div className="alert alert-success py-2 mb-0 small">
              Satu tagihan mencakup semua {participantCount} peserta.
            </div>
          )}
        </div>
      )}

      {/* PERSETUJUAN */}
      <div className="border rounded-3 p-3 bg-light d-flex flex-column">
        <div className="fs-5 fw-bold">Persetujuan</div>
        <div className="mt-3">
          <ol className="ps-3">
            <li>Mengikuti pelatihan sampai akhir.</li>
            <li>Menyelesaikan tugas dari instruktur.</li>
            <li>Membayar biaya pelatihan tepat waktu.</li>
          </ol>
          <Form.Check
            className="mt-3 fw-semibold"
            type="checkbox" name="setuju_syarat"
            checked={sharedData.setuju_syarat} onChange={handleChange} required
            label={
              <span>
                Dengan ini saya menyetujui syarat dan ketentuan yang berlaku
                <span className="text-danger">*</span>
              </span>
            }
          />
        </div>
      </div>

      {/* NAVIGASI */}
      <div className="d-flex justify-content-between mt-2">
        <Button variant="outline-secondary" onClick={onBack} disabled={submitting}>
          ← Kembali
        </Button>
        <div className="d-flex gap-2">
          <Button variant="secondary" disabled={submitting} onClick={() => onSubmit("draft")}>
            Simpan Draft
          </Button>
          <Button type="button" disabled={submitting} onClick={() => onSubmit("ajukan")}>
            {submitting
              ? "Mengirim..."
              : participantCount > 1
                ? `Simpan & Ajukan (${participantCount} Peserta)`
                : "Simpan & Ajukan"
            }
          </Button>
        </div>
      </div>

    </div>
  )
}

export default StepDataBersamaLSP