import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  FileText,
  Clock,
  CreditCard,
  Truck,
  Award,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

export interface PostSubmitRoadmapProps {
  noPermohonan: string;
  layananTitle: string;
  onViewList?: () => void;
  onDownloadReceipt?: () => void;
  className?: string;
}

export const PostSubmitRoadmap: React.FC<PostSubmitRoadmapProps> = ({
  noPermohonan,
  layananTitle,
  onViewList,
  onDownloadReceipt,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(noPermohonan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      title: 'Permohonan Terdaftar',
      subtitle: 'Data & berkas berhasil masuk ke sistem Polimer',
      status: 'completed',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: 'Verifikasi Teknis BBSPJIKKP',
      subtitle: 'Ditinjau oleh verifikator dalam maksimal 1 x 24 jam kerja',
      status: 'active',
      icon: <Clock className="w-5 h-5 text-brand-600" />,
    },
    {
      title: 'Penerbitan Billing PNBP',
      subtitle: 'Pembayaran resmi melalui kode billing SIMPONI Kemenkeu',
      status: 'upcoming',
      icon: <CreditCard className="w-5 h-5 text-slate-400" />,
    },
    {
      title: 'Penyerahan Sampel / Alat',
      subtitle: 'Fisik sampel/alat dikirim setelah status permohonan disetujui',
      status: 'upcoming',
      icon: <Truck className="w-5 h-5 text-slate-400" />,
    },
    {
      title: 'Pengerjaan & Terbit LHU/Sertifikat',
      subtitle: 'Sertifikat bertanda tangan digital resmi siap diunduh',
      status: 'upcoming',
      icon: <Award className="w-5 h-5 text-slate-400" />,
    },
  ];

  return (
    <div className={cn('p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-elevated space-y-6', className)}>
      {/* Top Banner: Success Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Permohonan Berhasil Diajukan!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Permohonan layanan <strong className="text-slate-900">{layananTitle}</strong> Anda telah berhasil terdaftar pada sistem BBSPJIKKP.
        </p>
      </div>

      {/* Ticket / Registration Box */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-lg mx-auto">
        <div className="text-center sm:text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
            Nomor Registrasi Permohonan
          </span>
          <span className="text-base font-black text-brand-700 font-mono tracking-wide">
            {noPermohonan}
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
          className="text-xs font-semibold px-3 py-1.5 bg-white border-slate-200 hover:bg-slate-100"
        >
          {copied ? 'Tersalin!' : 'Salin Nomor'}
        </Button>
      </div>

      {/* Important Guideline Alert */}
      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 max-w-2xl mx-auto">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-relaxed">
          <span className="font-bold block text-amber-950">Petunjuk Penting Pengiriman Fisik Sampel / Alat:</span>
          <p className="text-amber-800">
            Mohon <strong>TIDAK</strong> mengirimkan sampel fisik atau peralatan ke kantor Balai sebelum permohonan Anda diverifikasi oleh petugas dan status berubah menjadi <em>"Menunggu Pengiriman Sampel"</em>.
          </p>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="pt-2 max-w-2xl mx-auto">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 text-center sm:text-left">
          Tahapan Alur Selanjutnya (Roadmap Layanan)
        </h4>

        <div className="space-y-3.5">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className={cn(
                'p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all',
                st.status === 'completed' && 'bg-emerald-50/60 border-emerald-200',
                st.status === 'active' && 'bg-brand-50/70 border-brand-300 ring-2 ring-brand-500/10 shadow-2xs',
                st.status === 'upcoming' && 'bg-slate-50/50 border-slate-200/80 opacity-70'
              )}
            >
              <div
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs',
                  st.status === 'completed' && 'bg-white',
                  st.status === 'active' && 'bg-brand-600 text-white shadow-brand-500/20',
                  st.status === 'upcoming' && 'bg-white'
                )}
              >
                {st.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {idx + 1}. {st.title}
                  </h5>
                  {st.status === 'active' && (
                    <span className="text-[10px] font-bold bg-brand-100 text-brand-800 px-2 py-0.2 rounded-full border border-brand-200">
                      Sedang Berjalan
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{st.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
        {onDownloadReceipt && (
          <Button
            type="button"
            variant="outline"
            onClick={onDownloadReceipt}
            leftIcon={<FileText className="w-4 h-4 text-slate-600" />}
            className="w-full sm:w-auto px-5 py-2.5 font-semibold text-xs border-slate-300 hover:bg-slate-50"
          >
            Unduh Tanda Terima (PDF)
          </Button>
        )}

        {onViewList && (
          <Button
            type="button"
            variant="primary"
            onClick={onViewList}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto px-6 py-2.5 font-bold text-xs bg-brand-600 hover:bg-brand-700 shadow-sm"
          >
            Lihat Daftar Permohonan
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostSubmitRoadmap;
