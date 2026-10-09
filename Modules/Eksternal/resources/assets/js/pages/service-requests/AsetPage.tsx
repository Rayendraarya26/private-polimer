import React from 'react'
import { useNavigate } from 'react-router-dom'
import Head from '../../components/common/Head'
import { Button } from '../../components/ui/Button'
import { Building2, ArrowLeft, ShieldCheck } from 'lucide-react'
import FormAsetWizard from '../../components/input-service-requests/multiAset/FormAsetWizard'

const AsetPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <Head title="Permohonan Pemanfaatan & Sewa Aset Balai - BBSPJIKKP" />

      {/* Header Page & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Penerimaan Negara Bukan Pajak (PNBP)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-brand-600" />
            <span>Permohonan Pemanfaatan & Sewa Aset Balai</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Layanan pemanfaatan aset fisik balai meliputi lapangan, bangunan aula, peralatan uji teknis, kendaraan dinas, dan ruang rapat.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate('/permohonan')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="shrink-0"
        >
          Kembali ke Katalog
        </Button>
      </div>

      {/* Wizard Form */}
      <FormAsetWizard />
    </div>
  )
}

export default AsetPage
