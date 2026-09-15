import { format } from "date-fns"
import { id } from "date-fns/locale/id"
import React, { memo, useCallback, useEffect, useState } from "react"
import {
  Calendar,
  Send,
  Star,
  XCircle,
  MessageSquare,
  User,
  Shield,
  Loader2,
  AlertCircle,
} from "lucide-react"
import useQuestion from "../../hooks/ask-questions/useQuestion"
import useQuestionResponse from "../../hooks/ask-questions/useQuestionResponse"
import { QuestionStatus } from "../../types/ask-questions"
import { Modal } from "../ui/Modal"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"

type Props = {
  show: boolean
  id: string
  onClose: () => void
}

const QuestionDetail: React.FC<Props> = ({ show, id: uuid, onClose }) => {
  const [responseMessage, setResponseMessage] = useState<string>("")
  const { loading, detail, getQuestion } = useQuestion()
  const {
    loading: loadingResponses,
    submitting,
    responses,
    createQuestionResponse,
    getAllQuestionResponses,
  } = useQuestionResponse(uuid)

  useEffect(() => {
    if (show && uuid) {
      setResponseMessage("")
      getQuestion(uuid)
      getAllQuestionResponses()
    }
  }, [show, uuid])

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!responseMessage.trim()) return
      await createQuestionResponse(responseMessage.trim())
      setResponseMessage("")
    },
    [createQuestionResponse, responseMessage]
  )

  const isClosed = detail?.status === QuestionStatus.CLOSED

  return (
    <Modal
      isOpen={show}
      onClose={onClose}
      title={detail ? `Topik: ${detail.topik}` : "Detail Pertanyaan"}
      description={
        detail?.layanan
          ? `Terkait Layanan: ${detail.layanan}`
          : "Riwayat percakapan dan konsultasi teknis"
      }
      size="lg"
    >
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
          <span className="text-xs">Memuat riwayat pertanyaan...</span>
        </div>
      ) : detail ? (
        <div className="space-y-4">
          {/* Status Alert Banner if Closed */}
          {isClosed && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                Sesi pertanyaan ini telah ditutup oleh{" "}
                <strong>{detail.closed_by_name || "Admin"}</strong>.
              </span>
            </div>
          )}

          {/* Rating Summary if available */}
          {detail.rating && (
            <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-800">Penilaian Layanan:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <Star
                      key={v}
                      className={`w-4 h-4 ${
                        parseInt(detail.rating) >= v
                          ? "text-amber-500 fill-amber-400"
                          : "text-slate-200 fill-slate-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {detail.testimoni && (
                <p className="text-xs text-slate-600 italic">"{detail.testimoni}"</p>
              )}
            </div>
          )}

          {/* Chat Messages Container */}
          <div className="space-y-3 max-h-96 overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            {/* Initial Question */}
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                <User className="w-3.5 h-3.5" />
                <span>Pemohon (Tiket: {detail.topik})</span>
                <span className="text-slate-400 font-normal">
                  • {detail.created_at ? format(new Date(detail.created_at), "dd MMM yyyy, HH:mm", { locale: id }) : "-"}
                </span>
              </div>
              <div className="bg-white text-slate-800 text-xs p-3.5 rounded-2xl rounded-tl-sm border border-slate-200 shadow-xs max-w-lg leading-relaxed">
                {(detail as any).pertanyaan || detail.topik || "Pertanyaan diajukan"}
              </div>
            </div>

            {/* Replies */}
            {responses.map((resp, i) => {
              const isStaff = !resp.is_author

              return (
                <div
                  key={i}
                  className={`flex flex-col gap-1 ${
                    isStaff ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                    {isStaff ? (
                      <>
                        <span className="text-slate-400 font-normal">
                          {resp.created_at ? format(new Date(resp.created_at), "dd MMM yyyy, HH:mm", { locale: id }) : "-"} •
                        </span>
                        <span>{resp.created_by || "Petugas BBKKP"}</span>
                        <Shield className="w-3.5 h-3.5 text-brand-600" />
                      </>
                    ) : (
                      <>
                        <User className="w-3.5 h-3.5" />
                        <span>{resp.created_by || "Anda"}</span>
                        <span className="text-slate-400 font-normal">
                          • {resp.created_at ? format(new Date(resp.created_at), "dd MMM yyyy, HH:mm", { locale: id }) : "-"}
                        </span>
                      </>
                    )}
                  </div>

                  <div
                    className={`text-xs p-3.5 rounded-2xl max-w-lg leading-relaxed shadow-xs ${
                      isStaff
                        ? "bg-brand-600 text-white rounded-tr-sm"
                        : "bg-white text-slate-800 rounded-tl-sm border border-slate-200"
                    }`}
                  >
                    {resp.pesan || (resp as any).response}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Reply Form */}
          {!isClosed && (
            <form onSubmit={onSubmit} className="flex gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                placeholder="Ketik balasan pesan..."
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                disabled={submitting}
                className="flex-1 bg-white text-xs border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={submitting}
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                Kirim
              </Button>
            </form>
          )}
        </div>
      ) : null}
    </Modal>
  )
}

export default memo(QuestionDetail)