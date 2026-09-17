import React from "react"
import {
  FlaskConical,
  Plus,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  CheckCircle2,
} from "lucide-react"
import { toast } from "react-hot-toast"
import {
  emptyPengujianSample,
  KategoriTarif,
  PengujianSampleItem,
} from "../../../types/pengujian"
import { useMasterKomoditiQuery } from "../../../hooks/queries/usePengujianQuery"
import { SampleCardItem } from "./components/SampleCardItem"
import { CostEstimationSummary } from "./components/CostEstimationSummary"
import { Button } from "../../ui/Button"
import { Badge } from "../../ui/Badge"

interface Step3ParameterUjiProps {
  samples: PengujianSampleItem[]
  setSamples: React.Dispatch<React.SetStateAction<PengujianSampleItem[]>>
  kategoriTarif: KategoriTarif
  setKategoriTarif: (kategori: KategoriTarif) => void
  onNext: () => void
  onBack: () => void
}

export const Step3ParameterUji: React.FC<Step3ParameterUjiProps> = ({
  samples,
  setSamples,
  kategoriTarif,
  setKategoriTarif,
  onNext,
  onBack,
}) => {
  // Fetch master komoditas aktif
  const { data: komoditiList = [], isLoading: loadingKomoditi } = useMasterKomoditiQuery()

  const handleAddSample = () => {
    const newId = Date.now()
    setSamples((prev) => [...prev, emptyPengujianSample(newId)])
    toast.success("Baris sampel baru berhasil ditambahkan")
  }

  const handleUpdateSample = (updatedSample: PengujianSampleItem) => {
    setSamples((prev) =>
      prev.map((s) => (s.id === updatedSample.id ? updatedSample : s))
    )
  }

  const handleDeleteSample = (sampleId: number) => {
    if (samples.length <= 1) {
      toast.error("Minimal harus ada 1 sampel pengujian")
      return
    }
    setSamples((prev) => prev.filter((s) => s.id !== sampleId))
    toast.success("Sampel berhasil dihapus")
  }

  const handleValidateAndNext = () => {
    if (samples.length === 0) {
      toast.error("Minimal 1 sampel uji wajib didaftarkan")
      return
    }

    for (let i = 0; i < samples.length; i++) {
      const s = samples[i]
      if (!s.nama_sampel.trim()) {
        toast.error(`Sampel #${i + 1}: Nama sampel belum diisi`)
        return
      }
      if (!s.master_komoditi_id) {
        toast.error(`Sampel #${i + 1}: Komoditas pengujian belum dipilih`)
        return
      }
      if (!s.selected_parameters || s.selected_parameters.length === 0) {
        toast.error(`Sampel #${i + 1}: Minimal centang 1 parameter uji laboratorium`)
        return
      }
      if (!s.jumlah_sampel || s.jumlah_sampel < 1) {
        toast.error(`Sampel #${i + 1}: Jumlah sampel minimal 1`)
        return
      }
    }

    onNext()
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Step Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Tahap 3: Pendaftaran Sampel & Parameter Uji
              </h2>
              <p className="text-xs text-slate-500">
                Pilih komoditas, centang parameter uji dengan metode acuan standar, dan tentukan jumlah sampel.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleAddSample}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shrink-0"
          >
            Tambah Sampel Lainnya
          </Button>
        </div>
      </div>

      {/* Kategori Tarif Selector Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Kategori Tarif PNBP Pengujian:
          </label>
          <span className="text-[11px] text-slate-500">
            Tarif parameter uji akan otomatis menyesuaikan dengan kategori di bawah
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => setKategoriTarif("umum")}
            className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
              kategoriTarif === "umum"
                ? "bg-brand-50/70 border-brand-600 ring-2 ring-brand-500/10 shadow-2xs"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900">Tarif Umum (Standard)</span>
              {kategoriTarif === "umum" && (
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Berlaku untuk industri, perusahaan BUMN/swasta, institusi litbang, dan pemohon perorangan.
            </p>
          </div>

          <div
            onClick={() => setKategoriTarif("mahasiswa_pp54")}
            className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
              kategoriTarif === "mahasiswa_pp54"
                ? "bg-brand-50/70 border-brand-600 ring-2 ring-brand-500/10 shadow-2xs"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-brand-600" />
                Tarif Mahasiswa (PP RI No. 54)
              </span>
              {kategoriTarif === "mahasiswa_pp54" && (
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Diskon tarif pendidikan khusus untuk penelitian skripsi/tugas akhir mahasiswa aktif.
            </p>
            <Badge variant="warning" size="sm" className="mt-1.5 text-[10px]">
              Wajib Unggah KTM pada Tahap 4
            </Badge>
          </div>
        </div>
      </div>

      {/* Real-time Cost Estimation Summary Widget */}
      <CostEstimationSummary samples={samples} kategoriTarif={kategoriTarif} />

      {/* Samples List */}
      <div className="space-y-4">
        {samples.map((sample, idx) => (
          <SampleCardItem
            key={sample.id}
            sample={sample}
            index={idx}
            komoditiList={komoditiList}
            kategoriTarif={kategoriTarif}
            canDelete={samples.length > 1}
            onUpdate={handleUpdateSample}
            onDelete={handleDeleteSample}
          />
        ))}
      </div>

      {/* Bottom Action: Add Another Sample Button */}
      <div className="p-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 text-center transition-colors">
        <p className="text-xs text-slate-600 mb-2">
          Memiliki varian spesimen lain yang ingin diuji dalam permohonan yang sama?
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddSample}
          leftIcon={<Plus className="w-4 h-4 text-brand-600" />}
          className="text-xs font-semibold"
        >
          + Tambah Sampel Pengujian Baru
        </Button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="px-5 py-2.5 font-semibold text-xs"
        >
          Kembali ke Data Permintaan
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={handleValidateAndNext}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="px-6 py-2.5 font-semibold text-xs shadow-xs"
        >
          Lanjut ke Dokumen & Konfirmasi
        </Button>
      </div>
    </div>
  )
}

export default Step3ParameterUji
