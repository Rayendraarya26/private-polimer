import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import { Plus, Send, HelpCircle } from "lucide-react"
import useQuestion from "../../hooks/ask-questions/useQuestion"
import toast from "react-hot-toast"
import { Modal } from "../ui/Modal"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"

type Props = {
  onAfterAdded: () => void
}

const NewQuestoin: React.FC<Props> = ({ onAfterAdded }) => {
  const [showForm, setShowForm] = useState<boolean>(false)
  const [topic, setTopic] = useState<string>("")
  const [layanan, setLayanan] = useState<string>("")
  const [question, setQuestion] = useState<string>("")
  const { submitting, topics, createQuestion, getQuestionTopic } = useQuestion()

  const selectedTopic = useMemo(() => {
    return topics.find((r) => r.id === topic)
  }, [topics, topic])

  useEffect(() => {
    if (showForm) {
      getQuestionTopic()
      setTopic("")
      setQuestion("")
      setLayanan("")
    }
  }, [showForm])

  useEffect(() => {
    setLayanan("")
  }, [topic])

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!selectedTopic || !question.trim()) return

      createQuestion(
        {
          topic: selectedTopic.name,
          question,
          layanan,
        },
        () => {
          setShowForm(false)
          onAfterAdded()
          toast.success("Pertanyaan berhasil diajukan")
        }
      )
    },
    [selectedTopic, question, layanan, onAfterAdded, createQuestion]
  )

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <Button
          variant="primary"
          size="lg"
          leftIcon={<Plus className="w-5 h-5" />}
          onClick={() => setShowForm(true)}
          className="shadow-elevated rounded-full hover:scale-105"
        >
          Ajukan Pertanyaan Baru
        </Button>
      </div>

      {/* Modal Dialog Form */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Ajukan Pertanyaan Baru"
        description="Pilih topik layanan dan sampaikan pertanyaan Anda kepada tim teknis BBKKP"
        size="md"
      >
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Topik Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Topik Pertanyaan <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value || "")}
              className="w-full bg-white text-slate-900 text-sm rounded-lg border border-slate-300 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="" disabled>
                -- Pilih Topik Pertanyaan --
              </option>
              {topics.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            {selectedTopic?.desc && (
              <p className="text-xs text-slate-500">{selectedTopic.desc}</p>
            )}
          </div>

          {/* ID Layanan (Optional / Conditional) */}
          {selectedTopic && selectedTopic.name !== "Umum" && (
            <Input
              label="ID / Kode Permohonan Layanan"
              placeholder="Contoh: ORD-2026-08-001"
              value={layanan}
              onChange={(e) => setLayanan(e.target.value || "")}
              required
            />
          )}

          {/* Isi Pertanyaan */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Isi Pertanyaan / Kendala <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Tuliskan detail pertanyaan atau kendala yang Anda alami..."
              value={question}
              onChange={(e) => setQuestion(e.target.value || "")}
              className="w-full bg-white text-slate-900 text-sm rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowForm(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={submitting}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Kirim Pertanyaan
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default memo(NewQuestoin)
