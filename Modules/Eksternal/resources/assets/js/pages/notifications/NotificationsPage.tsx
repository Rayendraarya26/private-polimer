import React, { memo, useEffect } from "react"
import { Bell, CheckCheck, Clock, Inbox, Loader2, Sparkles } from "lucide-react"
import useNotifications from "../../hooks/useNotifications"
import { getDateDisplay } from "../../utils/date"
import Head from "../../components/common/Head"
import { Card, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"

const NotificationsPage: React.FC = () => {
  const {
    loading,
    page,
    total,
    totalPages,
    data,
    setPage,
    getNotifications,
    markAllAsRead,
  } = useNotifications({ useLoadMore: true })

  useEffect(() => {
    getNotifications()
  }, [page])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Head title="Pusat Notifikasi" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-brand-600" />
            Pusat Notifikasi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Menampilkan {data.length} dari total {total} pesan pemberitahuan sistem
          </p>
        </div>

        {data.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<CheckCheck className="w-4 h-4 text-brand-600" />}
            onClick={markAllAsRead}
          >
            Tandai Semua Terbaca
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {data.length < 1 && loading && (
          <div className="py-16 text-center">
            <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
              <span className="text-xs">Memuat notifikasi...</span>
            </div>
          </div>
        )}

        {data.length === 0 && !loading && (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/80 shadow-card">
            <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
              <Inbox className="w-10 h-10 stroke-1 text-slate-300" />
              <span className="text-sm font-semibold text-slate-700">Belum ada notifikasi</span>
              <p className="text-xs text-slate-500 max-w-sm">
                Setiap pembaruan status permohonan, tagihan invoice, atau penerbitan sertifikat akan muncul di sini.
              </p>
            </div>
          </div>
        )}

        {data.map((r) => {
          const isUnread = r.is_read === "no"

          return (
            <a
              key={r.created_at}
              href={r.link}
              className="block group transition-transform duration-150 hover:-translate-y-0.5"
            >
              <Card
                className={`transition-all duration-200 ${
                  isUnread
                    ? "bg-amber-50/40 border-amber-200/80 shadow-sm"
                    : "hover:border-slate-300"
                }`}
              >
                <CardContent className="p-4 sm:p-5 flex items-start gap-4">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      isUnread
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors"
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-sm tracking-tight truncate ${
                          isUnread ? "font-bold text-slate-900" : "font-semibold text-slate-800"
                        }`}
                      >
                        {r.title}
                      </h4>

                      {isUnread && (
                        <Badge variant="warning" size="sm" dot>
                          Baru
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{r.content}</p>

                    <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{getDateDisplay(r.created_at, true)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
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

export default memo(NotificationsPage)