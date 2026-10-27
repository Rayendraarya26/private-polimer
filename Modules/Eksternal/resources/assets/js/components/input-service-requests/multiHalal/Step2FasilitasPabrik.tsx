import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { FormHalalPayload, PabrikItem, OutletItem } from "../../../types/halal"
import {
  FormField,
  TextInput,
  SelectInput,
  DropzoneUploader,
} from "../../forms"
import {
  Factory,
  Store,
  Plus,
  Trash2,
  Upload,
  FileText,
  MapPin,
  Copy,
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

  const handleDuplicatePabrik = () => {
    const list = payload.dataFasilitas.pabrik
    if (list.length === 0) return
    const last = list[list.length - 1]
    const duplicated: PabrikItem = {
      id: `pabrik-${Date.now()}`,
      nama: last.nama ? `${last.nama} (Salinan)` : "",
      alamat: last.alamat || "",
      status_pabrik: last.status_pabrik || "Milik Sendiri",
    }
    onChange((prev) => ({
      ...prev,
      dataFasilitas: {
        ...prev.dataFasilitas,
        pabrik: [...prev.dataFasilitas.pabrik, duplicated],
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddPabrik}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Fasilitas</span>
              </button>
              {payload.dataFasilitas.pabrik.length > 0 && (
                <button
                  type="button"
                  onClick={handleDuplicatePabrik}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplikat #{payload.dataFasilitas.pabrik.length}</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {payload.dataFasilitas.pabrik.map((pabrik, idx) => (
              <div
                key={pabrik.id}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
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
                    <FormField label="Nama Pabrik / Dapur / Fasilitas" required>
                      <TextInput
                        placeholder="Contoh: Dapur Produksi Sentra Sleman"
                        value={pabrik.nama}
                        onChange={(e) => handleUpdatePabrik(pabrik.id, "nama", e.target.value)}
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField label="Status Kepemilikan">
                      <SelectInput
                        value={pabrik.status_pabrik}
                        onChange={(val) => handleUpdatePabrik(pabrik.id, "status_pabrik", String(val))}
                        options={[
                          { value: "Milik Sendiri", label: "Milik Sendiri" },
                          { value: "Sewa", label: "Sewa / Kontrak" },
                          { value: "Kerjasama", label: "Kerjasama Maklon" },
                        ]}
                      />
                    </FormField>
                  </div>

                  <div className="sm:col-span-3">
                    <FormField label="Alamat Lengkap Fasilitas" required>
                      <TextInput
                        placeholder="Alamat lengkap lokasi pengolahan/dapur..."
                        value={pabrik.alamat}
                        onChange={(e) => handleUpdatePabrik(pabrik.id, "alamat", e.target.value)}
                      />
                    </FormField>
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
                  className="p-3.5 rounded-xl border border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-12 gap-3 items-end shadow-2xs"
                >
                  <div className="sm:col-span-5">
                    <FormField label="Nama Outlet">
                      <TextInput
                        placeholder="Contoh: Outlet Bandara YIA"
                        value={outlet.nama}
                        onChange={(e) => handleUpdateOutlet(outlet.id, "nama", e.target.value)}
                      />
                    </FormField>
                  </div>

                  <div className="sm:col-span-6">
                    <FormField label="Alamat Outlet">
                      <TextInput
                        placeholder="Alamat lengkap outlet..."
                        value={outlet.alamat}
                        onChange={(e) => handleUpdateOutlet(outlet.id, "alamat", e.target.value)}
                      />
                    </FormField>
                  </div>

                  <div className="sm:col-span-1 flex justify-end pb-1">
                    <button
                      type="button"
                      onClick={() => handleRemoveOutlet(outlet.id)}
                      className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors"
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

          <DropzoneUploader
            label="Berkas Denah Ruang Produksi"
            helperText="Format PDF/JPG/PNG maksimal 10 MB. Boleh berupa foto sketsa alur gambar tangan yang jelas."
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={10}
            value={payload.file_denah_lokasi}
            onChange={(file) => onChange((prev) => ({ ...prev, file_denah_lokasi: file }))}
          />
        </div>
      </CardContent>
    </Card>
  )
}
