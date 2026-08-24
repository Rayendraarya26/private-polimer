import React, { useState } from "react"
import { Button } from "../ui/Button"
import { Send } from "lucide-react"

interface Step4PernyataanProps {
  onBack?: () => void
  onSubmit?: () => void
  hideButtons?: boolean
  isChecked?: boolean
  onCheckChange?: (checked: boolean) => void
  isSubmitting?: boolean
}

const Step4Pernyataan: React.FC<Step4PernyataanProps> = ({
  onBack,
  onSubmit,
  hideButtons = false,
  isChecked: controlledChecked,
  onCheckChange,
  isSubmitting = false,
}) => {
  const [internalChecked, setInternalChecked] = useState(false)
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setInternalChecked(checked)
    if (onCheckChange) {
      onCheckChange(checked)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Pernyataan</h3>
        <p className="text-xs text-slate-500 mt-1">
          Konfirmasi dan setujui pernyataan untuk menyelesaikan permohonan.
        </p>
      </div>

      <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <label className="flex items-start gap-3 cursor-pointer select-none group">
          <input
            type="checkbox"
            id="checkbox-pernyataan"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer transition"
          />
          <span className="text-xs text-slate-700 font-medium group-hover:text-slate-900 leading-relaxed">
            Saya sudah melakukan pengecekan kembali data yang akan saya kirim, dan saya menyatakan bahwa data yang saya isikan benar
          </span>
        </label>
      </div>

      {!hideButtons && (
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          {onBack ? (
            <Button variant="outline" type="button" onClick={onBack} className="px-6">
              Kembali
            </Button>
          ) : (
            <div />
          )}
          <Button
            type="button"
            onClick={onSubmit}
            disabled={!isChecked || isSubmitting}
            isLoading={isSubmitting}
            leftIcon={<Send className="w-4 h-4" />}
            className="px-6 bg-brand-600 hover:bg-brand-700 text-white"
          >
            Kirim Permohonan
          </Button>
        </div>
      )}
    </div>
  )
}

export default Step4Pernyataan
