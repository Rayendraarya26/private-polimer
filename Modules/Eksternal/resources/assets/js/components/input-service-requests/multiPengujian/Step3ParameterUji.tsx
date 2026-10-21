import React from "react"
import {
  FlaskConical,
  Plus,
  ArrowRight,
  ArrowLeft,
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../ui/Card"

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
      <Card className="border-brand-100 shadow-sm overflow-hidden">
        {/* Step Header */}
        <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                <FlaskConical className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Pendaftaran Sampel & Parameter Uji</span>
              </CardTitle>
              <CardDescription>
                Pilih komoditas, centang parameter uji dengan metode acuan standar, dan tentukan jumlah sampel.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-slate-200">
          {/* Kategori Tarif Selector */}
          <div className="p-6 space-y-3 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-800">
                Kategori Tarif PNBP Pengujian <span className="text-rose-500">*</span>
              </label>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Opsi 1: Tarif Umum (Standard) */}
              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${kategoriTarif === "umum"
                  ? "bg-brand-50/80 border-brand-400 ring-2 ring-brand-500/20 text-brand-900"
                  : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
              >
                <input
                  type="radio"
                  name="kategoriTarif"
                  value="umum"
                  checked={kategoriTarif === "umum"}
                  onChange={() => setKategoriTarif("umum")}
                  className="mt-0.5 text-brand-600 focus:ring-brand-500 border-slate-300"
                />
                <div className="text-xs min-w-0">
                  <span className="font-bold block text-slate-800 mb-0.5">
                    Tarif Umum (Standard)
                  </span>
                  <span className="text-[11px] text-slate-500 block leading-relaxed">
                    Berlaku untuk industri, perusahaan BUMN/swasta, institusi litbang, dan pemohon perorangan.
                  </span>
                </div>
              </label>

              {/* Opsi 2: Tarif Mahasiswa (PP RI No. 54) */}
              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${kategoriTarif === "mahasiswa_pp54"
                  ? "bg-brand-50/80 border-brand-400 ring-2 ring-brand-500/20 text-brand-900"
                  : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
              >
                <input
                  type="radio"
                  name="kategoriTarif"
                  value="mahasiswa_pp54"
                  checked={kategoriTarif === "mahasiswa_pp54"}
                  onChange={() => setKategoriTarif("mahasiswa_pp54")}
                  className="mt-0.5 text-brand-600 focus:ring-brand-500 border-slate-300"
                />
                <div className="text-xs min-w-0">
                  <span className="font-bold block text-slate-800 mb-0.5">
                    Tarif Mahasiswa (PP RI No. 54)
                  </span>
                  <span className="text-[11px] text-slate-500 block leading-relaxed">
                    Diskon tarif pendidikan khusus untuk penelitian skripsi/tugas akhir mahasiswa aktif.
                  </span>
                  <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 rounded-md">
                    Wajib Unggah KTM pada Tahap 4
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Samples List */}
          <div className="divide-y divide-slate-200">
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

          {/* Tombol Tambah Sampel Baru di dalam Card */}
          <div className="flex justify-center p-4 bg-slate-50/50 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddSample}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold border-brand-300 text-brand-700 hover:bg-brand-50 hover:border-brand-400 shadow-xs bg-white"
            >
              <Plus className="w-4 h-4" />
              Tambah Sampel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Cost Estimation Summary Widget */}
      <CostEstimationSummary samples={samples} kategoriTarif={kategoriTarif} />

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="px-5 py-2.5 font-semibold text-xs"
        >
          Sebelumnya
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={handleValidateAndNext}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="px-6 py-2.5 font-semibold text-xs shadow-xs"
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  )
}

export default Step3ParameterUji
