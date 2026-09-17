import React, { useEffect } from "react"
import {
  FileText,
  Calendar,
  Building2,
  Send,
  User,
  ArrowRight,
  ArrowLeft,
  CheckSquare,
  Square,
  Sparkles,
} from "lucide-react"
import { toast } from "react-hot-toast"
import { PengujianSharedData } from "../../../types/pengujian"
import { Input } from "../../ui/Input"
import { Button } from "../../ui/Button"
import useProfile from "../../../hooks/useProfile"

interface Step2DataPermintaanProps {
  sharedData: PengujianSharedData
  setSharedData: React.Dispatch<React.SetStateAction<PengujianSharedData>>
  onNext: () => void
  onBack: () => void
}

export const Step2DataPermintaan: React.FC<Step2DataPermintaanProps> = ({
  sharedData,
  setSharedData,
  onNext,
  onBack,
}) => {
  const { profile } = useProfile()

  // Ambil nama identitas pemohon dari profil yang login
  const applicantName =
    profile?.detail?.nama ||
    (profile as any)?.company_name ||
    profile?.name ||
    "Pemohon / Klien"

  // Autofill data profil pemohon saat pertama kali dimuat
  useEffect(() => {
    if (!profile) return

    setSharedData((prev) => {
      const companyOrPerson =
        profile.detail?.nama ||
        (profile as any)?.company_name ||
        profile.name ||
        ""

      return {
        ...prev,
        diajukan_oleh: prev.diajukan_oleh || companyOrPerson,
        biaya_ditanggung_oleh: prev.biaya_sama_dengan_pemohon
          ? companyOrPerson
          : prev.biaya_ditanggung_oleh,
        laporan_dialamatkan_kepada: prev.alamat_sama_dengan_pemohon
          ? companyOrPerson
            ? `Up. Pimpinan / Bagian QC - ${companyOrPerson}`
            : ""
          : prev.laporan_dialamatkan_kepada,
      }
    })
  }, [profile, setSharedData])

  const handleValidateAndNext = () => {
    const finalBiaya = sharedData.biaya_sama_dengan_pemohon
      ? applicantName
      : sharedData.biaya_ditanggung_oleh.trim()

    const finalAlamat = sharedData.alamat_sama_dengan_pemohon
      ? `Up. Pimpinan / Bagian QC - ${applicantName}`
      : sharedData.laporan_dialamatkan_kepada.trim()

    if (!finalBiaya) {
      toast.error("Kolom 'Biaya Pengujian Ditanggung Oleh' wajib diisi")
      return
    }

    if (!finalAlamat) {
      toast.error("Kolom 'Laporan Pengujian Dialamatkan Kepada' wajib diisi")
      return
    }

    // Pastikan nilai terisi sebelum lanjut
    setSharedData((prev) => ({
      ...prev,
      diajukan_oleh: prev.diajukan_oleh || applicantName,
      biaya_ditanggung_oleh: finalBiaya,
      laporan_dialamatkan_kepada: finalAlamat,
    }))

    onNext()
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Tahap 2: Data Permintaan & Administrasi
            </h2>
            <p className="text-xs text-slate-500">
              Konfirmasi data pemohon, penanggung jawab pembiayaan pengujian, dan tujuan pengiriman laporan.
            </p>
          </div>
        </div>
      </div>

      {/* Main Card: Data Permintaan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Tanggal Permohonan (Auto-lock / Readonly) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Tanggal Permohonan <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="text"
                readOnly
                value={sharedData.tanggal_permohonan}
                className="w-full bg-slate-50 text-slate-600 text-xs rounded-lg border border-slate-200 pl-10 pr-3.5 py-2.5 cursor-not-allowed font-medium"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Tercatat otomatis sesuai tanggal akses sistem balai</p>
          </div>

          {/* Permintaan Pengujian Diajukan Kepada BBKKP Oleh */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Diajukan Kepada BBSPJIKKP Oleh <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={sharedData.diajukan_oleh || applicantName}
                onChange={(e) =>
                  setSharedData((prev) => ({
                    ...prev,
                    diajukan_oleh: e.target.value,
                  }))
                }
                className="w-full bg-white text-slate-900 text-xs rounded-lg border border-slate-300 pl-10 pr-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                placeholder="Nama Pemohon / Perusahaan"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Nama pemohon terdaftar di portal BBSPJIKKP</p>
          </div>
        </div>

        {/* Biaya Pengujian Ditanggung Oleh */}
        <div className="p-4.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="text-xs font-bold text-slate-800 block">
                Biaya Pengujian Ditanggung Oleh <span className="text-rose-500">*</span>
              </label>
              <p className="text-[11px] text-slate-500">
                Pihak atau badan usaha yang bertanggung jawab atas pelunasan tarif pengujian.
              </p>
            </div>

            {/* Checkbox Relasi Pihak */}
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-brand-700 bg-brand-50/70 px-3 py-1.5 rounded-lg border border-brand-200/80 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sharedData.biaya_sama_dengan_pemohon}
                onChange={(e) => {
                  const checked = e.target.checked
                  setSharedData((prev) => ({
                    ...prev,
                    biaya_sama_dengan_pemohon: checked,
                    biaya_ditanggung_oleh: checked ? applicantName : "",
                  }))
                }}
                className="w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
              />
              <span>Sama dengan pemohon / instansi sendiri</span>
            </label>
          </div>

          {/* Form Input Dinamis (Muncul bila Checkbox Tidak Dicentang) */}
          {!sharedData.biaya_sama_dengan_pemohon ? (
            <div className="pt-1 animate-in fade-in-50 duration-200">
              <Input
                label="Nama Penanggung Jawab Biaya (Pihak Ketiga / Instansi Lain)"
                required
                leftIcon={<Building2 className="w-4 h-4" />}
                placeholder="Masukkan nama perusahaan / sponsor penanggung jawab biaya..."
                value={sharedData.biaya_ditanggung_oleh}
                onChange={(e) =>
                  setSharedData((prev) => ({
                    ...prev,
                    biaya_ditanggung_oleh: e.target.value,
                  }))
                }
              />
            </div>
          ) : (
            <div className="text-xs text-slate-600 bg-white/80 p-2.5 rounded-lg border border-slate-200 font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-600 shrink-0" />
              <span>
                Penanggung jawab biaya: <strong className="text-slate-900">{applicantName}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Laporan Pengujian Minta Dialamatkan Kepada */}
        <div className="p-4.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="text-xs font-bold text-slate-800 block">
                Laporan Pengujian Minta Dialamatkan Kepada <span className="text-rose-500">*</span>
              </label>
              <p className="text-[11px] text-slate-500">
                Nama pejabat, divisi teknis, atau alamat tujuan pengiriman fisik/dokumen LHU.
              </p>
            </div>

            {/* Checkbox Relasi Pihak */}
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-brand-700 bg-brand-50/70 px-3 py-1.5 rounded-lg border border-brand-200/80 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sharedData.alamat_sama_dengan_pemohon}
                onChange={(e) => {
                  const checked = e.target.checked
                  setSharedData((prev) => ({
                    ...prev,
                    alamat_sama_dengan_pemohon: checked,
                    laporan_dialamatkan_kepada: checked
                      ? `Up. Pimpinan / Bagian QC - ${applicantName}`
                      : "",
                  }))
                }}
                className="w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
              />
              <span>Sama dengan pemohon / instansi sendiri</span>
            </label>
          </div>

          {/* Form Input Dinamis (Muncul bila Checkbox Tidak Dicentang) */}
          {!sharedData.alamat_sama_dengan_pemohon ? (
            <div className="pt-1 animate-in fade-in-50 duration-200">
              <Input
                label="Nama / Alamat Tujuan Laporan (Pihak Ketiga)"
                required
                leftIcon={<Send className="w-4 h-4" />}
                placeholder="Contoh: Up. Manajer Pengendalian Mutu (QA/QC) - PT XYZ, Jl. Raya..."
                value={sharedData.laporan_dialamatkan_kepada}
                onChange={(e) =>
                  setSharedData((prev) => ({
                    ...prev,
                    laporan_dialamatkan_kepada: e.target.value,
                  }))
                }
              />
            </div>
          ) : (
            <div className="text-xs text-slate-600 bg-white/80 p-2.5 rounded-lg border border-slate-200 font-medium flex items-center gap-2">
              <Send className="w-4 h-4 text-brand-600 shrink-0" />
              <span>
                Tujuan pengiriman LHU: <strong className="text-slate-900">Up. Pimpinan / Bagian QC - {applicantName}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Keterangan Permintaan */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Keterangan Permintaan (Opsional)
          </label>
          <textarea
            rows={3}
            placeholder="Tuliskan catatan atau instruksi umum permohonan pengujian jika ada..."
            value={sharedData.keterangan_permintaan}
            onChange={(e) =>
              setSharedData((prev) => ({
                ...prev,
                keterangan_permintaan: e.target.value,
              }))
            }
            className="w-full text-xs rounded-lg border border-slate-300 p-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="px-5 py-2.5 font-semibold text-xs"
        >
          Kembali ke Pemilihan Bahasa
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={handleValidateAndNext}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="px-6 py-2.5 font-semibold text-xs shadow-xs"
        >
          Lanjut ke Contoh Uji
        </Button>
      </div>
    </div>
  )
}

export default Step2DataPermintaan
