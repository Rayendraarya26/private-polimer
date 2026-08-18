import React, { memo, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useFeedback from "../../hooks/feedback/useFeedback"
import { FormProvider } from "react-hook-form"
import FeedbackFieldItem from "../../components/feedbacks/FeedbackFieldItem"
import Head from "../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { ArrowLeft, MessageSquareQuote, Send, Loader2, Star } from "lucide-react"

const FeedbackDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const { uuid } = useParams()
  const { form, rhf, feedbacks, getFeedback, onSubmit, loading, submitting } = useFeedback()

  useEffect(() => {
    if (uuid) {
      getFeedback(uuid)
      rhf.setValue("uuid", uuid)
    }
  }, [uuid])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Head title="Isi Survey Kepuasan Layanan (SKM)" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Survey Kepuasan Masyarakat (SKM) BBKKP</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Formulir Evaluasi & Kepuasan Pelanggan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Penilaian Anda sangat berharga untuk perbaikan kualitas layanan publik dan integritas balai.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/feedbacks")}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="shrink-0"
        >
          Kembali ke Daftar
        </Button>
      </div>

      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <Card>
            <CardHeader className="bg-gradient-to-r from-brand-50/60 to-white border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-600 text-white shadow-xs">
                  <MessageSquareQuote className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Kuesioner Indeks Kepuasan Masyarakat</CardTitle>
                  <CardDescription>
                    Silakan berikan tanggapan objektif sesuai pengalaman layanan yang telah Anda terima
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {loading ? (
                <div className="w-full h-72 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
                  <span className="text-xs font-medium text-slate-500">Memuat butir pertanyaan survey...</span>
                </div>
              ) : (
                <div className="space-y-6 divide-y divide-slate-100">
                  {feedbacks.map((r) => (
                    <div key={r.id} className="pt-5 first:pt-0">
                      <FeedbackFieldItem data={r} level={0} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Footer */}
          {!loading && (
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/feedbacks")}
                disabled={submitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={submitting}
                leftIcon={<Send className="w-4 h-4" />}
                className="shadow-md"
              >
                Kirim Evaluasi & Feedback
              </Button>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  )
}

export default memo(FeedbackDetailPage)