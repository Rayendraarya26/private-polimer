import React, { useState, useEffect } from 'react'
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
  CheckCircle2,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card'
import { RegionBase } from '../../../services/region-service'
import { useProfileQuery } from '../../../hooks/queries/useProfileQuery'
import { FormField, TextInput, TextareaInput, SelectInput } from '../../forms'

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
  const { profile } = useProfileQuery()
  const detail = (profile?.detail || {}) as Record<string, any>
  const alamatPabrik = detail?.alamat_pabrik || detail?.pabrik_alamat || ''

  const [opsiAlamatKirim, setOpsiAlamatKirim] = useState<'pemohon' | 'pabrik' | 'manual'>(() => {
    if (sameAsCompanyAddress) return 'pemohon'
    if (alamatPengiriman && alamatPengiriman === alamatPabrik) return 'pabrik'
    if (alamatPengiriman && alamatPengiriman !== alamatPerusahaan) return 'manual'
    return 'pemohon'
  })

  const handleSelectOpsiAlamat = (opsi: 'pemohon' | 'pabrik' | 'manual') => {
    setOpsiAlamatKirim(opsi)

    if (opsi === 'pemohon') {
      setSameAsCompanyAddress(true)
      setAlamatPengiriman(alamatPerusahaan)
      if (detail?.prov_id && !selectedProvId) {
        setSelectedProvId(String(detail.prov_id))
      }
      if (detail?.kab_id && !selectedKabId) {
        setSelectedKabId(String(detail.kab_id))
      }
    } else if (opsi === 'pabrik') {
      setSameAsCompanyAddress(false)
      setAlamatPengiriman(alamatPabrik)
    } else {
      setSameAsCompanyAddress(false)
      if (alamatPengiriman === alamatPerusahaan || (alamatPabrik && alamatPengiriman === alamatPabrik)) {
        setAlamatPengiriman('')
      }
    }
  }

  // Sinkronisasi jika alamatPerusahaan berubah saat opsi pemohon aktif
  useEffect(() => {
    if (opsiAlamatKirim === 'pemohon') {
      setAlamatPengiriman(alamatPerusahaan)
    }
  }, [alamatPerusahaan, opsiAlamatKirim, setAlamatPengiriman])

  // Sinkronisasi jika parent mengubah sameAsCompanyAddress (misalnya saat tombol reset profil diklik)
  useEffect(() => {
    if (sameAsCompanyAddress && opsiAlamatKirim !== 'pemohon') {
      setOpsiAlamatKirim('pemohon')
    }
  }, [sameAsCompanyAddress, opsiAlamatKirim])

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
            <FormField label="Nama Perusahaan / Lembaga" required>
              <TextInput
                placeholder="Contoh: PT. Industri Karet Standar Nasional"
                value={namaPerusahaan}
                onChange={(e) => setNamaPerusahaan(e.target.value)}
                leftIcon={<Building2 className="w-4 h-4 text-slate-400" />}
              />
            </FormField>

            <FormField label="Alamat Perusahaan (Kantor/Legal)" required>
              <TextareaInput
                rows={2}
                placeholder="Alamat kantor pusat / badan usaha pemohon"
                value={alamatPerusahaan}
                onChange={(e) => setAlamatPerusahaan(e.target.value)}
              />
            </FormField>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nama Narahubung" required>
              <TextInput
                placeholder="Nama lengkap PIC"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                leftIcon={<User className="w-4 h-4 text-slate-400" />}
              />
            </FormField>

            <FormField label="No. WhatsApp / HP" required>
              <TextInput
                type="tel"
                placeholder="Contoh: 08123456789"
                value={noKontak}
                onChange={(e) => setNoKontak(e.target.value)}
                leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Email Aktif" required>
                <TextInput
                  type="email"
                  placeholder="pic@perusahaan.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Sub-bagian 3: Alamat Tujuan Pengiriman Ekspedisi */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                Alamat Tujuan Pengiriman Ekspedisi Bahan Acuan <span className="text-rose-500">*</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Tentukan penerima dan alamat tujuan pengiriman fisik paket standar material (CRM)
              </p>
            </div>
          </div>

          {/* Opsi Pilihan Alamat */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Pilihan Alamat Pengiriman:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Opsi 1: Sesuai Alamat Pemohon */}
              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  opsiAlamatKirim === 'pemohon'
                    ? 'bg-brand-50/80 border-brand-500 ring-2 ring-brand-500/20 text-brand-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="opsiAlamatKirimPba"
                  value="pemohon"
                  checked={opsiAlamatKirim === 'pemohon'}
                  onChange={() => handleSelectOpsiAlamat('pemohon')}
                  className="mt-0.5 text-brand-600 focus:ring-brand-500 border-slate-300"
                />
                <div className="text-xs min-w-0">
                  <span className="font-semibold block text-slate-800">Sesuai Alamat Pemohon</span>
                  <span className="text-[11px] text-slate-500 truncate block">
                    {alamatPerusahaan || 'Gunakan alamat perusahaan pemohon di atas'}
                  </span>
                </div>
              </label>

              {/* Opsi 2: Sesuai Alamat Pabrik */}
              {alamatPabrik && (
                <label
                  className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                    opsiAlamatKirim === 'pabrik'
                      ? 'bg-brand-50/80 border-brand-500 ring-2 ring-brand-500/20 text-brand-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="opsiAlamatKirimPba"
                    value="pabrik"
                    checked={opsiAlamatKirim === 'pabrik'}
                    onChange={() => handleSelectOpsiAlamat('pabrik')}
                    className="mt-0.5 text-brand-600 focus:ring-brand-500 border-slate-300"
                  />
                  <div className="text-xs min-w-0">
                    <span className="font-semibold block text-slate-800">Sesuai Alamat Pabrik</span>
                    <span className="text-[11px] text-slate-500 truncate block">{alamatPabrik}</span>
                  </div>
                </label>
              )}

              {/* Opsi 3: Alamat Lainnya / Manual */}
              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  opsiAlamatKirim === 'manual'
                    ? 'bg-brand-50/80 border-brand-500 ring-2 ring-brand-500/20 text-brand-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="opsiAlamatKirimPba"
                  value="manual"
                  checked={opsiAlamatKirim === 'manual'}
                  onChange={() => handleSelectOpsiAlamat('manual')}
                  className="mt-0.5 text-brand-600 focus:ring-brand-500 border-slate-300"
                />
                <div className="text-xs min-w-0">
                  <span className="font-semibold block text-slate-800">Alamat Lainnya (Kustom)</span>
                  <span className="text-[11px] text-slate-500 block">Ketik alamat pengiriman lain</span>
                </div>
              </label>
            </div>
          </div>

          {/* Tampilan Kondisional Berdasarkan Opsi yang Dipilih */}
          {opsiAlamatKirim === 'pemohon' && (
            <div className="rounded-xl border border-brand-200/90 bg-brand-50/40 p-4 space-y-3 animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-900">
                <span>Paket bahan acuan / CRM akan dikirimkan ke alamat pemohon:</span>
              </div>
              <div className="bg-white rounded-lg p-3 border border-brand-100/80 text-xs space-y-1.5 shadow-xs">
                <div className="flex items-start gap-2">
                  <span className="text-slate-500 w-36 shrink-0">Nama Penerima:</span>
                  <span className="font-semibold text-slate-800">
                    {namaPerusahaan || contactPerson || '-'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-500 w-36 shrink-0">Alamat Pengiriman:</span>
                  <span className="text-slate-700 leading-relaxed">
                    {alamatPerusahaan || '(Alamat perusahaan belum diisi pada form di atas)'}
                  </span>
                </div>
                {contactPerson && (
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 w-36 shrink-0">Kontak Penerima (PIC):</span>
                    <span className="text-slate-700">
                      {contactPerson} {noKontak ? `(${noKontak})` : ''}
                    </span>
                  </div>
                )}
                {(selectedProvId || selectedKabId) && (
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 w-36 shrink-0">Wilayah Tujuan:</span>
                    <span className="text-slate-700">
                      {[
                        regencies.find((k) => String(k.id) === String(selectedKabId))?.nama,
                        provinces.find((p) => String(p.id) === String(selectedProvId))?.nama,
                      ]
                        .filter(Boolean)
                        .join(', ') || '-'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {opsiAlamatKirim === 'pabrik' && (
            <div className="rounded-xl border border-brand-200/90 bg-brand-50/40 p-4 space-y-3 animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Paket bahan acuan / CRM akan dikirimkan ke alamat pabrik:</span>
              </div>
              <div className="bg-white rounded-lg p-3 border border-brand-100/80 text-xs space-y-1.5 shadow-xs">
                <div className="flex items-start gap-2">
                  <span className="text-slate-500 w-36 shrink-0">Nama Penerima:</span>
                  <span className="font-semibold text-slate-800">
                    {namaPerusahaan || contactPerson || '-'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-500 w-36 shrink-0">Alamat Pabrik:</span>
                  <span className="text-slate-700 leading-relaxed">{alamatPabrik}</span>
                </div>
                {contactPerson && (
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 w-36 shrink-0">Kontak Penerima (PIC):</span>
                    <span className="text-slate-700">
                      {contactPerson} {noKontak ? `(${noKontak})` : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {opsiAlamatKirim === 'manual' && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4 animate-in fade-in-50 duration-200">
              <FormField label="Alamat Lengkap Pengiriman" required>
                <TextareaInput
                  rows={3}
                  placeholder="Tuliskan detail alamat pengiriman: nama lab, gedung, jalan, nomor, RT/RW, dan kode pos..."
                  value={alamatPengiriman}
                  onChange={(e) => setAlamatPengiriman(e.target.value)}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Provinsi Tujuan Pengiriman"
                  helperText={loadingRegions ? 'Memuat data provinsi...' : undefined}
                >
                  <SelectInput
                    value={selectedProvId}
                    onChange={(val) => {
                      setSelectedProvId(String(val))
                      setSelectedKabId('')
                    }}
                    options={[
                      { value: '', label: '-- Pilih Provinsi --' },
                      ...provinces.map((p) => ({ value: String(p.id), label: p.nama })),
                    ]}
                  />
                </FormField>

                <FormField label="Kota / Kabupaten Tujuan Pengiriman">
                  <SelectInput
                    value={selectedKabId}
                    onChange={(val) => setSelectedKabId(String(val))}
                    disabled={!selectedProvId}
                    options={[
                      { value: '', label: '-- Pilih Kota/Kabupaten --' },
                      ...regencies.map((k) => ({ value: String(k.id), label: k.nama })),
                    ]}
                  />
                </FormField>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default Step1PerusahaanDanPengiriman
