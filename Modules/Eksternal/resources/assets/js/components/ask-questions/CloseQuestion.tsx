import React, { memo, useCallback } from "react"
import { AlertTriangle } from "lucide-react"
import useQuestion from "../../hooks/ask-questions/useQuestion"
import { Modal } from "../ui/Modal"
import { Button } from "../ui/Button"

type Props = {
  show: boolean
  id: string
  onClose: () => void
  onAfterClosed: () => void
}

const CloseQuestion: React.FC<Props> = ({ id, show, onClose, onAfterClosed }) => {
  const { submitting, closeQuestion } = useQuestion()

  const onCloseQuestion = useCallback(async () => {
    const res = await closeQuestion(id)
    if (res) onAfterClosed()
  }, [id, closeQuestion, onAfterClosed])

  return (
    <Modal
      isOpen={show}
      onClose={submitting ? () => {} : onClose}
      title="Tutup Tiket Pertanyaan"
      description="Konfirmasi penutupan sesi konsultasi teknis"
      size="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 bg-amber-50 rounded-xl border border-amber-200/80 text-amber-800 text-xs leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            Apakah Anda yakin ingin menutup sesi pertanyaan ini? Anda dapat memberikan ulasan kepuasan layanan setelah tiket ditutup.
          </span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="secondary"
            disabled={submitting}
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="danger"
            isLoading={submitting}
            onClick={onCloseQuestion}
          >
            Ya, Tutup Tiket
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default memo(CloseQuestion)