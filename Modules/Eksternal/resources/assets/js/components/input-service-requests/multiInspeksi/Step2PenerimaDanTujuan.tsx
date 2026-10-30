import React from "react"
import {
  Building2,
  Languages,
  Target,
} from "lucide-react"
import { BahasaLaporan, InspeksiFormData } from "../../../types/inspeksi"
import {
  StepPanel,
  SectionHeading,
  FieldLabel,
  FieldHint,
  OptionCard,
  OptionGroup,
  OptionIcon,
  inputClass,
  textareaClass,
} from "../common"

interface Step2PenerimaDanTujuanProps {
  formData: InspeksiFormData
  setFormData: React.Dispatch<React.SetStateAction<InspeksiFormData>>
}

export const Step2PenerimaDanTujuan: React.FC<Step2PenerimaDanTujuanProps> = ({
  formData,
  setFormData,
}) => {
  const { dataPermohonan, dataPelaksanaan, dataPenerima } = formData

  const handleSelectBahasa = (lang: BahasaLaporan) => {
    setFormData((prev) => ({
      ...prev,
      dataPelaksanaan: {
        ...prev.dataPelaksanaan,
        bahasa_laporan: lang,
      },
    }))
  }

  return (
    <StepPanel
      icon={Target}
      title="Tujuan Inspeksi, Bahasa Dokumen & Penerima Hasil"
      description="Tentukan tujuan pelaksanaan inspeksi, bahasa dokumen sertifikat, serta identitas pihak penerima hasil inspeksi."
    >
      {/* 1. Tujuan Pelaksanaan Inspeksi */}
      <div>
        <SectionHeading
          title="Tujuan Pelaksanaan Inspeksi"
          description="Uraikan maksud dan tujuan permohonan jasa inspeksi ini untuk verifikasi teknis."
          required
        />

        <div>
          <FieldLabel htmlFor="tujuan_inspeksi" required>
            Deskripsi Tujuan Permohonan
          </FieldLabel>
          <textarea
            id="tujuan_inspeksi"
            rows={3}
            placeholder="Contoh: Membuktikan mampu produksi kemasan karung beras bantuan pangan 10kg untuk persyaratan tender/pengadaan Perum BULOG..."
            className={textareaClass}
            value={dataPermohonan.tujuan_inspeksi}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                dataPermohonan: {
                  ...prev.dataPermohonan,
                  tujuan_inspeksi: e.target.value,
                },
              }))
            }
          />
          <FieldHint>
            Sebutkan secara spesifik kebutuhan inspeksi (misal: pengadaan BULOG, verifikasi mutu internal, tender, dll.)
          </FieldHint>
        </div>
      </div>

      {/* 2. Bahasa Laporan Inspeksi */}
      <div className="pt-6 border-t border-slate-200">
        <SectionHeading
          title="Bahasa Laporan / Sertifikat Hasil Inspeksi"
          description="Pilih bahasa resmi dokumen sertifikat hasil inspeksi yang akan diterbitkan."
          required
        />

        <OptionGroup label="Pilihan Bahasa Laporan" cols={2}>
          <OptionCard
            selected={dataPelaksanaan.bahasa_laporan === "indonesia"}
            onSelect={() => handleSelectBahasa("indonesia")}
            title="Bahasa Indonesia"
            badge="Standar Nasional"
            description="Format baku Laporan Hasil Inspeksi standar Indonesia sesuai regulasi Kementerian Perindustrian dan Perum BULOG."
            leading={
              <OptionIcon
                icon={Languages}
                active={dataPelaksanaan.bahasa_laporan === "indonesia"}
              />
            }
          />

          <OptionCard
            selected={dataPelaksanaan.bahasa_laporan === "inggris"}
            onSelect={() => handleSelectBahasa("inggris")}
            title="Bahasa Inggris (English)"
            badge="Internasional"
            description="Format Inspection Report berbahasa Inggris untuk rantai pasok ekspor maupun kebutuhan audit internasional."
            leading={
              <OptionIcon
                icon={Languages}
                active={dataPelaksanaan.bahasa_laporan === "inggris"}
              />
            }
          />
        </OptionGroup>
      </div>

      {/* 3. Hasil Inspeksi Dibuat Untuk */}
      <div className="pt-6 border-t border-slate-200">
        <SectionHeading
          title="Hasil Inspeksi Dibuat Untuk"
          description="Pihak atau instansi yang akan dicantumkan sebagai pemilik/penerima dokumen hasil inspeksi."
          required
        />

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="penerima_hasil_nama" required>
                Nama Instansi / Lembaga Penerima
              </FieldLabel>
              <input
                id="penerima_hasil_nama"
                type="text"
                placeholder="Contoh: Perum BULOG"
                className={inputClass}
                value={dataPenerima.penerima_hasil_nama}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataPenerima: {
                      ...prev.dataPenerima,
                      penerima_hasil_nama: e.target.value,
                    },
                  }))
                }
              />
              <FieldHint>Nama pihak ketiga atau instansi yang dituju oleh laporan inspeksi</FieldHint>
            </div>

            <div>
              <FieldLabel htmlFor="penerima_hasil_email" optional>
                Email Instansi Penerima
              </FieldLabel>
              <input
                id="penerima_hasil_email"
                type="email"
                placeholder="Contoh: pengadaan@bulog.co.id"
                className={inputClass}
                value={dataPenerima.penerima_hasil_email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataPenerima: {
                      ...prev.dataPenerima,
                      penerima_hasil_email: e.target.value,
                    },
                  }))
                }
              />
              <FieldHint>Email resmi tembusan dokumen jika diperlukan</FieldHint>
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="penerima_hasil_alamat" optional>
              Alamat Lengkap Instansi Penerima
            </FieldLabel>
            <textarea
              id="penerima_hasil_alamat"
              rows={2}
              placeholder="Contoh: Jl. Jenderal Gatot Subroto Kav. 49, Jakarta Selatan, DKI Jakarta 12950"
              className={textareaClass}
              value={dataPenerima.penerima_hasil_alamat}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dataPenerima: {
                    ...prev.dataPenerima,
                    penerima_hasil_alamat: e.target.value,
                  },
                }))
              }
            />
            <FieldHint>Alamat kantor pusat atau gudang instansi penerima</FieldHint>
          </div>
        </div>
      </div>
    </StepPanel>
  )
}

export default Step2PenerimaDanTujuan
