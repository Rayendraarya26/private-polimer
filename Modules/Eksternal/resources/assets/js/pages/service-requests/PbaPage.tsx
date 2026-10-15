import React from 'react'
import { useNavigate } from 'react-router-dom'
import Head from '../../components/common/Head'
import { Button } from '../../components/ui/Button'
import { Boxes, ArrowLeft } from 'lucide-react'
import FormPbaWizard from '../../components/input-service-requests/multiPba/FormPbaWizard'

const PbaPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Head title="Permohonan Produsen Bahan Acuan (PBA)" />

      {/* Header & Back Button (Sama persis dengan InspeksiPage, KalibrasiPage, PengujianPage) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <Boxes className="w-4 h-4" />
            <span>Produsen Bahan Acuan BBSPJIKKP (PBA Terakreditasi ISO 17034 KAN)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Permohonan Produsen Bahan Acuan (PBA)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Penyediaan material acuan standar tersertifikasi (CRM) seperti CV Rubber Standar Material untuk uji Plastisitas (PO/PRI) dan Viskositas Mooney.
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

      {/* Form Wizard PBA */}
      <FormPbaWizard />
    </div>
  )
}

export default PbaPage
