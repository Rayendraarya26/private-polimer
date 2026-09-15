import React, { memo, useCallback, useEffect, useState } from "react"
import { Star, Send } from "lucide-react"
import useQuestion from "../../hooks/ask-questions/useQuestion"
import { Modal } from "../ui/Modal"
import { Button } from "../ui/Button"

type Props = {
  show: boolean
  id: string
  onClose: () => void
  onAfterReview: () => void
}

const ReviewQuestion: React.FC<Props> = ({ id, show, onClose, onAfterReview }) => {
  const [rating, setRating] = useState<number>(0)
  const [testimoni, setTestimoni] = useState<string>("")
  const { submitting, reviewQuestion } = useQuestion()

  useEffect(() => {
    if (show) {
      setRating(0)
      setTestimoni("")
    }
  }, [show])

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!rating || (rating <= 3 && !testimoni.trim())) return
      const res = await reviewQuestion(id, { rating, testimoni })
      if (res) onAfterReview()
    },
    [id, rating, testimoni, reviewQuestion, onAfterReview]
  )

  return (
    <Modal
      isOpen={show}
      onClose={onClose}
      title="Beri Penilaian Layanan"
      description="Bantu kami meningkatkan kualitas respon dan bantuan teknis customer service"
      size="md"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Star Rating Selection */}
        <div className="space-y-2 text-center py-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Tingkat Kepuasan <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setRating(v)}
                className="p-1 hover:scale-125 transition-transform focus:outline-none"
              >
                <Star
                  className={`w-7 h-7 ${
                    rating >= v
                      ? "text-amber-500 fill-amber-400"
                      : "text-slate-300 fill-slate-100 hover:text-amber-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-xs font-medium text-amber-700">
              {rating === 5 && "Sangat Memuaskan ⭐⭐⭐⭐⭐"}
              {rating === 4 && "Memuaskan ⭐⭐⭐⭐"}
              {rating === 3 && "Cukup ⭐⭐⭐"}
              {rating === 2 && "Kurang Memuaskan ⭐⭐"}
              {rating === 1 && "Sangat Kurang ⭐"}
            </p>
          )}
        </div>

        {/* Testimoni & Feedback */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Ulasan / Catatan Saran{" "}
            {rating > 3 ? (
              <span className="text-slate-400 font-normal">(Opsional)</span>
            ) : (
              <span className="text-rose-500">*</span>
            )}
          </label>
          <textarea
            rows={4}
            required={rating <= 3}
            placeholder="Tuliskan ulasan atau saran Anda untuk peningkatan layanan BBKKP..."
            value={testimoni}
            onChange={(e) => setTestimoni(e.target.value || "")}
            className="w-full bg-white text-slate-900 text-sm rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={submitting}
            disabled={!rating || (rating <= 3 && !testimoni.trim())}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Kirim Penilaian
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default memo(ReviewQuestion)
