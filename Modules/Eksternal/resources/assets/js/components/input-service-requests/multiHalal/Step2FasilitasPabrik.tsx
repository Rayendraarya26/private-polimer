import React from "react"
import { FormHalalPayload, PabrikItem, OutletItem } from "../../../types/halal"
import { DropzoneUploader } from "../../forms"
import { Button } from "../../ui/Button"
import {
  StepPanel,
  SectionHeading,
  FieldLabel,
  inputClass,
  selectClass,
} from "../common"
import {
  Building2,
  Plus,
  Trash2,
  Factory,
  Store,
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
    <StepPanel
      icon={Building2}
      title="Fasilitas Pabrik & Outlet"
      description="Daftarkan seluruh fasilitas tempat pengolahan/pabrik, gerai penjualan (outlet), serta tata letak denah produksi."
    >
      {/* 1. Fasilitas Pabrik / Dapur Produksi */}
      <div>
        <SectionHeading
          title="Data Fasilitas Produksi (Pabrik / Dapur)"
          required
          description="Daftar lokasi tempat pengolahan dan produksi produk halal."
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddPabrik}
              leftIcon={<Plus className="w-4 h-4 text-brand-600" />}
              className="text-xs h-9 px-3 rounded-lg border-brand-200 text-brand-700 bg-white hover:bg-brand-50 shadow-none shrink-0"
            >
              Tambah Fasilitas
            </Button>
          }
        />

        <div className="space-y-4">
          {payload.dataFasilitas.pabrik.map((pabrik, idx) => {
            const isDarker = idx % 2 === 1
            return (
              <div
                key={pabrik.id}
                className={`p-5 rounded-xl border border-slate-200 space-y-4 shadow-none transition-colors ${
                  isDarker ? "bg-slate-50/75" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <Factory className="w-4 h-4 text-brand-600" />
                    Fasilitas Produksi #{idx + 1}
                  </span>

                  {payload.dataFasilitas.pabrik.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePabrik(pabrik.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Hapus Fasilitas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Nama Pabrik / Dapur / Fasilitas</FieldLabel>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Contoh: Dapur Produksi Sentra Sleman"
                      value={pabrik.nama}
                      onChange={(e) => handleUpdatePabrik(pabrik.id, "nama", e.target.value)}
                    />
                  </div>

                  <div>
                    <FieldLabel>Status Kepemilikan</FieldLabel>
                    <select
                      className={selectClass}
                      value={pabrik.status_pabrik}
                      onChange={(e) => handleUpdatePabrik(pabrik.id, "status_pabrik", e.target.value)}
                    >
                      <option value="Milik Sendiri">Milik Sendiri</option>
                      <option value="Sewa">Sewa / Kontrak</option>
                      <option value="Kerjasama">Kerjasama Maklon</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <FieldLabel required>Alamat Lengkap Fasilitas</FieldLabel>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Alamat lengkap lokasi pengolahan/dapur..."
                      value={pabrik.alamat}
                      onChange={(e) => handleUpdatePabrik(pabrik.id, "alamat", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. Outlet / Gerai Penjualan */}
      <div className="pt-6 border-t border-slate-200">
        <SectionHeading
          title="Data Outlet / Gerai Penjualan"
          optional
          description="Tambahkan jika produk dijual langsung melalui gerai/outlet milik sendiri."
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOutlet}
              leftIcon={<Plus className="w-4 h-4 text-brand-600" />}
              className="text-xs h-9 px-3 rounded-lg border-brand-200 text-brand-700 bg-white hover:bg-brand-50 shadow-none shrink-0"
            >
              Tambah Outlet
            </Button>
          }
        />

        <div className="space-y-3">
          {(payload.dataFasilitas.outlet || []).length > 0 ? (
            payload.dataFasilitas.outlet.map((outlet, idx) => (
              <div
                key={outlet.id}
                className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white space-y-3 shadow-none"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <Store className="w-4 h-4 text-brand-600" />
                    Outlet #{idx + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoveOutlet(outlet.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Hapus Outlet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Nama Outlet</FieldLabel>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Contoh: Outlet Bandara YIA"
                      value={outlet.nama}
                      onChange={(e) => handleUpdateOutlet(outlet.id, "nama", e.target.value)}
                    />
                  </div>

                  <div>
                    <FieldLabel>Alamat Outlet</FieldLabel>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Alamat lengkap outlet..."
                      value={outlet.alamat}
                      onChange={(e) => handleUpdateOutlet(outlet.id, "alamat", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center bg-slate-50/50">
              <p className="text-xs text-slate-400 italic">
                Belum ada outlet yang ditambahkan. Kosongkan jika penjualan dilakukan terpusat dari dapur/distributor.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Denah / Layout Ruang Produksi */}
      <div className="pt-6 border-t border-slate-200">
        <SectionHeading
          title="Denah / Layout Ruang Produksi"
          optional
          description="Unggah sketsa tata letak ruang penyimpanan bahan, area pengolahan, dan penyimpanan produk jadi."
        />

        <DropzoneUploader
          label="Berkas Denah Ruang Produksi"
          helperText="Format PDF/JPG/PNG maksimal 10 MB. Boleh berupa foto sketsa alur gambar tangan yang jelas."
          accept=".pdf,.jpg,.jpeg,.png"
          maxSizeMB={10}
          value={payload.file_denah_lokasi}
          onChange={(file) => onChange((prev) => ({ ...prev, file_denah_lokasi: file }))}
        />
      </div>
    </StepPanel>
  )
}
