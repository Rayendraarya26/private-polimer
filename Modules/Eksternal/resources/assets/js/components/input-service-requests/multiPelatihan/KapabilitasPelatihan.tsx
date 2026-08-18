import React from "react"
import { toast } from "react-hot-toast"
import { ParticipantData } from "../../../types/pelatihan"
import { Award, FileUp, CheckCircle2 } from "lucide-react"

const MAX_FILE_SIZE = 3 * 1024 * 1024

interface Props {
  participants: ParticipantData[]
  setParticipants: React.Dispatch<React.SetStateAction<ParticipantData[]>>
}

const KapabilitasPelatihan: React.FC<Props> = ({ participants, setParticipants }) => {
  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const newParticipants = [...participants]
    newParticipants[index] = { ...newParticipants[index], [name]: value }
    setParticipants(newParticipants)
  }

  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof ParticipantData,
    label: string
  ) => {
    const file = e.target.files?.[0] ?? null
    if (file && file.size > MAX_FILE_SIZE) {
      toast.error(`Ukuran file ${label} maksimal 3 MB`)
      e.target.value = ""
      return
    }

    const newParticipants = [...participants]
    newParticipants[index] = {
      ...newParticipants[index],
      [fieldName]: file,
    }
    setParticipants(newParticipants)
  }

  return (
    <div className="bg-gradient-to-br from-amber-50/60 via-orange-50/30 to-white p-6 rounded-2xl border border-amber-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-amber-200 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-amber-950 tracking-tight">
                Berkas Portofolio Sertifikasi Kompetensi (LSP BNSP)
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-200 text-amber-900 rounded-full">
                Bundling Asesmen
              </span>
            </div>
            <p className="text-xs text-amber-800/80">
              Lengkapi berkas portofolio uji kompetensi untuk setiap peserta yang didaftarkan
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {participants.map((p, index) => (
          <div
            key={p.id}
            className="p-5 bg-white rounded-xl border border-amber-200/80 shadow-2xs space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-800">
                Peserta {index + 1}: <span className="text-brand-600">{p.nama_lengkap || "Nama Belum Diisi"}</span>
              </h4>
              <span className="text-[11px] text-slate-400">NIK: {p.nik_peserta || "-"}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kewarganegaraan <span className="text-rose-500">*</span>
                </label>
                <select
                  name="kewarganegaraan"
                  value={p.kewarganegaraan || ""}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                >
                  <option value="">-- Pilih --</option>
                  <option value="WNI">WNI (Warga Negara Indonesia)</option>
                  <option value="WNA">WNA (Warga Negara Asing)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kode Pos Domisili <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="kode_pos"
                  value={p.kode_pos || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 5)
                    handleChange(index, { target: { name: "kode_pos", value } } as any)
                  }}
                  inputMode="numeric"
                  maxLength={5}
                  placeholder="5 digit kode pos..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Jabatan / Posisi Pekerjaan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="jabatan"
                  value={p.jabatan || ""}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Contoh: Supervisor QC..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pengalaman Kerja Relevan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="pengalaman_kerja"
                  value={p.pengalaman_kerja || ""}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Contoh: 2 Tahun di Laboratorium Kimia..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            {/* Dokumen Portofolio LSP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Upload Ijazah Terakhir <span className="text-rose-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf, image/*"
                  onChange={(e) => handleFileChange(index, e, "ijazah", "Ijazah")}
                  className="w-full text-xs text-slate-500 file:mr-2.5 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800"
                  required
                />
                {p.ijazah && (
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> File: {p.ijazah.name}
                  </p>
                )}
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Upload Formulir APL-01 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf, image/*"
                  onChange={(e) => handleFileChange(index, e, "apl_01", "APL-01")}
                  className="w-full text-xs text-slate-500 file:mr-2.5 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800"
                  required
                />
                {p.apl_01 && (
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> File: {p.apl_01.name}
                  </p>
                )}
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Upload Formulir APL-02 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf, image/*"
                  onChange={(e) => handleFileChange(index, e, "apl_02", "APL-02")}
                  className="w-full text-xs text-slate-500 file:mr-2.5 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800"
                  required
                />
                {p.apl_02 && (
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> File: {p.apl_02.name}
                  </p>
                )}
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Dokumen Tambahan / Portofolio <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
                <input
                  type="file"
                  accept=".pdf, image/*"
                  onChange={(e) => handleFileChange(index, e, "upload_lainya", "Dokumen Tambahan")}
                  className="w-full text-xs text-slate-500 file:mr-2.5 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700"
                />
                {p.upload_lainya && (
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> File: {p.upload_lainya.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default KapabilitasPelatihan
