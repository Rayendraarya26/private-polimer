import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { Badge } from "../../ui/Badge"
import { FormHalalPayload, JalurPendaftaran, SkalaUsaha } from "../../../types/halal"
import useProfile from "../../../hooks/useProfile"
import {
  CheckCircle2,
  Building2,
  User,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  FileCheck,
} from "lucide-react"

interface Step1Props {
  payload: FormHalalPayload
  onChange: (updater: (prev: FormHalalPayload) => FormHalalPayload) => void
}

export const Step1ProfilDanJalur: React.FC<Step1Props> = ({ payload, onChange }) => {
  const { profile } = useProfile()

  const setJalur = (jalur: JalurPendaftaran) => {
    onChange((prev) => ({
      ...prev,
      dataPengajuan: {
        ...prev.dataPengajuan,
        jalur_pendaftaran: jalur,
      },
      dataPelakuUsaha: {
        ...prev.dataPelakuUsaha,
        skala_usaha: jalur === "self_declare" ? "mikro" : prev.dataPelakuUsaha.skala_usaha,
      },
    }))
  }

  const handleAutofillProfile = () => {
    if (!profile) return

    const detail = (profile as any)?.detail
    const namaUsaha =
      detail?.nama ||
      (profile as any)?.company_name ||
      profile?.name ||
      ""
    const alamat =
      detail?.alamat ||
      (profile as any)?.address ||
      ""
    const phone =
      detail?.whatsapp ||
      detail?.telepon ||
      (profile as any)?.phone ||
      (profile as any)?.whatsapp ||
      ""
    const nib = detail?.nib || ""
    const npwp = detail?.npwp || ""

    onChange((prev) => ({
      ...prev,
      dataPelakuUsaha: {
        ...prev.dataPelakuUsaha,
        nama_usaha: namaUsaha,
        nib: nib || prev.dataPelakuUsaha.nib,
        npwp: npwp || prev.dataPelakuUsaha.npwp,
        pj_nama: profile.name || prev.dataPelakuUsaha.pj_nama,
        pj_kontak: phone || prev.dataPelakuUsaha.pj_kontak,
        pj_email: profile.email || prev.dataPelakuUsaha.pj_email,
        pj_alamat: alamat || prev.dataPelakuUsaha.pj_alamat,
      },
    }))
  }

  const jalur = payload.dataPengajuan.jalur_pendaftaran

  return (
    <Card className="border-brand-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              1. Jalur Sertifikasi & Profil Pelaku Usaha
            </CardTitle>
            <CardDescription>
              Pilih skema sertifikasi halal (Reguler / Self Declare) dan lengkapi data profil resmi pelaku usaha sesuai NIB OSS
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Section 1: Skema & Jalur Sertifikasi Halal */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Pilih Skema & Jalur Sertifikasi Halal
              </h4>
              <p className="text-[11px] text-slate-500">
                Pilih jalur pengajuan sesuai dengan skala usaha dan karakteristik produk Anda
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Jalur Reguler */}
            <div
              onClick={() => setJalur("reguler")}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                jalur === "reguler"
                  ? "border-brand-600 bg-brand-50/30 ring-2 ring-brand-500/20"
                  : "border-slate-200 hover:border-brand-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm">
                      Jalur Reguler (Audit LPH)
                    </span>
                    <Badge variant="primary">LPH BBSPJIKKP</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Pemeriksaan dan audit kehalalan oleh Auditor Halal LPH untuk usaha Mikro,
                    Kecil, Menengah, Besar, atau produk dengan proses/bahan berisiko.
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    jalur === "reguler"
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {jalur === "reguler" && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>

            {/* Jalur Self Declare */}
            <div
              onClick={() => setJalur("self_declare")}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                jalur === "self_declare"
                  ? "border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-500/20"
                  : "border-slate-200 hover:border-emerald-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm">
                      Jalur Self Declare (SEHATI)
                    </span>
                    <Badge variant="success">Pernyataan Mandiri UMK</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Pernyataan mandiri pelaku usaha mikro/kecil (SEHATI BPJPH) dengan kriteria
                    produk tidak berisiko dan bahan pasti halal.
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    jalur === "self_declare"
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {jalur === "self_declare" && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>
          </div>

          {/* Kuesioner Kelayakan Mandiri (Jika Jalur Self Declare) */}
          {jalur === "self_declare" && (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3 mt-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-xs text-emerald-900">
                  Kriteria Kelayakan Jalur Pernyataan Mandiri (Self Declare BPJPH)
                </span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Pastikan seluruh kriteria di bawah ini terpenuhi sebelum mengajukan jalur Self Declare:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-slate-700">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-emerald-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={payload.kuesionerSelfDeclare.is_mikro_kecil}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        kuesionerSelfDeclare: {
                          ...prev.kuesionerSelfDeclare,
                          is_mikro_kecil: e.target.checked,
                        },
                      }))
                    }
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Termasuk skala usaha Mikro atau Kecil (NIB)</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-emerald-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={payload.kuesionerSelfDeclare.is_produk_tidak_berisiko}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        kuesionerSelfDeclare: {
                          ...prev.kuesionerSelfDeclare,
                          is_produk_tidak_berisiko: e.target.checked,
                        },
                      }))
                    }
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Produk berupa barang dan tidak berisiko</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-emerald-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={payload.kuesionerSelfDeclare.is_bahan_pasti_halal}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        kuesionerSelfDeclare: {
                          ...prev.kuesionerSelfDeclare,
                          is_bahan_pasti_halal: e.target.checked,
                        },
                      }))
                    }
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Bahan telah bersertifikat halal / KMA 1360</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-emerald-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={payload.kuesionerSelfDeclare.is_proses_sederhana}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        kuesionerSelfDeclare: {
                          ...prev.kuesionerSelfDeclare,
                          is_proses_sederhana: e.target.checked,
                        },
                      }))
                    }
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Proses produksi sederhana bebas kontaminasi najis</span>
                </label>
              </div>
            </div>
          )}

          {/* Jenis Pendaftaran & Kode Fasilitasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jenis Pendaftaran
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="jenis_pendaftaran"
                    value="baru"
                    checked={payload.dataPengajuan.jenis_pendaftaran === "baru"}
                    onChange={() =>
                      onChange((prev) => ({
                        ...prev,
                        dataPengajuan: { ...prev.dataPengajuan, jenis_pendaftaran: "baru" },
                      }))
                    }
                    className="text-brand-600 focus:ring-brand-500"
                  />
                  <span>Pendaftaran Baru</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="jenis_pendaftaran"
                    value="pengembangan"
                    checked={payload.dataPengajuan.jenis_pendaftaran === "pengembangan"}
                    onChange={() =>
                      onChange((prev) => ({
                        ...prev,
                        dataPengajuan: { ...prev.dataPengajuan, jenis_pendaftaran: "pengembangan" },
                      }))
                    }
                    className="text-brand-600 focus:ring-brand-500"
                  />
                  <span>Pengembangan Produk</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kode Fasilitasi (Opsional)
              </label>
              <input
                type="text"
                placeholder="Masukkan kode program/sponsor fasilitasi jika ada"
                value={payload.dataPengajuan.kode_fasilitasi || ""}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    dataPengajuan: {
                      ...prev.dataPengajuan,
                      kode_fasilitasi: e.target.value,
                    },
                  }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Data Usaha & Penanggung Jawab */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                  Data Usaha & Penanggung Jawab
                </h4>
                <p className="text-[11px] text-slate-500">
                  Data identitas resmi pelaku usaha sesuai NIB OSS
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAutofillProfile}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-white border border-brand-200 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors shadow-2xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>Gunakan Data Profil</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Usaha / Perusahaan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: PT Sumber Berkah Pangan"
                value={payload.dataPelakuUsaha.nama_usaha}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    dataPelakuUsaha: {
                      ...prev.dataPelakuUsaha,
                      nama_usaha: e.target.value,
                    },
                  }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Skala Usaha <span className="text-red-500">*</span>
              </label>
              <select
                value={payload.dataPelakuUsaha.skala_usaha}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    dataPelakuUsaha: {
                      ...prev.dataPelakuUsaha,
                      skala_usaha: e.target.value as SkalaUsaha,
                    },
                  }))
                }
                disabled={jalur === "self_declare"}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100"
              >
                <option value="mikro">Usaha Mikro</option>
                <option value="kecil">Usaha Kecil</option>
                <option value="menengah">Usaha Menengah</option>
                <option value="besar">Usaha Besar</option>
                <option value="luar_negeri">Luar Negeri (PULN)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Induk Berusaha (NIB) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nomor NIB 13 digit dari OSS"
                value={payload.dataPelakuUsaha.nib}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    dataPelakuUsaha: {
                      ...prev.dataPelakuUsaha,
                      nib: e.target.value,
                    },
                  }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor NPWP (Opsional)
              </label>
              <input
                type="text"
                placeholder="NPWP Perusahaan / Pribadi"
                value={payload.dataPelakuUsaha.npwp}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    dataPelakuUsaha: {
                      ...prev.dataPelakuUsaha,
                      npwp: e.target.value,
                    },
                  }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Penanggung Jawab <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nama Direktur / Pemilik Usaha"
                value={payload.dataPelakuUsaha.pj_nama}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    dataPelakuUsaha: {
                      ...prev.dataPelakuUsaha,
                      pj_nama: e.target.value,
                    },
                  }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Kontak / WhatsApp PJ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="0812xxxxxxxx"
                value={payload.dataPelakuUsaha.pj_kontak}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    dataPelakuUsaha: {
                      ...prev.dataPelakuUsaha,
                      pj_kontak: e.target.value,
                    },
                  }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Kantor Operasional
              </label>
              <textarea
                rows={2}
                placeholder="Alamat kantor / tempat usaha pemohon..."
                value={payload.dataPelakuUsaha.pj_alamat}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    dataPelakuUsaha: {
                      ...prev.dataPelakuUsaha,
                      pj_alamat: e.target.value,
                    },
                  }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
