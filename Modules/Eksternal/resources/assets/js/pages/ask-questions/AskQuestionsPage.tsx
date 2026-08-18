import { format } from "date-fns"
import { id } from "date-fns/locale/id"
import React, { memo, useCallback, useEffect, useState } from "react"
import {
  HelpCircle,
  Search,
  MessageSquare,
  Calendar,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Star,
  Inbox,
  Loader2,
  Sparkles,
} from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import useQuestions from "../../hooks/ask-questions/useQuestions"
import { QuestionStatus } from "../../types/ask-questions"
import Head from "../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import NewQuestoin from "../../components/ask-questions/NewQuestoin"
import QuestionDetail from "../../components/ask-questions/QuestionDetail"
import CloseQuestion from "../../components/ask-questions/CloseQuestion"
import ReviewQuestion from "../../components/ask-questions/ReviewQuestion"

const AskQuestionsPage: React.FC = () => {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const detailId = new URLSearchParams(search).get("id")
  const [closeQuestionId, setCloseQuestionId] = useState<string>("")
  const [reviewQuestionId, setReviewQuestionId] = useState<string>("")

  const {
    loading,
    data,
    page,
    total,
    totalPages,
    getQuestions,
    changeSearch,
    setPage,
    search: query,
    debouncedSearch,
    setData,
  } = useQuestions({ useLoadMore: true })

  useEffect(() => {
    getQuestions()
  }, [debouncedSearch, page])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Head title="Pusat Bantuan & Tanya Jawab" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-brand-600" />
            Tanya Jawab & Bantuan Teknis
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Konsultasikan pertanyaan seputar tarif pengujian, sertifikasi SNI, atau kendala permohonan dengan tim teknis BBKKP.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => changeSearch(e.target.value)}
            placeholder="Cari topik / pertanyaan..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {data.length < 1 && loading && (
          <div className="py-16 text-center">
            <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
              <span className="text-xs">Memuat daftar tiket pertanyaan...</span>
            </div>
          </div>
        )}

        {data.length === 0 && !loading && (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/80 shadow-card">
            <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
              <Inbox className="w-10 h-10 stroke-1 text-slate-300" />
              <span className="text-sm font-semibold text-slate-700">Belum ada tiket pertanyaan</span>
              <p className="text-xs text-slate-500 max-w-sm">
                Klik tombol "Ajukan Pertanyaan Baru" di pojok kanan bawah untuk memulai konsultasi teknis.
              </p>
            </div>
          </div>
        )}

        {data.map((r) => {
          const isOpen = r.status === QuestionStatus.OPENED

          return (
            <div
              key={r.id}
              onClick={() => navigate(`${pathname}?id=${r.id}`)}
              className="group bg-white p-5 rounded-xl border border-slate-200/80 shadow-card hover:shadow-elevated hover:border-brand-300 transition-all duration-200 cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      Topik: {r.topik}
                    </span>

                    {isOpen ? (
                      <Badge variant="success" dot>
                        Terbuka (Open)
                      </Badge>
                    ) : (
                      <Badge variant="neutral">
                        Selesai (Closed)
                      </Badge>
                    )}
                  </div>

                  {r.layanan && (
                    <p className="text-xs font-medium text-slate-600">
                      ID Layanan: <span className="text-brand-700 font-semibold">{r.layanan}</span>
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{format(new Date(r.created_at), "dd MMMM yyyy, HH:mm", { locale: id })}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{r.total_pesan} balasan</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {!isOpen && r.is_review === "no" && (
                    <Button
                      size="sm"
                      variant="warning"
                      leftIcon={<Star className="w-3.5 h-3.5" />}
                      onClick={(e) => {
                        e.stopPropagation()
                        setReviewQuestionId(r.id)
                      }}
                    >
                      Beri Penilaian
                    </Button>
                  )}

                  {isOpen && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        setCloseQuestionId(r.id)
                      }}
                    >
                      Tutup Tiket
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    Buka Diskusi
                  </Button>
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

        {/* Floating Action Button */}
        <NewQuestoin
          onAfterAdded={useCallback(() => {
            if (page === 1) {
              getQuestions()
            } else {
              setPage(1)
            }
          }, [page])}
        />
      </div>

      {/* Modals */}
      <QuestionDetail
        show={!!detailId}
        id={detailId as string}
        onClose={() => navigate(-1)}
      />

      <CloseQuestion
        id={closeQuestionId}
        show={!!closeQuestionId}
        onClose={() => setCloseQuestionId("")}
        onAfterClosed={() => {
          setData((current) =>
            current.map((r) => ({
              ...r,
              status: r.id === closeQuestionId ? QuestionStatus.CLOSED : r.status,
            }))
          )
          setCloseQuestionId((current) => {
            setReviewQuestionId(current)
            return ""
          })
        }}
      />

      <ReviewQuestion
        id={reviewQuestionId}
        show={!!reviewQuestionId}
        onClose={() => setReviewQuestionId("")}
        onAfterReview={() => {
          setData((current) =>
            current.map((r) => ({
              ...r,
              is_review: r.id === reviewQuestionId ? "yes" : r.is_review,
            }))
          )
          setReviewQuestionId("")
        }}
      />
    </div>
  )
}

export default memo(AskQuestionsPage)