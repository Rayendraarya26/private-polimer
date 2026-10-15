import React from 'react'
import {
  Boxes,
  Package,
  Layers,
  Info,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card'
import { PbaProductItem } from '../../../types/pba'

interface Step2ProdukBahanAcuanProps {
  catalog: PbaProductItem[]
  produkPesanan: string
  setProdukPesanan: (val: string) => void
  produkLainnya: string
  setProdukLainnya: (val: string) => void
  jumlah: number
  setJumlah: React.Dispatch<React.SetStateAction<number>>
  satuan: string
  catatan: string
  setCatatan: (val: string) => void
}

export const Step2ProdukBahanAcuan: React.FC<Step2ProdukBahanAcuanProps> = ({
  catalog,
  produkPesanan,
  setProdukPesanan,
  produkLainnya,
  setProdukLainnya,
  jumlah,
  setJumlah,
  satuan,
  catatan,
  setCatatan,
}) => {
  return (
    <Card className="border-brand-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <Boxes className="w-4 h-4 text-brand-600" />
              2. Pilihan Produk Bahan Acuan & Kuantitas
            </CardTitle>
            <CardDescription>
              Pilih standar material acuan (CRM) terakreditasi ISO 17034 yang dipesan sesuai kebutuhan pengujian laboratorium Anda
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Banner Referensi Form Google & Akreditasi */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800 leading-relaxed">
            <p className="font-semibold mb-0.5">CV Rubber Standar Material untuk Uji PO/PRI 2026</p>
            <p>
              Plastisitas dan Viskositas Mooney — Material acuan standar tersertifikasi ISO 17034 oleh Komite Akreditasi Nasional (KAN) untuk kalibrasi serta verifikasi unjuk kerja metode pengujian karet secara nasional.
            </p>
          </div>
        </div>

        {/* Sub-bagian 1: Pilihan Produk Bahan Acuan */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Katalog Bahan Acuan yang Dipesan <span className="text-rose-500">*</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Pilih salah satu spesifikasi material acuan standar resmi BBSPJIKKP
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {catalog.map((item) => {
              const isSelected = produkPesanan === item.nama
              return (
                <div
                  key={item.id}
                  onClick={() => setProdukPesanan(item.nama)}
                  className={`relative cursor-pointer rounded-xl border p-4 transition-all duration-150 flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isSelected ? 'bg-white shadow-xs' : 'bg-slate-100'}`}>
                      <Boxes className={`w-5 h-5 ${isSelected ? 'text-brand-600' : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.nama}</h4>
                        {item.standar && (
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            {item.standar}
                          </span>
                        )}
                      </div>
                      {item.deskripsi && (
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.deskripsi}</p>
                      )}
                    </div>
                  </div>

                  {/* Radio Circle Indicator (Pixel-perfect centered white circle inside blue) */}
                  <div
                    className={`relative w-5 h-5 rounded-full shrink-0 mt-0.5 transition-all ${
                      isSelected
                        ? 'bg-brand-600 shadow-2xs'
                        : 'border-2 border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white block" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Input Spesifikasi Kustom jika 'Yang lain' */}
          {produkPesanan === 'Yang lain' && (
            <div className="p-4 rounded-xl bg-white border border-brand-200 space-y-1.5 animate-in fade-in-50 duration-200">
              <label className="block text-xs font-semibold text-slate-700">
                Sebutkan Spesifikasi Bahan Acuan yang Dibutuhkan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Standar Kalibrasi Mooney Viscometer Type B"
                value={produkLainnya}
                onChange={(e) => setProdukLainnya(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>
          )}
        </div>

        {/* Sub-bagian 2: Kuantitas & Catatan Tambahan */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Jumlah Pesanan & Catatan Tambahan
              </h4>
              <p className="text-[11px] text-slate-500">
                Tentukan kuantitas unit sampel dan instruksi khusus (jika ada)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jumlah yang Dipesan <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  required
                  value={jumlah}
                  onChange={(e) => setJumlah(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-28 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
                />
                <span className="text-xs text-slate-600 font-medium">{satuan}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Catatan / Instruksi Tambahan (Opsional)
              </label>
              <input
                type="text"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Catatan sertifikat CoA, instruksi pengemasan, dll."
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Step2ProdukBahanAcuan
