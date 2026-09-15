import React, { lazy, memo, Suspense } from "react"
import useProfile from "../../hooks/useProfile"
import { ProfileClientType } from "../../types/profile"
import Head from "../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { User, Building, Landmark, Loader2 } from "lucide-react"

const FormInstansi = lazy(() => import("../../components/update-profile/FormInstansi"))
const FormPerusahaan = lazy(() => import("../../components/update-profile/FormPerusahaan"))
const FormPerorangan = lazy(() => import("../../components/update-profile/FormPerorangan"))

const UpdateProfilePage: React.FC = () => {
  const { cleintType, profile } = useProfile()

  const getClientTypeLabel = () => {
    switch (cleintType) {
      case ProfileClientType.BADAN_USAHA:
        return { label: "Perusahaan / Badan Usaha", icon: <Building className="w-4 h-4" /> }
      case ProfileClientType.INSTANSI_PEMERINTAH:
        return { label: "Instansi Pemerintah / Lembaga", icon: <Landmark className="w-4 h-4" /> }
      case ProfileClientType.PERORANGAN:
        return { label: "Pelanggan Perorangan", icon: <User className="w-4 h-4" /> }
      default:
        return { label: "Pelanggan BBKKP", icon: <User className="w-4 h-4" /> }
    }
  }

  const typeInfo = getClientTypeLabel()

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Head title="Kelola Profil Pelanggan" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-brand-600" />
            Profil & Legalitas Akun
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Lengkapi data identitas pemohon, legalitas usaha, dan verifikasi nomor WhatsApp untuk kelancaran layanan.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
          {typeInfo.icon}
          <span>{typeInfo.label}</span>
        </div>
      </div>

      {/* Profile Form Card */}
      <Card>
        <CardContent className="p-6 sm:p-8">
          <Suspense
            fallback={
              <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
                <span className="text-xs font-medium text-slate-500">Memuat formulir data profil...</span>
              </div>
            }
          >
            {cleintType === ProfileClientType.BADAN_USAHA && <FormPerusahaan />}
            {cleintType === ProfileClientType.INSTANSI_PEMERINTAH && <FormInstansi />}
            {cleintType === ProfileClientType.PERORANGAN && <FormPerorangan />}
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

export default memo(UpdateProfilePage)