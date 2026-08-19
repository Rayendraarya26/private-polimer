import React from "react"
import { SertifikasiFormData } from "../../../../types/sertifikasi"
import { Card, CardContent } from "../../../ui/Card"
import { Building2, Mail, Phone, UserCheck, ShieldCheck } from "lucide-react"

interface Props {
  formData: SertifikasiFormData
  setFormData: React.Dispatch<React.SetStateAction<SertifikasiFormData>>
  onNext: () => void
}

const TIPE_PENGAJUAN_OPTIONS = [
  { value: "BARU", label: "Sertifikasi Baru", desc: "Pengajuan awal sertifikasi produk/sistem baru" },
  { value: "PERPANJANG", label: "Perpanjangan (Resertifikasi)", desc: "Perpanjangan sertifikat yang akan/telah habis masa berlaku" },
  { value: "PERUBAHAN", label: "Perluasan / Perubahan Lingkup", desc: "Penambahan tipe/merk atau perubahan lokasi pabrik" },
  { value: "SURVEILANS", label: "Surveilans Berkala", desc: "Audit pengawasan tahunan berkala" },
]

export const StepDataPerusahaan: React.FC<Props> = ({ formData, setFormData, onNext }) => {
  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 shadow-xs">
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              1. Tipe Pengajuan Sertifikasi
            </h3>
            <p className="text-xs text-slate-500 mt-1">Pilih kategori permohonan sertifikasi yang ingin Anda ajukan.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TIPE_PENGAJUAN_OPTIONS.map((opt) => {
              const isSelected = formData.tipe_pengajuan === opt.value
              return (
                <div
                  key={opt.value}
                  onClick={() => setFormData((prev) => ({ ...prev, tipe_pengajuan: opt.value as any }))}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-brand-50/70 border-brand-500 ring-2 ring-brand-500/20"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{opt.label}</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? "border-brand-600 bg-brand-600" : "border-slate-300"
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{opt.desc}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 shadow-xs">
        <CardContent className="p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              2. Profil Perusahaan Pemohon
            </h3>
            <p className="text-xs text-slate-500 mt-1">Informasi legal dan kontak resmi kantor pemohon.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Perusahaan / Badan Usaha <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nama_perusahaan}
                onChange={(e) => setFormData((prev) => ({ ...prev, nama_perusahaan: e.target.value }))}
                placeholder="Contoh: PT Industri Polimer Indonesia"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Kantor Pusat <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={formData.alamat_kantor}
                onChange={(e) => setFormData((prev) => ({ ...prev, alamat_kantor: e.target.value }))}
                placeholder="Alamat lengkap sesuai domisili legal NIB..."
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Penanggung Jawab / Kontak Person
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.kontak_person}
                  onChange={(e) => setFormData((prev) => ({ ...prev, kontak_person: e.target.value }))}
                  placeholder="Nama lengkap PIC"
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Resmi Perusahaan <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="corporate@perusahaan.com"
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telepon Kantor</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.no_telp}
                  onChange={(e) => setFormData((prev) => ({ ...prev, no_telp: e.target.value }))}
                  placeholder="021-xxxxxxx"
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No. WhatsApp PIC (Aktif) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.no_whatsapp}
                  onChange={(e) => setFormData((prev) => ({ ...prev, no_whatsapp: e.target.value }))}
                  placeholder="08xxxxxxxxxx"
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                <Phone className="w-4 h-4 text-emerald-500 absolute left-3 top-3" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-600/20 transition-all"
        >
          Lanjut ke Data Pabrik &rarr;
        </button>
      </div>
    </div>
  )
}

export default StepDataPerusahaan
