import React, { memo, useEffect } from "react"
import {
  MessageSquareQuote,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  Inbox,
  Loader2,
  Sparkles,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import useFeedbacks from "../../hooks/feedback/useFeedbacks"
import { FeedbackItemStatusOrder } from "../../types/feedbacks"
import { getDateDisplay } from "../../utils/date"
import Head from "../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"

const FeedbacksPage: React.FC = () => {
  const navigate = useNavigate()

  const {
    loading,
    data,
    page,
    total,
    totalPages,
    getFeedbacks,
    changeSearch,
    setPage,
    search: query,
    debouncedSearch,
  } = useFeedbacks({ useLoadMore: true, defaultStatus: FeedbackItemStatusOrder.DONE })

  useEffect(() => {
    getFeedbacks()
  }, [debouncedSearch, page])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Head title="Survey Kepuasan & Feedback" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquareQuote className="w-6 h-6 text-brand-600" />
            Survey Kepuasan Layanan (SKM)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bantu kami meningkatkan mutu pelayanan publik BBKKP dengan memberikan ulasan atas layanan yang telah selesai.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => changeSearch(e.target.value)}
            placeholder="Cari kode order / layanan..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
          />
        </div>
      </div>

      {/* Feedbacks List */}
      <div className="space-y-3">
        {data.length < 1 && loading && (
          <div className="py-16 text-center">
            <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
              <span className="text-xs">Memuat daftar survey...</span>
            </div>
          </div>
        )}

        {data.length === 0 && !loading && (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/80 shadow-card">
            <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
              <Inbox className="w-10 h-10 stroke-1 text-slate-300" />
              <span className="text-sm font-semibold text-slate-700">Tidak ada survey aktif</span>
              <p className="text-xs text-slate-500 max-w-sm">
                Survey kepuasan pelanggan akan muncul secara otomatis setelah permohonan pengujian Anda berstatus selesai.
              </p>
            </div>
          </div>
        )}

        {data.map((r) => {
          const isGiven = r.is_given_feedback

          return (
            <div
              key={r.id}
              onClick={() => !isGiven && navigate(`/feedbacks/${r.id}`)}
              className={`group bg-white p-5 rounded-xl border border-slate-200/80 shadow-card transition-all duration-200 ${
                !isGiven
                  ? "cursor-pointer hover:shadow-elevated hover:border-brand-300 hover:-translate-y-0.5"
                  : "bg-slate-50/50 opacity-90"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-bold text-slate-900">
                      Kode Order: {r.kode_order || `#${r.id}`}
                    </span>

                    {isGiven ? (
                      <Badge variant="success" dot>
                        Feedback Terkirim
                      </Badge>
                    ) : (
                      <Badge variant="warning" dot>
                        Menunggu Ulasan Anda
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs font-medium text-slate-700">
                    Jenis Layanan: <span className="text-brand-700">{r.layanan || "-"}</span>
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Tanggal Order: {getDateDisplay(r.tanggal_order, true)}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {!isGiven ? (
                    <Button
                      variant="primary"
                      size="sm"
                      rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                    >
                      Beri Ulasan Sekarang
                    </Button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Selesai Diisi
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {total > 0 && page < totalPages && (
          <div className="pt-4 flex justify-center">
            <Button
              variant="outline"
              size="md"
              disabled={loading}
              onClick={() => setPage((c) => c + 1)}
              isLoading={loading}
            >
              Muat Lebih Banyak
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(FeedbacksPage)