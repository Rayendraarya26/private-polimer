import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { FormHalalPayload, PabrikItem, OutletItem } from "../../../types/halal"
import {
  Factory,
  Store,
  Plus,
  Trash2,
  Upload,
  FileText,
  MapPin,
} from "lucide-react"

interface Step2Props {
  payload: FormHalalPayload
  onChange: (updater: (prev: FormHalalPayload) => FormHalalPayload) => void
}

export const Step2FasilitasPabrik: React.FC<Step2Props> = ({ payload, onChange }) => {
  const handleAddPabrik = () => {
    const newPabrik: PabrikItem = {
      id: `pabrik-${Date.now()}`,
      nama: "",
      alamat: "",
      status_pabrik: "Milik Sendiri",
    }
    onChange((prev) => ({
      ...prev,
      dataFasilitas: {
        ...prev.dataFasilitas,
        pabrik: [...prev.dataFasilitas.pabrik, newPabrik],
      },
    }))
  }

  const handleRemovePabrik = (id: string) => {
    if (payload.dataFasilitas.pabrik.length <= 1) return
    onChange((prev) => ({
      ...prev,
      dataFasilitas: {
        ...prev.dataFasilitas,
        pabrik: prev.dataFasilitas.pabrik.filter((p) => p.id !== id),
      },
    }))
  }

  const handleUpdatePabrik = (id: string, field: keyof PabrikItem, val: string) => {
    onChange((prev) => ({
      ...prev,
      dataFasilitas: {
        ...prev.dataFasilitas,
        pabrik: prev.dataFasilitas.pabrik.map((p) =>
          p.id === id ? { ...p, [field]: val } : p
        ),
      },
    }))
  }

  const handleAddOutlet = () => {
    const newOutlet: OutletItem = {
      id: `outlet-${Date.now()}`,
      nama: "",
      alamat: "",
    }
    onChange((prev) => ({
      ...prev,
      dataFasilitas: {
        ...prev.dataFasilitas,
        outlet: [...(prev.dataFasilitas.outlet || []), newOutlet],
      },
    }))
  }

  const handleRemoveOutlet = (id: string) => {
    onChange((prev) => ({
      ...prev,
      dataFasilitas: {
        ...prev.dataFasilitas,
        outlet: (prev.dataFasilitas.outlet || []).filter((o) => o.id !== id),
      },
    }))
  }

  const handleUpdateOutlet = (id: string, field: keyof OutletItem, val: string) => {
    onChange((prev) => ({
      ...prev,
      dataFasilitas: {
        ...prev.dataFasilitas,
        outlet: (prev.dataFasilitas.outlet || []).map((o) =>
          o.id === id ? { ...o, [field]: val } : o
        ),
      },
    }))
  }

  return (
    <Card className="border-brand-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <Factory className="w-4 h-4 text-brand-600" />
              2. Fasilitas Produksi, Outlet & Denah Lokasi
            </CardTitle>
            <CardDescription>
              Daftarkan seluruh fasilitas tempat pengolahan/pabrik, gerai penjualan (outlet), serta tata letak denah produksi
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Section 1: Fasilitas Pabrik / Dapur Produksi */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
                <Factory className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                  Data Fasilitas Produksi (Pabrik / Dapur)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Daftar lokasi tempat pengolahan dan produksi produk halal
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddPabrik}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-white border border-brand-200 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Fasilitas</span>
            </button>
          </div>

          <div className="space-y-3">
            {payload.dataFasilitas.pabrik.map((pabrik, idx) => (
              <div
                key={pabrik.id}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    Fasilitas Produksi #{idx + 1}
                  </span>

                  {payload.dataFasilitas.pabrik.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePabrik(pabrik.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Hapus Fasilitas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Pabrik / Dapur / Fasilitas <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Dapur Produksi Sentra Sleman"
                      value={pabrik.nama}
                      onChange={(e) => handleUpdatePabrik(pabrik.id, "nama", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Status Kepemilikan
                    </label>
                    <select
                      value={pabrik.status_pabrik}
                      onChange={(e) => handleUpdatePabrik(pabrik.id, "status_pabrik", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="Milik Sendiri">Milik Sendiri</option>
                      <option value="Sewa">Sewa / Kontrak</option>
                      <option value="Kerjasama">Kerjasama Maklon</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Alamat Lengkap Fasilitas <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Alamat lengkap lokasi pengolahan/dapur..."
                      value={pabrik.alamat}
                      onChange={(e) => handleUpdatePabrik(pabrik.id, "alamat", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Outlet / Gerai Penjualan (Opsional) */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                  Data Outlet / Gerai Penjualan <span className="text-slate-400 font-normal">(opsional)</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Tambahkan jika produk dijual langsung melalui gerai/outlet milik sendiri
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddOutlet}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-white border border-brand-200 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Outlet</span>
            </button>
          </div>

          <div className="space-y-3">
            {(payload.dataFasilitas.outlet || []).length > 0 ? (
              payload.dataFasilitas.outlet.map((outlet) => (
                <div
                  key={outlet.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nama Outlet</label>
                    <input
                      type="text"
                      placeholder="Contoh: Outlet Bandara YIA"
                      value={outlet.nama}
                      onChange={(e) => handleUpdateOutlet(outlet.id, "nama", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="sm:col-span-7">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Alamat Outlet</label>
                    <input
                      type="text"
                      placeholder="Alamat lengkap outlet..."
                      value={outlet.alamat}
                      onChange={(e) => handleUpdateOutlet(outlet.id, "alamat", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="sm:col-span-1 flex justify-end pt-3 sm:pt-4">
                    <button
                      type="button"
                      onClick={() => handleRemoveOutlet(outlet.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors"
                      title="Hapus Outlet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-2">
                Belum ada outlet yang ditambahkan. Kosongkan jika penjualan dilakukan terpusat dari dapur/distributor.
              </p>
            )}
          </div>
        </div>

        {/* Section 3: Denah / Layout Ruang Produksi */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Denah / Layout Ruang Produksi <span className="text-slate-400 font-normal">(opsional)</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Unggah sketsa tata letak ruang penyimpanan bahan, area pengolahan, dan penyimpanan produk jadi
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  {payload.file_denah_lokasi
                    ? payload.file_denah_lokasi.name
                    : "Pilih file denah ruang produksi (PDF/JPG/PNG)"}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Maksimal 10 MB. Boleh berupa foto sketsa alur gambar tangan yang jelas.
                </span>
              </div>
            </div>

            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:border-brand-500 text-slate-700 text-xs font-semibold transition-colors shadow-2xs shrink-0">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>{payload.file_denah_lokasi ? "Ganti File" : "Unggah Denah"}</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  onChange((prev) => ({ ...prev, file_denah_lokasi: file }))
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
