// components/input-service-requests/multiGrk/Step2TambahanDanDokumen.tsx
import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../../../ui/Card"
import { Building, FileText, Info } from "lucide-react"
import { GrkVerifikasiFormData } from "../../../../types/grk"

interface Props {
    formData: GrkVerifikasiFormData
    setFormData: React.Dispatch<React.SetStateAction<GrkVerifikasiFormData>>
}

export const FormInformasiTambahan: React.FC<Props> = ({ formData, setFormData }) => {
    const {
        useKonsultan = "",
        konsultanNama = "",
        konsultanInstitusi = "",
        isShareExternal = "",
        pihakEksternal = "",
    } = formData

    const handleChange = (field: keyof GrkVerifikasiFormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const setUseKonsultan = (val: string) => handleChange("useKonsultan", val)
    const setKonsultanNama = (val: string) => handleChange("konsultanNama", val)
    const setKonsultanInstitusi = (val: string) => handleChange("konsultanInstitusi", val)
    const setIsShareExternal = (val: string) => handleChange("isShareExternal", val)
    const setPihakEksternal = (val: string) => handleChange("pihakEksternal", val)

    return (
        <Card className="border-brand-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="w-4 h-4 text-brand-600" />
                Informasi Tambahan
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="space-y-6">

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Apakah perusahaan telah melibatkan konsultan untuk inventarisasi dan pelaporan emisi GRK? <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-4">
                <label className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border cursor-pointer transition-all shadow-xs ${useKonsultan === "ya" ? "border-brand-500 bg-brand-50/30 text-brand-900" : "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/20 text-slate-700"}`}>
                  <input
                    type="radio"
                    name="use_konsultan"
                    value="ya"
                    id="konsultan_ya"
                    checked={useKonsultan === "ya"}
                    onChange={(e) => setUseKonsultan(e.target.value)}
                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                  />
                  <span className="text-xs font-medium">Ya</span>
                </label>

                <label className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border cursor-pointer transition-all shadow-xs ${useKonsultan === "tidak" ? "border-brand-500 bg-brand-50/30 text-brand-900" : "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/20 text-slate-700"}`}>
                  <input
                    type="radio"
                    name="use_konsultan"
                    value="tidak"
                    id="konsultan_tidak"
                    checked={useKonsultan === "tidak"}
                    onChange={(e) => setUseKonsultan(e.target.value)}
                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                  />
                  <span className="text-xs font-medium">Tidak</span>
                </label>
              </div>
            </div>

            {useKonsultan === "ya" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-1 animate-in fade-in-50 duration-200">
                <div className="space-y-1.5">
                  <label htmlFor="konsultan_nama" className="block text-xs font-bold text-slate-800 mb-1.5">
                    Nama Konsultan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="konsultan_nama"
                    name="konsultan_nama"
                    value={konsultanNama}
                    onChange={(e) => setKonsultanNama(e.target.value)}
                    placeholder="Nama Konsultan"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="konsultan_institusi" className="block text-xs font-bold text-slate-800 mb-1.5">
                    Institusi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="konsultan_institusi"
                    name="konsultan_institusi"
                    value={konsultanInstitusi}
                    onChange={(e) => setKonsultanInstitusi(e.target.value)}
                    placeholder="Institusi"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                  />
                </div>
              </div>
            )}

          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Apakah perusahaan membagikan informasi GRK ke pihak eksternal. <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-4">
                <label className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border cursor-pointer transition-all shadow-xs ${isShareExternal === "ya" ? "border-brand-500 bg-brand-50/30 text-brand-900" : "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/20 text-slate-700"}`}>
                  <input
                    type="radio"
                    name="isShareExternal"
                    value="ya"
                    id="isShareExternalTidak"
                    checked={isShareExternal === "ya"}
                    onChange={(e) => setIsShareExternal(e.target.value)}
                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                  />
                  <span className="text-xs font-medium">Ya</span>
                </label>

                <label className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border cursor-pointer transition-all shadow-xs ${isShareExternal === "tidak" ? "border-brand-500 bg-brand-50/30 text-brand-900" : "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/20 text-slate-700"}`}>
                  <input
                    type="radio"
                    name="isShareExternal"
                    value="tidak"
                    id="isShareExternalYa"
                    checked={isShareExternal === "tidak"}
                    onChange={(e) => setIsShareExternal(e.target.value)}
                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                  />
                  <span className="text-xs font-medium">Tidak</span>
                </label>
              </div>
            </div>

            {isShareExternal === "ya" && (
              <div className="grid grid-cols-1 gap-x-8 gap-y-4 pt-1 animate-in fade-in-50 duration-200">
                <div className="space-y-1.5">
                  <label htmlFor="pihak_eksternal" className="block text-xs font-bold text-slate-800 mb-1.5">
                    Pihak External <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="pihak_eksternal"
                    name="pihak_eksternal"
                    value={pihakEksternal}
                    onChange={(e) => setPihakEksternal(e.target.value)}
                    placeholder="Pihak External"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                  />
                </div>

              </div>
            )}

          </div>
        </CardContent>
      </Card>
        
    )
}

export default FormInformasiTambahan
