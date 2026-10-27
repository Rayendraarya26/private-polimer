import React from "react"
import {
  Building2,
  Languages,
  Target,
  Mail,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { BahasaLaporan, InspeksiFormData } from "../../../types/inspeksi"
import {
  FormField,
  TextInput,
  TextareaInput,
  RadioCardGroup,
} from "../../forms"

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
    <Card className="border-brand-100 shadow-sm overflow-hidden animate-in fade-in-50 duration-200">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <Target className="w-4 h-4 text-brand-600" />
              2. Tujuan Inspeksi, Bahasa Dokumen & Penerima Hasil
            </CardTitle>
            <CardDescription>
              Tentukan tujuan pelaksanaan inspeksi, bahasa resmi laporan/sertifikat, serta identitas pihak penerima hasil inspeksi
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* 1. Tujuan Inspeksi */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Tujuan Pelaksanaan Inspeksi <span className="text-rose-500">*</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Uraikan maksud dan tujuan permohonan jasa inspeksi ini
              </p>
            </div>
          </div>

          <FormField
            label="Deskripsi Tujuan Permohonan"
            required
            helperText="Contoh: Membuktikan mampu produksi kemasan beras bantuan pangan 10kg untuk tender Perum BULOG"
          >
            <TextareaInput
              rows={3}
              placeholder="Contoh: Membuktikan mampu produksi kemasan beras bantuan pangan 10kg untuk persyaratan tender/pengadaan Perum BULOG..."
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
          </FormField>
        </div>

        {/* 2. Bahasa Laporan Inspeksi */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Bahasa Laporan / Sertifikat Hasil Inspeksi <span className="text-rose-500">*</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Pilih bahasa penerbitan dokumen sertifikat hasil inspeksi
              </p>
            </div>
          </div>

          <RadioCardGroup
            options={[
              {
                value: "indonesia",
                title: "Bahasa Indonesia",
                description:
                  "Format baku Laporan Hasil Inspeksi standar Indonesia sesuai regulasi Kementerian Perindustrian dan Perum BULOG.",
                badge: "Standar Nasional",
                icon: <Languages className="w-4 h-4" />,
              },
              {
                value: "inggris",
                title: "Bahasa Inggris (English)",
                description:
                  "Format Inspection Report berbahasa Inggris untuk rantai pasok ekspor maupun kebutuhan audit internasional.",
                badge: "Internasional",
                icon: <Languages className="w-4 h-4" />,
              },
            ]}
            value={dataPelaksanaan.bahasa_laporan}
            onChange={(val) => handleSelectBahasa(val as BahasaLaporan)}
            gridCols={2}
          />
        </div>

        {/* 3. Hasil Inspeksi Dibuat Untuk */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Hasil Inspeksi Dibuat Untuk
              </h4>
              <p className="text-[11px] text-slate-500">
                Pihak atau instansi yang akan dicantumkan sebagai pemilik/penerima dokumen hasil inspeksi
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <FormField label="Nama Instansi / Lembaga Penerima" required>
              <TextInput
                placeholder="Contoh: Perum BULOG"
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
            </FormField>

            <FormField label="Alamat Lengkap Instansi Penerima">
              <TextareaInput
                rows={2}
                placeholder="Contoh: Jl. Industri Raya Blok C3 No. 12, Kel. Pasir Jaya, Kec. Jatiuwung, Kota Tangerang, Banten"
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
            </FormField>

            <FormField label="Email Instansi Penerima" helperText="Opsional">
              <TextInput
                type="email"
                placeholder="Contoh: pengadaan@bulog.co.id"
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
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
            </FormField>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Step2PenerimaDanTujuan
