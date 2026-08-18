import React, { memo, useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { FeedbackInputType, FeedbackStructure } from "../../types/feedbacks"
import { FeedbackFormFields } from "../../hooks/feedback/useFeedback"

type Props = {
  level: number
  data: FeedbackStructure
}

const RATING_OPTIONS = [
  { value: 20, label: "Sangat Kurang", color: "hover:border-rose-300 peer-checked:bg-rose-50 peer-checked:border-rose-500 peer-checked:text-rose-700" },
  { value: 40, label: "Kurang", color: "hover:border-amber-300 peer-checked:bg-amber-50 peer-checked:border-amber-500 peer-checked:text-amber-700" },
  { value: 60, label: "Cukup", color: "hover:border-sky-300 peer-checked:bg-sky-50 peer-checked:border-sky-500 peer-checked:text-sky-700" },
  { value: 80, label: "Baik", color: "hover:border-emerald-300 peer-checked:bg-emerald-50 peer-checked:border-emerald-500 peer-checked:text-emerald-700" },
  { value: 100, label: "Sangat Baik", color: "hover:border-brand-300 peer-checked:bg-brand-50 peer-checked:border-brand-600 peer-checked:text-brand-700" },
]

const FeedbackFieldItem: React.FC<Props> = ({ data, level }) => {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<FeedbackFormFields>()

  const fieldIndex = useMemo<number>(() => {
    const fields = getValues("feedbacks") || []
    return fields.findIndex((r) => r.id === data.id)
  }, [data, getValues])

  const isInvalid = !!(errors?.feedbacks?.[fieldIndex]?.value?.message || "")

  return (
    <div className="space-y-3" style={{ paddingLeft: `${level * 1.5}rem` }}>
      {/* Question Title */}
      <div className="text-xs font-bold text-slate-800 flex items-start gap-2">
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
            className={`w-full rounded-lg border bg-white p-3 text-xs text-slate-800 transition-colors focus:outline-none focus:ring-2 ${
              isInvalid
                ? "border-rose-400 focus:ring-rose-400 bg-rose-50/20"
                : "border-slate-300 focus:ring-brand-500 focus:border-brand-500"
            }`}
            {...register(`feedbacks.${fieldIndex}.value`)}
          />
        </div>
      )}

      {data.input_type === FeedbackInputType.NUMBER && (
        <div className="w-full sm:w-48">
          <input
            type="number"
            placeholder="Masukkan skor nilai..."
            required={data.required}
            className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 transition-colors focus:outline-none focus:ring-2 ${
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
          {RATING_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="relative flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 cursor-pointer transition-all text-center select-none group"
            >
              <input
                type="radio"
                name={`radio-${data.id}`}
                value={opt.value}
                required={data.required}
                onChange={(e) => {
                  if (e.target.checked) {
                    setValue(`feedbacks.${fieldIndex}.value`, opt.value, { shouldValidate: true })
                  }
                }}
                className="sr-only peer"
              />
              <span className="text-xs font-semibold text-slate-700 peer-checked:font-bold transition-colors">
                {opt.label}
              </span>
              <span className="text-[10px] text-slate-400 peer-checked:text-slate-600 mt-0.5">
                (Skor {opt.value})
              </span>
              <div
                className={`absolute inset-0 rounded-xl border-2 border-transparent pointer-events-none transition-all ${opt.color}`}
              />
            </label>
          ))}
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