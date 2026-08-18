import React from "react"
import { useNavigate } from "react-router-dom"
import {
  Award,
  FlaskConical,
  Gauge,
  HelpCircle,
  GraduationCap,
  Scale,
  Boxes,
  ShieldCheck,
  Search,
  CheckCircle2,
  Cpu,
  Factory,
  BadgeCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { useProfileStatus } from "../../hooks/usePermohonan"
import Head from "../../components/common/Head"
import toast from "react-hot-toast"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"

interface ServiceItem {
  id: string
  name: string
  desc: string
  icon: React.ReactNode
  badge?: string
  isAvailable?: boolean
  route?: string
}

const serviceCategories: { title: string; desc: string; items: ServiceItem[] }[] = [
  {
    title: "1. Pengujian & Kalibrasi Laboratorium",
    desc: "Layanan pengujian mutu material kulit, karet, plastik dan kalibrasi peralatan standar industri.",
    items: [
      {
        id: "pengujian",
        name: "Pengujian Laboratorium",
        desc: "Uji kimia, fisika, dan mekanik untuk material polimer, kulit, karet, dan alas kaki.",
        icon: <FlaskConical className="w-6 h-6 text-brand-600" />,
        badge: "Terakreditasi KAN",
        isAvailable: true,
      },
      {
        id: "kalibrasi",
        name: "Kalibrasi Instrumen",
        desc: "Kalibrasi alat ukur suhu, massa, tekanan, dan dimensi berstandar nasional.",
        icon: <Gauge className="w-6 h-6 text-emerald-600" />,
        badge: "LK-005-IDN",
        isAvailable: true,
      },
      {
        id: "profisiensi",
        name: "Uji Profisiensi",
        desc: "Penyelenggara uji profisiensi antar-laboratorium pengujian industri.",
        icon: <Scale className="w-6 h-6 text-amber-600" />,
        badge: "PUP",
        isAvailable: false,
      },
      {
        id: "bahanacuan",
        name: "Produsen Bahan Acuan",
        desc: "Penyediaan material referensi standar tersertifikasi untuk kalibrasi metode uji.",
        icon: <Boxes className="w-6 h-6 text-sky-600" />,
        isAvailable: false,
      },
    ],
  },
  {
    title: "2. Sertifikasi Produk & Profesi",
    desc: "Lembaga Sertifikasi Produk (LSPro) dan Lembaga Sertifikasi Profesi (LSP) berlisensi BNSP.",
    items: [
      {
        id: "sertifikasi",
        name: "Sertifikasi Produk (LSPro)",
        desc: "Sertifikasi tanda SNI untuk produk kulit, karet, plastik, dan helm keselamatan.",
        icon: <Award className="w-6 h-6 text-indigo-600" />,
        badge: "SNI / ISO",
        isAvailable: true,
      },
      {
        id: "sertifikasi_profesi",
        name: "Sertifikasi Profesi (LSP)",
        desc: "Uji kompetensi profesi industri penyamakan kulit, barang karet, dan transformasi industri 4.0.",
        icon: <BadgeCheck className="w-6 h-6 text-emerald-600" />,
        badge: "Lisensi BNSP",
        route: "/permohonan/sertifikasi-profesi",
        isAvailable: true,
      },
      {
        id: "halal",
        name: "Pemeriksaan Halal (LPH)",
        desc: "Lembaga Pemeriksa Halal untuk produk barang gunaan kulit dan kimia industri.",
        icon: <ShieldCheck className="w-6 h-6 text-teal-600" />,
        badge: "BPJPH",
        isAvailable: false,
      },
      {
        id: "verifikasi",
        name: "Verifikasi & Validasi",
        desc: "Layanan verifikasi TKDN, verifikasi teknis, dan audit kesiapan industri.",
        icon: <CheckCircle2 className="w-6 h-6 text-blue-600" />,
        isAvailable: false,
      },
    ],
  },
  {
    title: "3. Pelatihan, Konsultasi & Rekayasa",
    desc: "Program peningkatan SDM industri dan asistensi teknologi manufaktur.",
    items: [
      {
        id: "pelatihan",
        name: "Bimtek & Pelatihan Industri",
        desc: "Pelatihan teknis pengolahan kulit, formulasi karet/plastik, dan desain alas kaki.",
        icon: <GraduationCap className="w-6 h-6 text-brand-600" />,
        badge: "Reguler & Custom",
        route: "/permohonan/pelatihan",
        isAvailable: true,
      },
      {
        id: "konsultasi",
        name: "Konsultasi & Optimalisasi",
        desc: "Pemecahan masalah cacat produksi, formulasi bahan baku, dan efisiensi lini produksi.",
        icon: <HelpCircle className="w-6 h-6 text-amber-600" />,
        isAvailable: false,
      },
      {
        id: "audit",
        name: "Audit Teknologi & Energi",
        desc: "Evaluasi kapabilitas mesin, optimasi energi manufaktur, dan kesiapan industri hijau.",
        icon: <Cpu className="w-6 h-6 text-purple-600" />,
        isAvailable: false,
      },
      {
        id: "miniplant",
        name: "Miniplant & Prototyping",
        desc: "Pemanfaatan fasilitas pilot plant BBKKP untuk trial batch produksi dan cetakan.",
        icon: <Factory className="w-6 h-6 text-slate-600" />,
        isAvailable: false,
      },
    ],
  },
]

const PermohonanPage: React.FC = () => {
  const navigate = useNavigate()
  const { checkAndRun, isLoading } = useProfileStatus()

  const handleNavigate = (service: ServiceItem) => {
    if (isLoading) {
      toast("Sedang memverifikasi profil akun...", { icon: "⏳" })
      return
    }

    checkAndRun(() => {
      if (service.route) {
        navigate(service.route)
      } else {
        toast(`Layanan formulir ${service.name} segera tersedia di portal!`, {
          icon: "ℹ️",
        })
      }
    })
  }

  return (
    <div className="space-y-8">
      <Head title="Pengajuan Permohonan Layanan" />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-soft relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-200 border border-brand-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Katalog Layanan Publik BBKKP
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Pilih Jenis Layanan Industri
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Balai Besar Kulit, Karet, dan Plastik menyediakan layanan pengujian terakreditasi, kalibrasi presisi, sertifikasi produk SNI, bimtek, dan sertifikasi profesi.
          </p>
        </div>
      </div>

      {/* Service Categories */}
      <div className="space-y-8">
        {serviceCategories.map((category, catIdx) => (
          <div key={catIdx} className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                {category.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{category.desc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.items.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleNavigate(service)}
                  className={`group relative bg-white p-5 rounded-xl border border-slate-200/80 shadow-card transition-all duration-200 flex flex-col justify-between cursor-pointer hover:shadow-elevated hover:border-brand-300 hover:-translate-y-1 ${
                    !service.isAvailable ? "opacity-75 hover:opacity-100" : ""
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-brand-50 group-hover:border-brand-100 transition-colors">
                        {service.icon}
                      </div>

                      {service.badge && (
                        <Badge variant="primary" size="sm">
                          {service.badge}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-600 group-hover:text-brand-700">
                    <span>{service.isAvailable ? "Pilih Layanan" : "Konsultasikan"}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PermohonanPage