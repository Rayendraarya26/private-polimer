import React, { useState } from "react"
import { ShieldCheck, ChevronDown, ChevronUp, FileText, CheckCircle2 } from "lucide-react"

export interface LegalStatementBoxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  title: string
  subtitle?: string
  keyPoints?: string[]
  bulletPoints?: string[]
  checkboxLabel?: string
  subtext?: string
  legalFullText?: string | React.ReactNode
  legalTitle?: string
  required?: boolean
  disabled?: boolean
  className?: string
  badgeText?: string
}

export const LegalStatementBox: React.FC<LegalStatementBoxProps> = ({
  checked,
  onChange,
  title,
  subtitle,
  keyPoints = [],
  bulletPoints,
  checkboxLabel,
  subtext,
  legalFullText,
  legalTitle = "Teks Klausul & Dasar Hukum Lengkap",
  required = true,
  disabled = false,
  className = "",
  badgeText,
}) => {
  const [showFullText, setShowFullText] = useState(false)
  const points = keyPoints.length > 0 ? keyPoints : (bulletPoints || [])
  const displayTitle = checkboxLabel || title
  const displaySubtitle = subtitle || subtext

  return (
    <div
      className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
        checked
          ? "bg-brand-50/60 border-brand-600 ring-2 ring-brand-500/15 shadow-sm"
          : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
      } ${className}`}
    >
      {/* Main interactive area */}
      <div className="p-4 sm:p-5">
        <label className="flex items-start gap-3.5 sm:gap-4 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            className="mt-1 w-5 h-5 rounded-md text-brand-600 focus:ring-brand-500 border-slate-300 shrink-0 cursor-pointer disabled:opacity-50"
          />

          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-900 tracking-tight">
                {displayTitle}
                {required && <span className="text-rose-500 ml-1">*</span>}
              </span>
              {badgeText && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-700 border border-brand-200">
                  {badgeText}
                </span>
              )}
            </div>

            {displaySubtitle && (
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {displaySubtitle}
              </p>
            )}

            {/* Scannable Key Points */}
            {points.length > 0 && (
              <div className="pt-1 space-y-1.5">
                {points.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </label>

        {/* Legal Text Drawer Button */}
        {legalFullText && (
          <div className="mt-3.5 pt-3 border-t border-slate-200/80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowFullText(!showFullText)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-brand-600" />
              <span>{showFullText ? "Tutup Teks Hukum" : legalTitle}</span>
              {showFullText ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <span className="text-[11px] text-slate-400">
              {showFullText ? "Klausul resmi" : "Klik untuk membaca pasal"}
            </span>
          </div>
        )}
      </div>

      {/* Expandable Legal Text */}
      {legalFullText && showFullText && (
        <div className="bg-white px-5 py-4 border-t border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2 animate-in fade-in-50 duration-200">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            Dasar Hukum & Ketentuan Resmi:
          </div>
          <div className="prose prose-xs max-w-none text-slate-600 space-y-1.5 text-[11px] sm:text-xs">
            {typeof legalFullText === "string" ? (
              <p className="whitespace-pre-line">{legalFullText}</p>
            ) : (
              legalFullText
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default LegalStatementBox
