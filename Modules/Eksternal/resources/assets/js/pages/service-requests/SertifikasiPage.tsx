import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Head from "../../components/common/Head"
import { Card, CardHeader, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { ArrowLeft, Plus, Trash2, Send } from "lucide-react"
import Step1JenisPermohonan from "../../components/sertifikasi/JenisPermohonan"
import Step2KategoriSertifikat, { KomoditiData } from "../../components/sertifikasi/KategoriSertifikat"
import Step3KondisiPerusahaan from "../../components/sertifikasi/KondisiPerusahaan"
import Step4Pernyataan from "../../components/sertifikasi/Pernyataan"

interface PengajuanItem {
  id: number
  jenisPermohonan: string
  sertifikatLama: string
  kategoriSertifikat: string
  komoditis?: KomoditiData[]
  komoditi?: KomoditiData
  kondisiPerusahaan: string
}

const SertifikasiPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)

  // State array untuk menampung maksimal 2 pengajuan
  const [pengajuans, setPengajuans] = useState<PengajuanItem[]>([
    {
      id: Date.now(),
      jenisPermohonan: "",
      sertifikatLama: "",
      kategoriSertifikat: "",
      komoditis: [],
      komoditi: {
        merek: "",
        tipe: "",
        noSni: "",
        ukuran: "",
        jumlahProduksi: 0,
        satuanProduksi: "",
        keterangan: "",
      },
      kondisiPerusahaan: "",
    }
  ])

  const [isAgreed, setIsAgreed] = useState(false)

  const addPengajuan = () => {
    if (pengajuans.length < 2) {
      setPengajuans([
        ...pengajuans,
        {
          id: Date.now(),
          jenisPermohonan: "",
          sertifikatLama: "",
          kategoriSertifikat: "",
          komoditis: [],
          komoditi: {
            merek: "",
            tipe: "",
            noSni: "",
            ukuran: "",
            jumlahProduksi: 0,
            satuanProduksi: "",
            keterangan: "",
          },
          kondisiPerusahaan: "",
        }
      ])
    }
  }

  const removePengajuan = (idToRemove: number) => {
    setPengajuans(prev => prev.filter(p => p.id !== idToRemove))
  }

  const updateFormData = (idToUpdate: number, field: string, value: any) => {
    setPengajuans(prev => prev.map(p => {
      if (p.id === idToUpdate) {
        return { ...p, [field]: value }
      }
      return p
    }))
  }

  const handleNext = () => setCurrentStep(prev => prev + 1)
  const handleBack = () => setCurrentStep(prev => prev - 1)

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Head title="Pengajuan Sertifikasi" />

      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pendaftaran Sertifikasi
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Kami melayani berbagai jenis sertifikasi untuk mendukung pemenuhan standar dan kredibilitas perusahaan Anda.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/permohonan")}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="shrink-0"
        >
          Kembali ke Katalog
        </Button>
      </div>

      {/* Progress Stepper Card */}
      <Card className="border-brand-100 shadow-sm">
        <CardHeader className="pt-6 pb-5 border-b border-slate-100 bg-slate-50/30">
          <div className="flex justify-between items-start w-full relative">
            <div className="absolute top-4 left-[12.5%] right-[12.5%] h-0.5 bg-slate-200 z-0"></div>

            {[
              { num: 1, label: "Jenis Permohonan" },
              { num: 2, label: "Kategori Sertifikat" },
              { num: 3, label: "Kondisi Perusahaan" },
              { num: 4, label: "Pernyataan" },
            ].map((step, idx) => {
              const isActive = currentStep >= step.num;
              return (
                <div key={idx} className="relative z-10 flex flex-col items-center w-1/4 px-1 transition-all duration-300">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-sm transition-colors duration-300 ${isActive
                      ? "bg-brand-600 text-white"
                      : "bg-slate-100 text-slate-400"
                      }`}
                  >
                    {step.num}
                  </div>
                  <div className={`mt-2.5 text-[11px] leading-tight text-center transition-colors duration-300 ${isActive ? "font-semibold text-brand-700" : "font-medium text-slate-500"}`}>
                    {step.label}
                  </div>
                </div>
              )
            })}
          </div>
        </CardHeader>

        <CardContent className="pt-6 bg-slate-50/50">

          {currentStep <= 3 ? (
            <div className="space-y-6">
              {pengajuans.map((pengajuan, index) => (
                <Card key={pengajuan.id} className="border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700 text-sm">
                      Pengajuan {index + 1}
                    </h3>
                    {pengajuans.length > 1 && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removePengajuan(pengajuan.id)}
                        leftIcon={<Trash2 className="w-4 h-4" />}
                        className="h-8 text-xs"
                      >
                        Hapus
                      </Button>
                    )}
                  </div>

                  <div className="p-6 bg-white">
                    {currentStep === 1 && (
                      <Step1JenisPermohonan
                        hideButtons
                        valueJenis={pengajuan.jenisPermohonan}
                        onChangeJenis={(val) => updateFormData(pengajuan.id, 'jenisPermohonan', val)}
                        valueSertifikat={pengajuan.sertifikatLama}
                        onChangeSertifikat={(val) => updateFormData(pengajuan.id, 'sertifikatLama', val)}
                      />
                    )}
                    {currentStep === 2 && (
                      <Step2KategoriSertifikat
                        hideButtons
                        value={pengajuan.kategoriSertifikat}
                        onChange={(val) => updateFormData(pengajuan.id, 'kategoriSertifikat', val)}
                        komoditiListValue={pengajuan.komoditis || []}
                        onChangeKomoditiList={(data) => updateFormData(pengajuan.id, 'komoditis', data)}
                      />
                    )}
                    {currentStep === 3 && (
                      <Step3KondisiPerusahaan
                        hideButtons
                      />
                    )}
                  </div>
                </Card>
              ))}

              {/* Tombol Tambah Pengajuan */}
              {pengajuans.length < 2 && currentStep === 1 && (
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={addPengajuan}
                    leftIcon={<Plus className="w-4 h-4" />}
                    className="border-dashed border-2 text-brand-600 border-brand-200 hover:border-brand-400 hover:bg-brand-50"
                  >
                    Tambah Pengajuan
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Step 4: Pernyataan (Satu untuk keseluruhan pengajuan) */
            <Card className="border border-slate-200 shadow-sm overflow-hidden bg-white">
              <div className="p-6">
                <Step4Pernyataan
                  hideButtons
                  isChecked={isAgreed}
                  onCheckChange={setIsAgreed}
                />
              </div>
            </Card>
          )}

          {/* Navigasi Lanjut / Kembali Utama */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
            {currentStep > 1 ? (
              <Button variant="outline" type="button" onClick={handleBack} className="px-6 bg-white">
                Kembali
              </Button>
            ) : <div></div>}

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="px-6"
                disabled={pengajuans.some(p => {
                  if (currentStep === 1) return !p.jenisPermohonan || (p.jenisPermohonan === 'perpanjangan' && !p.sertifikatLama)
                  if (currentStep === 2) return !p.kategoriSertifikat || !p.komoditis || p.komoditis.length === 0
                  return false
                })}
              >
                Selanjutnya
              </Button>
            ) : (
              <Button
                type="button"
                disabled={!isAgreed}
                leftIcon={<Send className="w-4 h-4" />}
                className="px-6 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
              >
                Kirim Permohonan
              </Button>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default SertifikasiPage
