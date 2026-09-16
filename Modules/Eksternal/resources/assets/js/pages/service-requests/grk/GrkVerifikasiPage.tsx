import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Button } from "../../../components/ui/Button"
import { GraduationCap, ArrowLeft, CheckCircle2, Sparkles, Loader2, Users, Building } from "lucide-react"
import FormPelatihanWizard from "../../../components/input-service-requests/multiPelatihan/FormPelatihanWizard"
import { usePelatihanSkemaQuery } from "../../../hooks/queries/useMasterQuery"

const PelatihanPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedSkema, setSelectedSkema] = useState("")
  const [kriteriaVerifikasi, setKriteriaVerifikasi] = useState("")

  const { data: skemaList = [], isLoading: loading } = usePelatihanSkemaQuery()

  const selectedSkemaData = skemaList.find((s: any) => s.id === selectedSkema)
  const kapabilitas = selectedSkemaData?.kapabilitas ?? 0

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Head title="Pengajuan Bimbingan Teknis & Pelatihan" />

      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Verifikasi Emisi Gas Rumah Kaca (GRK)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Layanan verifikasi gas rumah kaca BBKKP
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/permohonan/grk")}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="shrink-0"
        >
          Kembali
        </Button>
      </div>

      {/* Skema Selection Card */}
      <Card className="border-brand-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="w-4 h-4 text-brand-600" />
                Informasi Organisasi
              </CardTitle>
              <CardDescription>
                Masukkan informasi organisasi
              </CardDescription>
            </div>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-brand-600" />}
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Input Nama Pemilik */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Nama Pemilik <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nama Pemilik"
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors text-slate-800"
              />
            </div>

            {/* Input Nama Pimpinan */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Nama Pimpinan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nama Pimpinan"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
              />
            </div>

            {/* Input Nama Penanggung Jawab Program */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Nama Penanggung Jawab Program <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nama Penanggung Jawab Program"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
              />
            </div>

            {/* Input Jumlah Fasilitas */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Jumlah Fasilitas <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Jumlah Fasilitas"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
              />
            </div>

            {/* Kriteria Verifikasi */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Kriteria Verifikasi <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3 pt-1">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="14064-1"
                    name="kriteria_verifikasi"
                    value="14064-1"
                    checked={kriteriaVerifikasi === "14064-1"}
                    onChange={(e) => setKriteriaVerifikasi(e.target.value)}
                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                  />
                  <label htmlFor="14064-1" className="ms-2.5 text-sm font-medium text-slate-700 cursor-pointer">
                    14064-1
                  </label>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="lainnya"
                      name="kriteria_verifikasi"
                      value="lainnya"
                      checked={kriteriaVerifikasi === "lainnya"}
                      onChange={(e) => setKriteriaVerifikasi(e.target.value)}
                      className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                    />
                    <label htmlFor="lainnya" className="ms-2.5 text-sm font-medium text-slate-700 cursor-pointer">
                      Lainnya
                    </label>
                  </div>
                  {kriteriaVerifikasi === "lainnya" && (
                    <div className="pl-6 pt-1">
                      <input
                        type="text"
                        placeholder="Kriteria lainnya"
                        className="w-full md:w-1/2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Input Periode Pelaporan */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Periode Pelaporan <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Tgl Mulai"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = "text"
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Tgl Selesai"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = "text"
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                />
              </div>
            </div>

            {/* Input Jumlah Karyawan */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Jumlah Karyawan <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Jumlah Karyawan"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
              />
            </div>

            {/* Input Deskripsi Aktivitas Perusahaan */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Deskripsi aktivitas perusahaan <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Deskripsi aktivitas perusahaan"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
              />
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Informasi Lingkup */}
      <Card className="border-brand-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="w-4 h-4 text-brand-600" />
                Informasi Lingkup
              </CardTitle>
            </div>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-brand-600" />}
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Input Nama Pemilik */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Nama Pemilik <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nama Pemilik"
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors text-slate-800"
              />
            </div>

            {/* Input Nama Pimpinan */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Nama Pimpinan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nama Pimpinan"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
              />
            </div>

            {/* Input Nama Penanggung Jawab Program */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Nama Penanggung Jawab Program <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nama Penanggung Jawab Program"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
              />
            </div>

            {/* Input Jumlah Fasilitas */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Jumlah Fasilitas <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Jumlah Fasilitas"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
              />
            </div>

            {/* Kriteria Verifikasi */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Kriteria Verifikasi <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3 pt-1">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="14064-1"
                    name="kriteria_verifikasi"
                    value="14064-1"
                    checked={kriteriaVerifikasi === "14064-1"}
                    onChange={(e) => setKriteriaVerifikasi(e.target.value)}
                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                  />
                  <label htmlFor="14064-1" className="ms-2.5 text-sm font-medium text-slate-700 cursor-pointer">
                    14064-1
                  </label>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="lainnya"
                      name="kriteria_verifikasi"
                      value="lainnya"
                      checked={kriteriaVerifikasi === "lainnya"}
                      onChange={(e) => setKriteriaVerifikasi(e.target.value)}
                      className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                    />
                    <label htmlFor="lainnya" className="ms-2.5 text-sm font-medium text-slate-700 cursor-pointer">
                      Lainnya
                    </label>
                  </div>
                  {kriteriaVerifikasi === "lainnya" && (
                    <div className="pl-6 pt-1">
                      <input
                        type="text"
                        placeholder="Kriteria lainnya"
                        className="w-full md:w-1/2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Input Periode Pelaporan */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Periode Pelaporan <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Tgl Mulai"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = "text"
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Tgl Selesai"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = "text"
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                />
              </div>
            </div>

            {/* Input Jumlah Karyawan */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Jumlah Karyawan <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Jumlah Karyawan"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
              />
            </div>

            {/* Input Deskripsi Aktivitas Perusahaan */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Deskripsi aktivitas perusahaan <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Deskripsi aktivitas perusahaan"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
              />
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Multi-step Form Wizard Container */}
      {selectedSkema && (
        <div className="animate-in fade-in-50 duration-300">
          <FormPelatihanWizard skemaId={selectedSkema} kapabilitas={kapabilitas} />
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <Button variant="outline" type="button" className="px-6 transition-colors">
          Kembali
        </Button>
        <Button
          type="button"
          // onClick={onNext}
          // disabled={!selectedKategori || komoditiItems.length === 0}
          className="px-6 disabled:opacity-50 disabled:cursor-not-allowed transition-colors "
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  )
}

export default PelatihanPage
