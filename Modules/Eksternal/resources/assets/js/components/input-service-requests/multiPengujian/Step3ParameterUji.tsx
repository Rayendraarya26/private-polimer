import React from "react"
import { FlaskConical, Plus, Building2, GraduationCap, Info } from "lucide-react"
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
  StepPanel,
  FieldLabel,
  OptionCard,
  OptionGroup,
  WizardNav,
  cx,
} from "./components/WizardUI"

interface Step3ParameterUjiProps {
  samples: PengujianSampleItem[]
  setSamples: React.Dispatch<React.SetStateAction<PengujianSampleItem[]>>
  kategoriTarif: KategoriTarif
  setKategoriTarif: (kategori: KategoriTarif) => void
  onNext: () => void
  onBack: () => void
}

const TarifIcon: React.FC<{ icon: React.ElementType; active: boolean }> = ({ icon: Icon, active }) => (
  <span
    className={cx(
      "w-8 h-8 rounded-md border flex items-center justify-center shrink-0 transition-colors",
      active
        ? "border-brand-500 bg-brand-50 text-brand-700"
        : "border-slate-200 bg-white text-slate-500 group-hover:border-slate-300"
    )}
  >
    <Icon className="w-4 h-4" />
  </span>
)

export const Step3ParameterUji: React.FC<Step3ParameterUjiProps> = ({
  samples,
  setSamples,
  kategoriTarif,
  setKategoriTarif,
  onNext,
  onBack,
}) => {
  // Fetch master komoditas aktif
  const { data: komoditiList = [] } = useMasterKomoditiQuery()

  const handleAddSample = () => {
    const newId = Date.now()
    setSamples((prev) => [...prev, emptyPengujianSample(newId)])
    toast.success("Sampel baru ditambahkan")
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

  const isMahasiswa = kategoriTarif === "mahasiswa_pp54"

  return (
    <div className="space-y-6">
      <StepPanel
        icon={FlaskConical}
        title="Sampel & Parameter Uji"
        description="Daftarkan setiap sampel, pilih komoditasnya, lalu centang parameter yang ingin diuji."
        flush
      >
        {/* Kategori Tarif */}
        <div className="p-5 sm:p-7">
          <OptionGroup label="Kategori Tarif PNBP Pengujian">
            <OptionCard
              id="opsi-tarif-umum"
              compact
              selected={kategoriTarif === "umum"}
              onSelect={() => setKategoriTarif("umum")}
              leading={<TarifIcon icon={Building2} active={kategoriTarif === "umum"} />}
              title="Tarif Umum"
              description="Industri, BUMN/swasta, institusi litbang, dan perorangan."
            />
            <OptionCard
              id="opsi-tarif-mahasiswa"
              compact
              selected={isMahasiswa}
              onSelect={() => setKategoriTarif("mahasiswa_pp54")}
              leading={<TarifIcon icon={GraduationCap} active={isMahasiswa} />}
              title="Tarif Mahasiswa (PP No. 54)"
              description="Untuk penelitian skripsi / tugas akhir mahasiswa aktif."
            >
              <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                <Info className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                Perlu unggah KTM di langkah terakhir
              </p>
            </OptionCard>
          </OptionGroup>
        </div>

        {/* Daftar Sampel */}
        <div className="border-t border-slate-200 divide-y divide-slate-200">
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

        {/* Tambah Sampel */}
        <div className="px-5 sm:px-7 py-3.5 border-t border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Perlu menguji lebih dari 1 sampel dalam permohonan ini?
          </p>
          <Button
            type="button"
            id="btn-tambah-sampel"
            variant="outline"
            onClick={handleAddSample}
            leftIcon={<Plus className="w-4 h-4 text-brand-600" />}
            className="w-full sm:w-auto h-10 px-4 rounded-lg font-semibold text-xs border-brand-300 bg-white text-brand-700 hover:bg-brand-50 hover:border-brand-400 shadow-none shrink-0"
          >
            Tambah Sampel Lain
          </Button>
        </div>
      </StepPanel>

      {/* Ringkasan biaya real-time */}
      <CostEstimationSummary samples={samples} kategoriTarif={kategoriTarif} />

      <WizardNav onBack={onBack} onNext={handleValidateAndNext} />
    </div>
  )
}

export default Step3ParameterUji
