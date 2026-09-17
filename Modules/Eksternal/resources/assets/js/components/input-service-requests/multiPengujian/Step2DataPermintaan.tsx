import React, { useEffect } from "react"
import {
  FileText,
  Calendar,
  Building2,
  Send,
  CreditCard,
  GraduationCap,
  Sparkles,
  AlertCircle,
  Eye,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Info,
} from "lucide-react"
import { toast } from "react-hot-toast"
import {
  CaraPembayaran,
  JenisUji,
  KategoriTarif,
  PengujianSharedData,
} from "../../../types/pengujian"
import { Input } from "../../ui/Input"
import { Button } from "../../ui/Button"
import { Badge } from "../../ui/Badge"
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
        biaya_ditanggung_oleh: prev.biaya_ditanggung_oleh || companyOrPerson,
        laporan_dialamatkan_kepada:
          prev.laporan_dialamatkan_kepada ||
          (companyOrPerson ? `Up. Pimpinan / Bagian QC - ${companyOrPerson}` : ""),
      }
    })
  }, [profile, setSharedData])

  const handleValidateAndNext = () => {
    if (!sharedData.biaya_ditanggung_oleh.trim()) {
      toast.error("Kolom 'Biaya Pengujian ditanggung oleh' wajib diisi")
      return
    }
    if (!sharedData.laporan_dialamatkan_kepada.trim()) {
      toast.error("Kolom 'Laporan Pengujian dialamatkan kepada' wajib diisi")
      return
    }
    if (sharedData.permintaan_evaluasi && !sharedData.catatan_evaluasi.trim()) {
      toast.error("Silakan masukkan spesifikasi atau standar acuan evaluasi kesesuaian")
      return
    }
    if (sharedData.menyaksikan_uji && !sharedData.catatan_menyaksikan.trim()) {
      toast.error("Silakan masukkan perkiraan tanggal dan nama personil yang akan menyaksikan pengujian")
      return
    }

    onNext()
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Tahap 2: Data Permintaan & Administrasi Layanan
            </h2>
            <p className="text-xs text-slate-500">
              Isi data administrasi pemohon, ketentuan penagihan biaya, dan preferensi teknis pengujian.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card 1: Data Penanggung Jawab & Alamat Laporan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Building2 className="w-4 h-4 text-brand-600" />
          1. Penanggung Jawab & Pengiriman Laporan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tanggal Permohonan (Auto-lock) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Tanggal Permohonan
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
            <p className="text-[11px] text-slate-400 mt-1">Tercatat otomatis sesuai waktu sistem balai</p>
          </div>

          {/* Biaya Ditanggung Oleh */}
          <div>
            <Input
              label="Biaya Pengujian Ditanggung Oleh"
              required
              leftIcon={<Building2 className="w-4 h-4" />}
              placeholder="Contoh: PT Industri Karet Nusantara / Pribadi"
              value={sharedData.biaya_ditanggung_oleh}
              onChange={(e) =>
                setSharedData((prev) => ({
                  ...prev,
                  biaya_ditanggung_oleh: e.target.value,
                }))
              }
              helperText="Nama pihak atau badan usaha yang bertanggung jawab atas pembayaran jasa uji"
            />
          </div>

          {/* Laporan Pengujian Minta Dialamatkan Kepada */}
          <div className="md:col-span-2">
            <Input
              label="Laporan Pengujian Minta Dialamatkan Kepada"
              required
              leftIcon={<Send className="w-4 h-4" />}
              placeholder="Contoh: Up. Manajer Pengendalian Mutu (QA/QC) - PT XYZ"
              value={sharedData.laporan_dialamatkan_kepada}
              onChange={(e) =>
                setSharedData((prev) => ({
                  ...prev,
                  laporan_dialamatkan_kepada: e.target.value,
                }))
              }
              helperText="Nama lengkap pejabat, divisi teknis, atau alamat tujuan pengiriman fisik/dokumen LHU"
            />
          </div>
        </div>
      </div>

      {/* Form Card 2: Preferensi Evaluasi & Pilihan Menyaksikan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Sparkles className="w-4 h-4 text-brand-600" />
          2. Evaluasi Kesesuaian & Kehadiran di Laboratorium
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Permintaan Evaluasi / Pernyataan Kesesuaian */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-start justify-between gap-3">
              <div>
                <label className="text-xs font-bold text-slate-800 block">
                  Permintaan Evaluasi / Pernyataan Kesesuaian
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Apakah hasil uji memerlukan evaluasi status lulus/tidak lulus terhadap standar?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="permintaan_evaluasi"
                  checked={sharedData.permintaan_evaluasi === true}
                  onChange={() =>
                    setSharedData((prev) => ({
                      ...prev,
                      permintaan_evaluasi: true,
                    }))
                  }
                  className="w-4 h-4 text-brand-600 border-slate-300 focus:ring-brand-500"
                />
                <span>Ya, butuh evaluasi</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="permintaan_evaluasi"
                  checked={sharedData.permintaan_evaluasi === false}
                  onChange={() =>
                    setSharedData((prev) => ({
                      ...prev,
                      permintaan_evaluasi: false,
                      catatan_evaluasi: "",
                    }))
                  }
                  className="w-4 h-4 text-brand-600 border-slate-300 focus:ring-brand-500"
                />
                <span>Tidak (Hanya data numerik)</span>
              </label>
            </div>

            {sharedData.permintaan_evaluasi && (
              <div className="pt-2 animate-in fade-in-50 duration-200">
                <textarea
                  rows={2}
                  placeholder="Sebutkan acuan standar (Contoh: Evaluasi terhadap ambang batas SNI 06-4965-1999 Kelas A)..."
                  value={sharedData.catatan_evaluasi}
                  onChange={(e) =>
                    setSharedData((prev) => ({
                      ...prev,
                      catatan_evaluasi: e.target.value,
                    }))
                  }
                  className="w-full text-xs rounded-lg border border-brand-300 p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}
          </div>

          {/* Pilihan Menyaksikan Pengujian */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-start justify-between gap-3">
              <div>
                <label className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-brand-600" />
                  Pilihan Menyaksikan Pengujian
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Apakah perwakilan instansi Anda ingin hadir langsung di laboratorium saat pengujian?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="menyaksikan_uji"
                  checked={sharedData.menyaksikan_uji === true}
                  onChange={() =>
                    setSharedData((prev) => ({
                      ...prev,
                      menyaksikan_uji: true,
                    }))
                  }
                  className="w-4 h-4 text-brand-600 border-slate-300 focus:ring-brand-500"
                />
                <span>Ya, ingin hadir</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="menyaksikan_uji"
                  checked={sharedData.menyaksikan_uji === false}
                  onChange={() =>
                    setSharedData((prev) => ({
                      ...prev,
                      menyaksikan_uji: false,
                      catatan_menyaksikan: "",
                    }))
                  }
                  className="w-4 h-4 text-brand-600 border-slate-300 focus:ring-brand-500"
                />
                <span>Tidak hadir</span>
              </label>
            </div>

            {sharedData.menyaksikan_uji && (
              <div className="pt-2 space-y-2 animate-in fade-in-50 duration-200">
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>Wajib mematuhi SOP K3 Lab Balai dan mengenakan APD standar.</span>
                </div>
                <textarea
                  rows={2}
                  placeholder="Sebutkan perkiraan tanggal hadir & nama personil perwakilan..."
                  value={sharedData.catatan_menyaksikan}
                  onChange={(e) =>
                    setSharedData((prev) => ({
                      ...prev,
                      catatan_menyaksikan: e.target.value,
                    }))
                  }
                  className="w-full text-xs rounded-lg border border-brand-300 p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Card 3: Cara Pembayaran & Kategori Tarif */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
          <CreditCard className="w-4 h-4 text-brand-600" />
          3. Tata Cara Pembayaran & Kategori Tarif PNBP
        </h3>

        {/* Kategori Tarif PNBP */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800">
            Kategori Tarif PNBP <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              onClick={() =>
                setSharedData((prev) => ({
                  ...prev,
                  kategori_tarif: "umum",
                }))
              }
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                sharedData.kategori_tarif === "umum"
                  ? "bg-brand-50/70 border-brand-600 ring-2 ring-brand-500/10"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">Tarif Umum (Standard)</span>
                {sharedData.kategori_tarif === "umum" && (
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Berlaku untuk industri, perusahaan BUMN/swasta, institusi litbang, dan pemohon perorangan.
              </p>
            </div>

            <div
              onClick={() =>
                setSharedData((prev) => ({
                  ...prev,
                  kategori_tarif: "mahasiswa_pp54",
                }))
              }
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                sharedData.kategori_tarif === "mahasiswa_pp54"
                  ? "bg-brand-50/70 border-brand-600 ring-2 ring-brand-500/10"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-brand-600" />
                  Tarif Mahasiswa (PP RI No. 54)
                </span>
                {sharedData.kategori_tarif === "mahasiswa_pp54" && (
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Diskon tarif pendidikan khusus untuk penelitian skripsi/tugas akhir mahasiswa aktif.
              </p>
              <Badge variant="warning" size="sm" className="mt-2 text-[10px]">
                Wajib Upload KTM pada Tahap 4
              </Badge>
            </div>
          </div>
        </div>

        {/* Cara Pembayaran */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold text-slate-800">
            Metode Pembayaran <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: "transfer" as CaraPembayaran,
                title: "Transfer BNI VA",
                desc: "Nomor Virtual Account terbit otomatis & verifikasi real-time",
              },
              {
                id: "tunai" as CaraPembayaran,
                title: "Tunai di Loket",
                desc: "Pembayaran langsung di loket kasir PTSP BBSPJIKKP",
              },
              {
                id: "dibayar_di_belakang" as CaraPembayaran,
                title: "Dibayar di Belakang",
                desc: "Khusus instansi rekanan dengan perjanjian kerja sama (MoU/PKS)",
              },
            ].map((method) => {
              const isSelected = sharedData.cara_pembayaran === method.id
              return (
                <div
                  key={method.id}
                  onClick={() =>
                    setSharedData((prev) => ({
                      ...prev,
                      cara_pembayaran: method.id,
                    }))
                  }
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "bg-brand-50/70 border-brand-600 ring-2 ring-brand-500/10"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{method.title}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{method.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {sharedData.cara_pembayaran === "dibayar_di_belakang" && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2 animate-in fade-in-50 duration-200 mt-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">Ketentuan Pembayaran di Belakang:</p>
                <p className="text-[11px] text-amber-800">
                  Permohonan akan diverifikasi oleh bagian Pemasaran & Kerjasama untuk memastikan
                  keabsahan masa berlaku MoU / PKS instansi Anda sebelum pengerjaan uji dimulai.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Card 4: Jenis Uji & Keterangan Tambahan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
          <FileText className="w-4 h-4 text-brand-600" />
          4. Klasifikasi Jenis Uji & Keterangan Tambahan
        </h3>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-800">
            Jenis Uji Laboratorium <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: "regular" as JenisUji,
                title: "Pengujian Regular",
                desc: "Pengujian mutu material & produk rutin",
              },
              {
                id: "profisiensi" as JenisUji,
                title: "Uji Profisiensi",
                desc: "Sesuai Klausul ISO 17025 7.7.2",
              },
              {
                id: "banding_lab" as JenisUji,
                title: "Uji Banding Antar Lab",
                desc: "Verifikasi kinerja antar laboratorium penguji",
              },
            ].map((j) => {
              const isSelected = sharedData.jenis_uji === j.id
              return (
                <div
                  key={j.id}
                  onClick={() =>
                    setSharedData((prev) => ({
                      ...prev,
                      jenis_uji: j.id,
                    }))
                  }
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-brand-50/70 border-brand-600 ring-2 ring-brand-500/10"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{j.title}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500">{j.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Keterangan Sampel / Uji */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Keterangan Tambahan Sampel / Uji (Opsional)
          </label>
          <textarea
            rows={3}
            placeholder="Tuliskan catatan khusus terkait instruksi penanganan sampel, perlakuan suhu, atau keperluan teknis lainnya..."
            value={sharedData.keterangan_uji}
            onChange={(e) =>
              setSharedData((prev) => ({
                ...prev,
                keterangan_uji: e.target.value,
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
          Lanjut ke Parameter Uji
        </Button>
      </div>
    </div>
  )
}

export default Step2DataPermintaan
