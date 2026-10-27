import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import { Plus, Send, HelpCircle, MessageSquare } from "lucide-react"
import useQuestion from "../../hooks/ask-questions/useQuestion"
import toast from "react-hot-toast"
import { Modal } from "../ui/Modal"
import { Button } from "../ui/Button"
import {
  FormField,
  TextInput,
  TextareaInput,
  SelectInput,
} from "../forms"

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
          toast.success("Pertanyaan berhasil diajukan ke tim teknis")
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
          className="shadow-elevated rounded-full hover:scale-105 font-bold text-sm bg-brand-600 hover:bg-brand-700"
        >
          Ajukan Pertanyaan Baru
        </Button>
      </div>

      {/* Modal Dialog Form */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Pusat Bantuan & Konsultasi Teknis"
        description="Pilih topik layanan dan sampaikan pertanyaan Anda secara spesifik kepada tim teknis BBKKP"
        size="md"
      >
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Topik Selection */}
          <FormField
            label="Topik Pertanyaan / Bidang Layanan"
            required
            helperText={selectedTopic?.desc || "Pilih kategori topik pertanyaan Anda"}
          >
            <SelectInput
              placeholder="-- Pilih Topik Pertanyaan --"
              searchPlaceholder="Cari topik layanan..."
              options={topics.map((r) => ({
                value: r.id,
                label: r.name,
                description: r.desc,
              }))}
              value={topic}
              onChange={(val) => setTopic(String(val))}
            />
          </FormField>

          {/* ID Layanan (Optional / Conditional) */}
          {selectedTopic && selectedTopic.name !== "Umum" && (
            <FormField
              label="Nomor Registrasi / Kode Permohonan"
              required
              helperText="Masukkan nomor permohonan yang terkait dengan kendala Anda"
            >
              <TextInput
                placeholder="Contoh: ORD-2026-08-001 / LABKAL-26-012"
                value={layanan}
                onChange={(e) => setLayanan(e.target.value || "")}
                required
              />
            </FormField>
          )}

          {/* Isi Pertanyaan */}
          <FormField
            label="Isi Pertanyaan atau Uraian Kendala"
            required
            helperText="Jelaskan kendala, nomor sampel/alat, atau informasi yang dibutuhkan secara jelas"
          >
            <TextareaInput
              rows={4}
              required
              showCount
              maxLength={1000}
              placeholder="Tuliskan detail pertanyaan atau kendala yang Anda alami..."
              value={question}
              onChange={(e) => setQuestion(e.target.value || "")}
            />
          </FormField>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-semibold"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={submitting}
              leftIcon={<Send className="w-4 h-4" />}
              className="px-5 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-700 shadow-sm"
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
