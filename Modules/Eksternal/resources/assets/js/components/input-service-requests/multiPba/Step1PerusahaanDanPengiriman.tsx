import React from 'react'
import {
  Building2,
  UserCheck,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  Loader2,
  Info,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card'
import { RegionBase } from '../../../services/region-service'

interface Step1PerusahaanDanPengirimanProps {
  namaPerusahaan: string
  setNamaPerusahaan: (val: string) => void
  alamatPerusahaan: string
  setAlamatPerusahaan: (val: string) => void
  sameAsCompanyAddress: boolean
  setSameAsCompanyAddress: (val: boolean) => void
  alamatPengiriman: string
  setAlamatPengiriman: (val: string) => void
  selectedProvId: string
  setSelectedProvId: (val: string) => void
  selectedKabId: string
  setSelectedKabId: (val: string) => void
  provinces: RegionBase[]
  regencies: RegionBase[]
  loadingRegions: boolean
  contactPerson: string
  setContactPerson: (val: string) => void
  noKontak: string
  setNoKontak: (val: string) => void
  email: string
  setEmail: (val: string) => void
  onResetFromProfile?: () => void
}

export const Step1PerusahaanDanPengiriman: React.FC<Step1PerusahaanDanPengirimanProps> = ({
  namaPerusahaan,
  setNamaPerusahaan,
  alamatPerusahaan,
  setAlamatPerusahaan,
  sameAsCompanyAddress,
  setSameAsCompanyAddress,
  alamatPengiriman,
  setAlamatPengiriman,
  selectedProvId,
  setSelectedProvId,
  selectedKabId,
  setSelectedKabId,
  provinces,
  regencies,
  loadingRegions,
  contactPerson,
  setContactPerson,
  noKontak,
  setNoKontak,
  email,
  setEmail,
  onResetFromProfile,
}) => {
  return (
    <Card className="border-brand-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-3 block">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-base flex items-center gap-2 text-slate-800">
            <Building2 className="w-4 h-4 text-brand-600" />
            <span>1. Identitas Perusahaan & Alamat Pengiriman</span>
          </CardTitle>

          {onResetFromProfile && (
            <button
              type="button"
              onClick={onResetFromProfile}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-700 bg-white border border-brand-200 hover:bg-brand-50 hover:border-brand-300 transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-brand-600" />
              <span>Gunakan Profil Akun</span>
            </button>
          )}
        </div>

        <CardDescription className="mt-1 text-xs text-slate-500">
          Lengkapi identitas kantor/perusahaan pemohon, narahubung teknis (PIC), serta detail alamat tujuan ekspedisi pengiriman fisik bahan acuan
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Banner Alert Informasi */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800 leading-relaxed">
            <p className="font-semibold mb-0.5">Identitas Pemohon & Alamat Ekspedisi Bahan Acuan</p>
            <p>
              Data perusahaan otomatis disesuaikan dari profil akun Anda. Pastikan alamat pengiriman diisi secara detail dan tepat guna kelancaran pengiriman fisik material acuan standar oleh tim logistik BBSPJIKKP.
            </p>
          </div>
        </div>

        {/* Sub-bagian 1: Data Identitas Perusahaan */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Identitas Perusahaan / Lembaga Pemohon
              </h4>
              <p className="text-[11px] text-slate-500">
                Identitas resmi kantor atau badan usaha pemohon bahan acuan standar
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Perusahaan / Lembaga <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT. Industri Karet Standar Nasional"
                  value={namaPerusahaan}
                  onChange={(e) => setNamaPerusahaan(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alamat Perusahaan (Kantor/Legal) <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder="Alamat kantor pusat / badan usaha pemohon"
                value={alamatPerusahaan}
                onChange={(e) => setAlamatPerusahaan(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed resize-none"
              />
            </div>
          </div>
        </div>

        {/* Sub-bagian 2: Narahubung Teknis (PIC) */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Kontak Narahubung Teknis (PIC)
              </h4>
              <p className="text-[11px] text-slate-500">
                Personel penanggung jawab untuk koordinasi administrasi dan ekspedisi bahan acuan
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Narahubung <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap PIC"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                No. WhatsApp / HP <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 08123456789"
                  value={noKontak}
                  onChange={(e) => setNoKontak(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Aktif <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="pic@perusahaan.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sub-bagian 3: Alamat Tujuan Pengiriman Ekspedisi */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                  Alamat Tujuan Pengiriman Ekspedisi Bahan Acuan
                </h4>
                <p className="text-[11px] text-slate-500">
                  Tujuan ekspedisi pengiriman fisik paket standar material (CRM)
                </p>
              </div>
            </div>

            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition shadow-2xs shrink-0">
              <input
                type="checkbox"
                checked={sameAsCompanyAddress}
                onChange={(e) => {
                  const checked = e.target.checked
                  setSameAsCompanyAddress(checked)
                  if (checked) {
                    setAlamatPengiriman(alamatPerusahaan)
                  }
                }}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
              />
              <span>Sama dengan alamat perusahaan</span>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alamat Lengkap Pengiriman <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder="Tuliskan detail alamat pengiriman: nama lab, gedung, jalan, nomor, RT/RW, dan kode pos"
                value={alamatPengiriman}
                onChange={(e) => {
                  setAlamatPengiriman(e.target.value)
                  if (sameAsCompanyAddress) setSameAsCompanyAddress(false)
                }}
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Provinsi Tujuan Pengiriman</span>
                  {loadingRegions && <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <select
                    value={selectedProvId}
                    onChange={(e) => {
                      setSelectedProvId(e.target.value)
                      setSelectedKabId('')
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  >
                    <option value="">-- Pilih Provinsi --</option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kota / Kabupaten Tujuan Pengiriman
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <select
                    value={selectedKabId}
                    onChange={(e) => setSelectedKabId(e.target.value)}
                    disabled={!selectedProvId}
                    className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Pilih Kota/Kabupaten --</option>
                    {regencies.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Step1PerusahaanDanPengiriman
