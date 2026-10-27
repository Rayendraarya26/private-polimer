import React, { memo, useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { Check } from "lucide-react"
import { FeedbackInputType, FeedbackStructure } from "../../types/feedbacks"
import { FeedbackFormFields } from "../../hooks/feedback/useFeedback"

type Props = {
  level: number
  data: FeedbackStructure
}

const RATING_OPTIONS = [
  {
    value: 20,
    label: "Sangat Kurang",
    selectedBg: "bg-rose-50/80 border-rose-500 ring-2 ring-rose-500/20 shadow-xs",
    selectedText: "text-rose-900 font-bold",
    selectedScore: "bg-rose-100 text-rose-700 font-semibold",
    checkColor: "text-rose-600",
    hoverBorder: "hover:border-rose-300",
  },
  {
    value: 40,
    label: "Kurang",
    selectedBg: "bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20 shadow-xs",
    selectedText: "text-amber-900 font-bold",
    selectedScore: "bg-amber-100 text-amber-700 font-semibold",
    checkColor: "text-amber-600",
    hoverBorder: "hover:border-amber-300",
  },
  {
    value: 60,
    label: "Cukup",
    selectedBg: "bg-sky-50/80 border-sky-500 ring-2 ring-sky-500/20 shadow-xs",
    selectedText: "text-sky-900 font-bold",
    selectedScore: "bg-sky-100 text-sky-700 font-semibold",
    checkColor: "text-sky-600",
    hoverBorder: "hover:border-sky-300",
  },
  {
    value: 80,
    label: "Baik",
    selectedBg: "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs",
    selectedText: "text-emerald-900 font-bold",
    selectedScore: "bg-emerald-100 text-emerald-700 font-semibold",
    checkColor: "text-emerald-600",
    hoverBorder: "hover:border-emerald-300",
  },
  {
    value: 100,
    label: "Sangat Baik",
    selectedBg: "bg-brand-50/80 border-brand-600 ring-2 ring-brand-500/20 shadow-xs",
    selectedText: "text-brand-900 font-bold",
    selectedScore: "bg-brand-100 text-brand-700 font-semibold",
    checkColor: "text-brand-600",
    hoverBorder: "hover:border-brand-300",
  },
]

const FeedbackFieldItem: React.FC<Props> = ({ data, level }) => {
  const {
    register,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useFormContext<FeedbackFormFields>()

  const fieldIndex = useMemo<number>(() => {
    const fields = getValues("feedbacks") || []
    return fields.findIndex((r) => r.id === data.id)
  }, [data, getValues])

  const currentValue = watch(`feedbacks.${fieldIndex}.value`)
  const isInvalid = !!(errors?.feedbacks?.[fieldIndex]?.value?.message || "")

  return (
    <div className="space-y-3" style={{ paddingLeft: `${level * 1.5}rem` }}>
      {/* Question Title */}
      <div className="text-sm font-bold text-slate-900 flex items-start gap-2">
        <span>{data.question}</span>
        {data.required && <span className="text-rose-500">*</span>}
      </div>

      {/* Input Types */}
      {data.input_type === FeedbackInputType.TEXTAREA && (
        <div className="w-full sm:w-3/4">
          <textarea
            rows={3}
            placeholder="Tuliskan ulasan atau saran Anda di sini..."
            required={data.required}
            className={`w-full rounded-xl border bg-white p-3.5 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 placeholder:text-slate-400 ${
              isInvalid
                ? "border-rose-400 focus:ring-rose-400 bg-rose-50/20"
                : "border-slate-300 focus:ring-brand-500 focus:border-brand-500"
            }`}
            {...register(`feedbacks.${fieldIndex}.value`)}
          />
        </div>
      )}

      {data.input_type === FeedbackInputType.NUMBER && (
        <div className="w-full sm:w-56">
          <input
            type="number"
            placeholder="Masukkan skor nilai..."
            required={data.required}
            className={`w-full h-[42px] rounded-xl border bg-white px-4 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 placeholder:text-slate-400 ${
              isInvalid
                ? "border-rose-400 focus:ring-rose-400 bg-rose-50/20"
                : "border-slate-300 focus:ring-brand-500 focus:border-brand-500"
            }`}
            {...register(`feedbacks.${fieldIndex}.value`)}
          />
        </div>
      )}

      {data.input_type === FeedbackInputType.RANGE && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          {RATING_OPTIONS.map((opt) => {
            const isSelected = Number(currentValue) === opt.value

            return (
              <label
                key={opt.value}
                className={`relative flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all text-center select-none ${
                  isSelected
                    ? opt.selectedBg
                    : `border-slate-200 bg-white ${opt.hoverBorder} hover:bg-slate-50/60`
                }`}
              >
                <input
                  type="radio"
                  name={`radio-${data.id}`}
                  value={opt.value}
                  checked={isSelected}
                  required={data.required}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setValue(`feedbacks.${fieldIndex}.value`, opt.value, { shouldValidate: true })
                    }
                  }}
                  className="sr-only"
                />

                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white shadow-xs flex items-center justify-center">
                    <Check className={`w-2.5 h-2.5 ${opt.checkColor} stroke-[3]`} />
                  </div>
                )}

                <span
                  className={`text-xs transition-colors ${
                    isSelected ? opt.selectedText : "font-semibold text-slate-700"
                  }`}
                >
                  {opt.label}
                </span>

                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md mt-1 transition-colors ${
                    isSelected ? opt.selectedScore : "text-slate-400 bg-slate-50"
                  }`}
                >
                  (Skor {opt.value})
                </span>
              </label>
            )
          })}
        </div>
      )}

      {/* Validation Error Message */}
      {!!data.input_type && isInvalid && (
        <p className="text-[11px] font-medium text-rose-600">
          {errors?.feedbacks?.[fieldIndex]?.value?.message || "Pertanyaan ini wajib diisi"}
        </p>
      )}

      {/* Recursive Children Questions */}
      {(data?.child || []).map((r) => (
        <div key={r.id} className="pt-3 border-t border-slate-100">
          <FeedbackFieldItem data={r} level={level + 1} />
        </div>
      ))}
    </div>
  )
}

export default memo(FeedbackFieldItem)