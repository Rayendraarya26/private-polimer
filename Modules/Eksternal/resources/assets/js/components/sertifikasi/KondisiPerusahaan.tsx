import React, { useState } from "react"
import { Button } from "../ui/Button"
import { User, Plus, Trash2, Building2, Download } from "lucide-react"

export interface PabrikItem {
  id: number
  namaPabrik: string
  noTelp: string
  noHp: string
  fax: string
  negara: string
  kodePos: string
  alamatPabrik: string
  jumlahKaryawan: number | string
  kegiatanUtama: string
  luasTanah: string
  luasBangunan: string
}

interface Step3KondisiPerusahaanProps {
  onNext?: () => void
  onBack?: () => void
  hideButtons?: boolean
}

const emptyPabrik = (id: number): PabrikItem => ({
  id,
  namaPabrik: "",
  noTelp: "",
  noHp: "",
  fax: "",
  negara: "Indonesia",
  kodePos: "",
  alamatPabrik: "",
  jumlahKaryawan: 0,
  kegiatanUtama: "",
  luasTanah: "",
  luasBangunan: "",
})

const daftarNegaraPabrik = [
  "Indonesia",
  "Malaysia",
  "Singapura",
  "Thailand",
  "Vietnam",
  "Filipina",
  "Brunei Darussalam",
  "Kamboja",
  "Laos",
  "Myanmar",
  "Jepang",
  "Korea Selatan",
  "Tiongkok",
  "Taiwan",
  "Hong Kong",
  "India",
  "Australia",
  "Selandia Baru",
  "Amerika Serikat",
  "Kanada",
  "Inggris",
  "Jerman",
  "Belanda",
  "Prancis",
  "Italia",
  "Swiss",
  "Arab Saudi",
  "Uni Emirat Arab",
  "Lainnya",
]

const Step3KondisiPerusahaan: React.FC<Step3KondisiPerusahaanProps> = ({ onNext, onBack, hideButtons }) => {
  const [pabrikList, setPabrikList] = useState<PabrikItem[]>([emptyPabrik(Date.now())])

  const addPabrik = () => {
    setPabrikList((prev) => [...prev, emptyPabrik(Date.now())])
  }

  const removePabrik = (idToRemove: number) => {
    if (pabrikList.length > 1) {
      setPabrikList((prev) => prev.filter((p) => p.id !== idToRemove))
    }
  }

  const updatePabrik = (idToUpdate: number, field: keyof PabrikItem, value: any) => {
    setPabrikList((prev) =>
      prev.map((p) => (p.id === idToUpdate ? { ...p, [field]: value } : p))
    )
  }
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Kondisi Perusahaan</h3>
        <p className="text-xs text-slate-500 mt-1">
          Silakan lengkapi data mengenai kondisi perusahaan Anda.
        </p>
      </div>

      {/* Form Data Perusahaan */}
      <div className="w-full bg-slate-50 p-6 rounded-xl border border-slate-200 transition-all">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
          <h4 className="text-md font-bold text-slate-900">
            Data Perusahaan
          </h4>
        </div>

        <div className="grid gap-x-6 gap-y-4">

          {/* Nama Perusahaan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Nama Perusahaan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
            />
          </div>

          {/* Nomor Akta Pendirian */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Nomor Akta Pendirian <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
            />
          </div>

          {/* Nama Pemilik */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Nama Pemilik <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
            />
          </div>

          {/* Nama Pimpinan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Nama Pimpinan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
            />
          </div>

          {/* Nama Wakil Manajemen */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Nama Wakil Manajemen <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
            />
          </div>

          {/* Telp (Perusahaan) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Telp (Perusahaan) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
            />
          </div>

          {/* Fax */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Fax <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
            />
          </div>

          {/* Nomor HP (CP) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Nomor HP (CP) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
            />
          </div>

          {/* Badan Hukum */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Badan Hukum <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
            />
          </div>

          {/* Jenis Perusahaan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Jenis Perusahaan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Data Lokasi */}
      <div className="w-full bg-slate-50 p-6 rounded-xl border border-slate-200 transition-all">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
          <h4 className="text-md font-bold text-slate-900">
            Data Lokasi Perusahaan
          </h4>
        </div>

        <div className="grid gap-x-6 gap-y-4">

          {/* Negara */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Negara <span className="text-rose-500">*</span>
            </label>
            <select
              defaultValue="Indonesia"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
            >
              <option value="">-- Pilih Negara --</option>
              {[
                "Indonesia",
                "Malaysia",
                "Singapura",
                "Thailand",
                "Vietnam",
                "Filipina",
                "Brunei Darussalam",
                "Kamboja",
                "Laos",
                "Myanmar",
                "Jepang",
                "Korea Selatan",
                "Tiongkok",
                "Taiwan",
                "Hong Kong",
                "India",
                "Australia",
                "Selandia Baru",
                "Amerika Serikat",
                "Kanada",
                "Inggris",
                "Jerman",
                "Belanda",
                "Prancis",
                "Italia",
                "Swiss",
                "Arab Saudi",
                "Uni Emirat Arab",
                "Lainnya",
              ].map((negara) => (
                <option key={negara} value={negara}>
                  {negara}
                </option>
              ))}
            </select>
          </div>

          {/* Provinsi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Provinsi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Jawa Timur / D.I. Yogyakarta"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
            />
          </div>

          {/* Kabupaten / Kota */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Kabupaten / Kota <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Kota Yogyakarta / Kab. Sleman"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
            />
          </div>

          {/* Kecamatan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Kecamatan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Umbulharjo"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
            />
          </div>

          {/* Alamat Lengkap */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Alamat Lengkap <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Contoh: Jl. Sokonandi No. 9, Semaki"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
            />
          </div>

          {/* Luas Tanah */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Luas Tanah (m²) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Contoh: 1500"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
            />
          </div>

          {/* Luas Bangunan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Luas Bangunan (m²) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Contoh: 800"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Data Operasional */}
      <div className="w-full bg-slate-50 p-6 rounded-xl border border-slate-200 transition-all space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h4 className="text-md font-bold text-slate-900">
            Data Operasional
          </h4>
        </div>

        <div className="space-y-4">
          {/* 18. Jumlah Shift */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              umlah Shift (dalam sehari) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder=""
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
            />
          </div>

          {/* 19. Jumlah Bagian */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Jumlah Bagian <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              defaultValue={0}
              placeholder="0"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
            />
          </div>

          {/* 20. Jumlah Karyawan */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-3">
              Jumlah Karyawan <span className="text-rose-500">*</span> :
            </label>

            <div className="space-y-3">
              {/* 1. Manajemen */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-600 font-medium w-5 text-right">1.</span>
                <div className="flex-1 flex rounded-lg border border-slate-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 shadow-2xs">
                  <span className="inline-flex items-center px-4 py-2 bg-slate-50 border-r border-slate-200 text-xs font-medium text-slate-700 min-w-[130px]">
                    Manajemen
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Berapa orang ?"
                    className="flex-1 px-3.5 py-2 text-sm outline-none text-slate-800 bg-transparent"
                  />
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border-l border-slate-200 text-xs font-medium text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    Orang
                  </span>
                </div>
              </div>

              {/* 2. Administrasi */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-600 font-medium w-5 text-right">2.</span>
                <div className="flex-1 flex rounded-lg border border-slate-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 shadow-2xs">
                  <span className="inline-flex items-center px-4 py-2 bg-slate-50 border-r border-slate-200 text-xs font-medium text-slate-700 min-w-[130px]">
                    Administrasi
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Berapa orang ?"
                    className="flex-1 px-3.5 py-2 text-sm outline-none text-slate-800 bg-transparent"
                  />
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border-l border-slate-200 text-xs font-medium text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    Orang
                  </span>
                </div>
              </div>

              {/* 3. Part Time */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-600 font-medium w-5 text-right">3.</span>
                <div className="flex-1 flex rounded-lg border border-slate-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 shadow-2xs">
                  <span className="inline-flex items-center px-4 py-2 bg-slate-50 border-r border-slate-200 text-xs font-medium text-slate-700 min-w-[130px]">
                    Part Time
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Berapa orang ?"
                    className="flex-1 px-3.5 py-2 text-sm outline-none text-slate-800 bg-transparent"
                  />
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border-l border-slate-200 text-xs font-medium text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    Orang
                  </span>
                </div>
              </div>

              {/* 4. Operasional */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 font-medium w-5 text-right">4.</span>
                  <span className="text-xs font-semibold text-slate-700">
                    Operasional <span className="text-rose-500">*</span> :
                  </span>
                </div>

                <div className="pl-8 space-y-2.5">
                  {/* Shift 1 */}
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs">▪</span>
                    <div className="flex-1 flex rounded-lg border border-slate-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 shadow-2xs">
                      <span className="inline-flex items-center px-4 py-2 bg-slate-50 border-r border-slate-200 text-xs font-medium text-slate-700 min-w-[110px]">
                        Shift 1
                      </span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Berapa orang ?"
                        className="flex-1 px-3.5 py-2 text-sm outline-none text-slate-800 bg-transparent"
                      />
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border-l border-slate-200 text-xs font-medium text-slate-600">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        Orang
                      </span>
                    </div>
                  </div>

                  {/* Shift 2 */}
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs">▪</span>
                    <div className="flex-1 flex rounded-lg border border-slate-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 shadow-2xs">
                      <span className="inline-flex items-center px-4 py-2 bg-slate-50 border-r border-slate-200 text-xs font-medium text-slate-700 min-w-[110px]">
                        Shift 2
                      </span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Berapa orang ?"
                        className="flex-1 px-3.5 py-2 text-sm outline-none text-slate-800 bg-transparent"
                      />
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border-l border-slate-200 text-xs font-medium text-slate-600">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        Orang
                      </span>
                    </div>
                  </div>

                  {/* Shift 3 */}
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs">▪</span>
                    <div className="flex-1 flex rounded-lg border border-slate-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 shadow-2xs">
                      <span className="inline-flex items-center px-4 py-2 bg-slate-50 border-r border-slate-200 text-xs font-medium text-slate-700 min-w-[110px]">
                        Shift 3
                      </span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Berapa orang ?"
                        className="flex-1 px-3.5 py-2 text-sm outline-none text-slate-800 bg-transparent"
                      />
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border-l border-slate-200 text-xs font-medium text-slate-600">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        Orang
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Non Permanen */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-600 font-medium w-5 text-right">5.</span>
                <div className="flex-1 flex rounded-lg border border-slate-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 shadow-2xs">
                  <span className="inline-flex items-center px-4 py-2 bg-slate-50 border-r border-slate-200 text-xs font-medium text-slate-700 min-w-[130px]">
                    Non Permanen
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Berapa orang ?"
                    className="flex-1 px-3.5 py-2 text-sm outline-none text-slate-800 bg-transparent"
                  />
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border-l border-slate-200 text-xs font-medium text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    Orang
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Data Pabrik */}
      <div className="w-full bg-slate-50 p-6 rounded-xl border border-slate-200 transition-all space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div>
            <h4 className="text-md font-bold text-slate-900">
              Data Pabrik
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              22. Detail Lokasi Pabrik <span className="text-rose-500">*</span> :
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 font-semibold text-xs rounded-full self-start sm:self-center border border-brand-200">
            <Building2 className="w-3.5 h-3.5" />
            {pabrikList.length} Pabrik Terdaftar
          </span>
        </div>

        {/* Daftar Kartu Pabrik */}
        <div className="space-y-6">
          {pabrikList.map((pabrik, index) => (
            <div
              key={pabrik.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-700 text-xs font-bold flex items-center justify-center border border-brand-200">
                    {index + 1}
                  </span>
                  <h5 className="text-sm font-bold text-slate-800">
                    {pabrik.namaPabrik ? pabrik.namaPabrik : `Pabrik ${index + 1}`}
                  </h5>
                </div>

                {pabrikList.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removePabrik(pabrik.id)}
                    leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                    className="h-7 text-xs px-3"
                  >
                    Delete
                  </Button>
                )}
              </div>

              {/* Form Input Baris-per-Baris Sesuai Desain */}
              <div className="space-y-3">
                {/* Nama Pabrik */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
                  <label className="text-xs font-semibold text-slate-700">
                    Nama Pabrik <span className="text-rose-500">*</span>
                  </label>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Pabrik - (silakan isi nama pabrik)"
                      value={pabrik.namaPabrik}
                      onChange={(e) => updatePabrik(pabrik.id, "namaPabrik", e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                    />
                  </div>
                </div>

                {/* No Telp */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
                  <label className="text-xs font-semibold text-slate-700">
                    No Telp
                  </label>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="-"
                      value={pabrik.noTelp}
                      onChange={(e) => updatePabrik(pabrik.id, "noTelp", e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                    />
                  </div>
                </div>

                {/* No HP */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
                  <label className="text-xs font-semibold text-slate-700">
                    No HP
                  </label>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="-"
                      value={pabrik.noHp}
                      onChange={(e) => updatePabrik(pabrik.id, "noHp", e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                    />
                  </div>
                </div>

                {/* Fax */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
                  <label className="text-xs font-semibold text-slate-700">
                    Fax
                  </label>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="-"
                      value={pabrik.fax}
                      onChange={(e) => updatePabrik(pabrik.id, "fax", e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                    />
                  </div>
                </div>

                {/* Negara */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
                  <label className="text-xs font-semibold text-slate-700">
                    Negara <span className="text-rose-500">*</span>
                  </label>
                  <div className="sm:col-span-3">
                    <select
                      value={pabrik.negara}
                      onChange={(e) => updatePabrik(pabrik.id, "negara", e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                    >
                      <option value="">-- Pilih Negara --</option>
                      {daftarNegaraPabrik.map((neg) => (
                        <option key={neg} value={neg}>
                          {neg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Kode Pos */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
                  <label className="text-xs font-semibold text-slate-700">
                    Kode Pos
                  </label>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="-"
                      value={pabrik.kodePos}
                      onChange={(e) => updatePabrik(pabrik.id, "kodePos", e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                    />
                  </div>
                </div>

                {/* Alamat Pabrik */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-start">
                  <label className="text-xs font-semibold text-slate-700 pt-2">
                    Alamat Pabrik <span className="text-rose-500">*</span>
                  </label>
                  <div className="sm:col-span-3">
                    <textarea
                      rows={2}
                      placeholder="-"
                      value={pabrik.alamatPabrik}
                      onChange={(e) => updatePabrik(pabrik.id, "alamatPabrik", e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                    />
                  </div>
                </div>

                {/* Jumlah Karyawan */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
                  <label className="text-xs font-semibold text-slate-700">
                    Jumlah Karyawan
                  </label>
                  <div className="sm:col-span-3">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={pabrik.jumlahKaryawan}
                      onChange={(e) => updatePabrik(pabrik.id, "jumlahKaryawan", e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                    />
                  </div>
                </div>

                {/* Kegiatan Utama */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-start">
                  <label className="text-xs font-semibold text-slate-700 pt-2">
                    Kegiatan Utama
                  </label>
                  <div className="sm:col-span-3">
                    <textarea
                      rows={2}
                      placeholder="-"
                      value={pabrik.kegiatanUtama}
                      onChange={(e) => updatePabrik(pabrik.id, "kegiatanUtama", e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                    />
                  </div>
                </div>

                {/* Luas Tanah */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
                  <label className="text-xs font-semibold text-slate-700">
                    Luas Tanah
                  </label>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="-"
                      value={pabrik.luasTanah}
                      onChange={(e) => updatePabrik(pabrik.id, "luasTanah", e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                    />
                  </div>
                </div>

                {/* Luas Bangunan */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
                  <label className="text-xs font-semibold text-slate-700">
                    Luas Bangunan
                  </label>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="-"
                      value={pabrik.luasBangunan}
                      onChange={(e) => updatePabrik(pabrik.id, "luasBangunan", e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                    />
                  </div>
                </div>

                {/* Tombol Delete di bawah kanan */}
                {pabrikList.length > 1 && (
                  <div className="flex justify-end pt-2">
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removePabrik(pabrik.id)}
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      className="text-xs px-4 bg-rose-600 hover:bg-rose-700"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Tambah Pabrik */}
        <div className="pt-2 flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={addPabrik}
            leftIcon={<Plus className="w-4 h-4" />}
            className="border-dashed border-2 text-brand-600 border-brand-200 hover:border-brand-400 hover:bg-brand-50 text-xs px-6 py-2.5"
          >
            Tambah Data Pabrik
          </Button>
        </div>

        {/* Section: Formulir Kelengkapan Permohonan */}
        <div className="w-full bg-slate-50 p-6 rounded-xl border border-slate-200 transition-all space-y-4">
          <div className="pb-3 border-b border-slate-200">
            <h4 className="text-md font-bold text-slate-900">
              Formulir Kelengkapan Permohonan
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              23. Lengkapi formulir berikut dan upload kembali dibawah :
            </p>
          </div>

          {/* Daftar Link Download Template */}
          <div className="space-y-2 pl-2">
            <div>
              <a
                href="/files/pengajuan/sertifikasi/form-1-permohonan-sertifikasi.docx"
                download
                className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-800 hover:underline font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                (Form 1 Permohonan Sertifikasi)
              </a>
            </div>

            <div>
              <a
                href="/files/pengajuan/sertifikasi/form-2-kondisi-umum-perusahaan.docx"
                download
                className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-800 hover:underline font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                (Form 2 Kondisi Umum Perusahaan)
              </a>
            </div>

            <div>
              <a
                href="/files/pengajuan/sertifikasi/form-3-surat-pernyataan-perusahaan.docx"
                download
                className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-800 hover:underline font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                (Form 3 Surat Pernyataan Perusahaan)
              </a>
            </div>
          </div>

          {/* Area Upload File Gabungan PDF */}
          <div className="pt-3">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Upload Berkas Gabungan <span className="text-rose-500">*</span>
            </label>

            <input
              type="file"
              accept=".pdf"
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer bg-white p-2 border border-slate-300 rounded-lg"
            />

            <p className="text-[11px] text-slate-500 mt-1.5">
              Upload file (Harap scan <strong>form 1</strong>, <strong>form 2</strong>, dan <strong>form 3</strong> digabung dengan format <strong>PDF</strong>)
            </p>
          </div>
        </div>

      </div>

      {!hideButtons && (
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onBack} className="px-6">
            Kembali
          </Button>
          <Button type="button" onClick={onNext} className="px-6">
            Selanjutnya
          </Button>
        </div>
      )}
    </div>
  )
}

export default Step3KondisiPerusahaan
