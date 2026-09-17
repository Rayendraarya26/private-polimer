import React from "react"
import {
  FlaskConical,
  Plus,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  HelpCircle,
  Layers,
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

interface Step3ParameterUjiProps {
  samples: PengujianSampleItem[]
  setSamples: React.Dispatch<React.SetStateAction<PengujianSampleItem[]>>
  kategoriTarif: KategoriTarif
  onNext: () => void
  onBack: () => void
}

export const Step3ParameterUji: React.FC<Step3ParameterUjiProps> = ({
  samples,
  setSamples,
  kategoriTarif,
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
        toast.error(`Sampel #${i + 1}: Minimal 1 parameter uji wajib dipilih`)
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
    <div className="space-y-6">
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
                Daftarkan satu atau beberapa sampel uji, tentukan spesifikasi fisik, dan pilih
                parameter uji laboratorium yang diinginkan.
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
