import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import {
  Building2,
  Package,
  CheckCircle2,
  MapPin,
  Sparkles,
  Phone,
  Mail,
  User,
  FileSignature,
  Wrench,
  ShieldCheck,
  Calendar,
  AlertCircle,
  ExternalLink,
} from "lucide-react"

interface PupDetailSectionProps {
  permohonan: any
  formPup: any
  formatIndoDate: (dateStr?: string | null, withTime?: boolean) => string
}

export const PupDetailPermohonanTab: React.FC<PupDetailSectionProps> = ({
  permohonan,
  formPup,
  formatIndoDate,
}) => {
  const skemaItems: any[] = Array.isArray(formPup?.items)
    ? formPup.items
    : Array.isArray(formPup?.skema_items)
      ? formPup.skema_items
      : []

  const equipment = typeof formPup?.konfirmasi_equipment === "string"
    ? JSON.parse(formPup.konfirmasi_equipment || "{}")
    : (formPup?.konfirmasi_equipment || {})

  const hasEquipmentData = equipment && Object.keys(equipment).length > 0

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header Banner Program Uji Profisiensi */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-900 via-brand-800 to-sky-900 text-white shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-brand-100 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Penyelenggara Uji Profisiensi Kalibrasi (LK-005-IDN)</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Program Uji Profisiensi (PUP) Tahun 2025
            </h3>
            <p className="text-xs text-brand-100/90 max-w-2xl leading-relaxed">
              Diselenggarakan oleh BBSPJIKKP Yogyakarta sesuai SNI ISO/IEC 17043 untuk menjamin keabsahan dan unjuk kerja laboratorium kalibrasi peserta.
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0 bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-xs">
            <span className="text-[11px] text-brand-200 block">Status Keikutsertaan</span>
            <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">
              {permohonan?.status_bayar === "LUNAS" ? "Peserta Terdaftar (Lunas)" : "Pendaftaran Diajukan"}
            </span>
            <span className="text-[10px] text-white/70 block mt-0.5">
              {skemaItems.length} Skema Terpilih
            </span>
          </div>
        </div>
      </div>

      {/* Rincian Skema Kalibrasi yang Diikuti */}
      <Card className="rounded-2xl border-slate-200 shadow-soft">
        <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
            <Package className="w-4 h-4 text-brand-600" />
            Skema Kalibrasi yang Diikuti ({skemaItems.length} Skema)
          </CardTitle>
          <span className="text-xs text-slate-500 font-medium">
            Periode Pendaftaran: <b>{formPup?.periode_pendaftaran || "EARLY_BIRD"}</b>
          </span>
        </CardHeader>
        <CardContent className="p-5 pt-4">
          {skemaItems.length > 0 ? (
            <div className="space-y-3">
              {skemaItems.map((item: any, idx: number) => {
                const isInSitu = Boolean(item.is_in_situ)
                return (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          {item.nama_skema || item.nama_produk || "Skema Kalibrasi"}
                        </span>
                        {item.kode_skema && (
                          <span className="font-mono text-[11px] bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                            {item.kode_skema}
                          </span>
                        )}
                        {isInSitu ? (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md text-[11px] font-bold border border-amber-200">
                            <MapPin className="w-3 h-3" />
                            In Situ (Yogyakarta)
                          </span>
                        ) : (
                          <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md text-[11px] font-medium border border-sky-200">
                            Sirkulasi Artefak
                          </span>
                        )}
                      </div>

                      {/* Standar Acuan Kalibrasi */}
                      <div className="pl-7">
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200/90 text-slate-600">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">
                            Metode / Standar Kalibrasi Acuan LK:
                          </span>
                          <span className="font-semibold text-brand-900">
                            {item.metode_kalibrasi_acuan || "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tarif PNBP */}
                    <div className="text-left md:text-right pl-7 md:pl-0 shrink-0">
                      <span className="text-[11px] text-slate-400 block">Tarif Keikutsertaan</span>
                      <span className="text-sm font-extrabold text-brand-700">
                        Rp {Number(item.tarif_pnbp || item.subtotal || 0).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              Tidak ada data skema yang tercatat.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rekap Konfirmasi Kesiapan Peralatan & Standar (Equipment Confirmation) */}
      {hasEquipmentData && (
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <Wrench className="w-4 h-4 text-brand-600" />
              Kesiapan Peralatan & Standar Laboratorium Peserta
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-4 space-y-4 text-xs">
            {/* Termometer */}
            {equipment.termometer && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                  Peralatan Kalibrasi Suhu (Termometer)
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-[11px] text-slate-600 pt-1">
                  <div>
                    <span className="text-slate-400 block">Ice Point:</span>
                    <span className="font-semibold text-slate-800">
                      {equipment.termometer.ice_point ? "Tersedia" : "Tidak Ada"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Kedalaman Sensor:</span>
                    <span className="font-semibold text-slate-800">
                      {equipment.termometer.kedalaman_sensor_cm || "-"} cm
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Media Kalibrasi:</span>
                    <span className="font-semibold text-slate-800">
                      {Array.isArray(equipment.termometer.media_kalibrasi)
                        ? equipment.termometer.media_kalibrasi.join(", ")
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Autoclave */}
            {equipment.autoclave && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                  Peralatan Autoclave
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-600 pt-1">
                  <div>
                    <span className="text-slate-400 block">Metode Kalibrasi Suhu:</span>
                    <span className="font-semibold text-slate-800">
                      {equipment.autoclave.metode_suhu || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Metode Kalibrasi Tekanan:</span>
                    <span className="font-semibold text-slate-800">
                      {equipment.autoclave.metode_tekanan || "-"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Pressure Gauge */}
            {equipment.pressure_gauge && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                  Peralatan Pressure Gauge (Pneumatik / Hidrolik)
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-600 pt-1">
                  <div>
                    <span className="text-slate-400 block">Kemampuan Tekanan:</span>
                    <span className="font-semibold text-slate-800">
                      {Array.isArray(equipment.pressure_gauge.kemampuan_tekanan)
                        ? equipment.pressure_gauge.kemampuan_tekanan.join(", ")
                        : "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Media Tekanan:</span>
                    <span className="font-semibold text-slate-800">
                      {Array.isArray(equipment.pressure_gauge.media_tekanan)
                        ? equipment.pressure_gauge.media_tekanan.join(", ")
                        : "-"}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block">Pernyataan Media Tekanan:</span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1.5 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Disetujui (Media tekanan dipastikan sesuai dan artefak dikembalikan dalam kondisi bersih)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Stopwatch */}
            {equipment.stopwatch && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                  Peralatan Stopwatch
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-600 pt-1">
                  <div>
                    <span className="text-slate-400 block">Alat Standar Kalibrasi:</span>
                    <span className="font-semibold text-slate-800">
                      {Array.isArray(equipment.stopwatch.alat_standar)
                        ? equipment.stopwatch.alat_standar.join(", ")
                        : "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Kemampuan Pengukuran Terbaik (CMC):</span>
                    <span className="font-semibold text-slate-800">
                      {equipment.stopwatch.u95_cmc_detik || "-"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Digital Caliper */}
            {equipment.digital_caliper && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                  Peralatan Digital Caliper
                </h5>
                <div className="text-[11px] text-slate-600 pt-1">
                  <span className="text-slate-400 block">Alat Standar Kalibrasi:</span>
                  <span className="font-semibold text-slate-800">
                    {Array.isArray(equipment.digital_caliper.alat_standar)
                      ? equipment.digital_caliper.alat_standar.join(", ")
                      : "-"}
                  </span>
                </div>
              </div>
            )}

            {/* Spektrofotometer */}
            {equipment.spektrofotometer && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                  Peralatan Spektrofotometer UV-Vis
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-600 pt-1">
                  <div>
                    <span className="text-slate-400 block">Filter Holmium:</span>
                    <span className="font-semibold text-slate-800">
                      {equipment.spektrofotometer.filter_holmium || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Filter Didymium:</span>
                    <span className="font-semibold text-slate-800">
                      {equipment.spektrofotometer.filter_didymium || "-"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export const PupDetailLaboratoriumTab: React.FC<PupDetailSectionProps> = ({
  formPup,
  permohonan,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Profil Laboratorium Kalibrasi */}
      <Card className="rounded-2xl border-slate-200 shadow-soft">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Data Laboratorium Kalibrasi Peserta
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <span className="text-slate-400 block font-medium">Nama Laboratorium Kalibrasi:</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                {formPup?.nama_lab_kalibrasi || permohonan?.creator?.name || "-"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Email Official Laboratorium:</span>
              <span className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {formPup?.email_official_lab || "-"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Kabupaten / Kota Lokasi:</span>
              <span className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {formPup?.kota_kabupaten_lab || "-"}
              </span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-400 block font-medium">Alamat Lengkap Laboratorium:</span>
              <span className="font-medium text-slate-700 mt-0.5 block bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed">
                {formPup?.alamat_lab_kalibrasi || "-"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informasi Kontak & Narahubung Teknis */}
      <Card className="rounded-2xl border-slate-200 shadow-soft">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
            <User className="w-4 h-4 text-brand-600" />
            Informasi Pengisi & Narahubung Teknis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Nama Pengisi Formulir:</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {formPup?.nama_pengisi || permohonan?.creator?.name || "-"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Email Pemohon:</span>
              <span className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {formPup?.email_pemohon || permohonan?.creator?.email || "-"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Nama Narahubung (Contact Person):</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {formPup?.nama_narahubung || "-"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Nomor WhatsApp Narahubung:</span>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  {formPup?.no_wa_narahubung || "-"}
                </span>
                {formPup?.no_wa_narahubung && (
                  <a
                    href={`https://wa.me/${formPup.no_wa_narahubung.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-bold underline"
                  >
                    <span>Chat WA</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personil Pengesah Formulir */}
      <Card className="rounded-2xl border-slate-200 shadow-soft">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
            <FileSignature className="w-4 h-4 text-indigo-600" />
            Personil Pengesah Pendaftaran
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Nama Personil Pengesah:</span>
              <span className="font-bold text-slate-900 mt-0.5 block text-sm">
                {formPup?.nama_personil_pengesah || "-"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Jabatan Personil Pengesah:</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {formPup?.jabatan_personil_pengesah || "-"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const PupDetailKomitmenTab: React.FC<PupDetailSectionProps> = ({
  formPup,
  permohonan,
  formatIndoDate,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      <Card className="rounded-2xl border-slate-200 shadow-soft">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Pernyataan & Komitmen Resmi Pemohon
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-4 space-y-4 text-xs">
          {/* Komitmen 1: En-score 1 Bulan */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h5 className="font-bold text-emerald-950 text-xs">
                  Komitmen Pelaksanaan Evaluasi Nilai En (1 Bulan Kerja)
                </h5>
                <Badge variant="success">Telah Disetujui</Badge>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Laboratorium peserta menyanggupi dan berkomitmen untuk mengkalibrasi artefak uji profisiensi serta mengirimkan laporan hasil pengukuran selambat-lambatnya <strong>1 (satu) bulan kalender</strong> terhitung sejak artefak diterima di laboratorium peserta.
              </p>
            </div>
          </div>

          {/* Komitmen 2: Persetujuan Proposal & Kebutuhan LK */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h5 className="font-bold text-emerald-950 text-xs">
                  Persetujuan Proposal Program Uji Profisiensi BBSPJIKKP 2025
                </h5>
                <Badge variant="success">Telah Disetujui</Badge>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Laboratorium peserta telah membaca, memahami, dan menyetujui seluruh ketentuan operasional, biaya PNBP, dan alur sirkulasi artefak yang tercantum dalam Proposal Penyelenggaraan Uji Profisiensi BBSPJIKKP Tahun 2025.
              </p>
            </div>
          </div>

          {/* Disetujui Oleh */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-slate-400 block text-[11px]">Disahkan Oleh:</span>
              <span className="font-bold text-slate-800">
                {formPup?.nama_personil_pengesah || "-"} ({formPup?.jabatan_personil_pengesah || "-"})
              </span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-slate-400 block text-[11px]">Tanggal Pengajuan:</span>
              <span className="font-semibold text-slate-800">
                {formatIndoDate(permohonan?.created_at || permohonan?.tgl_order, true)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
