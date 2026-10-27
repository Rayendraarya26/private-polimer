import React, { useState } from "react"
import { ChevronDown, ChevronUp, LucideIcon, Sparkles } from "lucide-react"

export interface CollapsibleGuidelineProps {
  title: string
  summary?: React.ReactNode
  badgeText?: string
  variant?: "amber" | "brand" | "emerald" | "slate"
  icon?: LucideIcon
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
  expandLabel?: string
  collapseLabel?: string
}

export const CollapsibleGuideline: React.FC<CollapsibleGuidelineProps> = ({
  title,
  summary,
  badgeText,
  variant = "amber",
  icon: Icon = Sparkles,
  defaultOpen = false,
  children,
  className = "",
  expandLabel = "Lihat Ketentuan Lengkap",
  collapseLabel = "Sembunyikan Panduan",
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const variantStyles = {
    amber: {
      card: "bg-amber-50/60 border-amber-200/90 text-amber-950",
      iconBg: "text-amber-600 bg-amber-100/80",
      badge: "bg-amber-100 text-amber-900 border-amber-300",
      btn: "text-amber-800 hover:text-amber-950 bg-amber-100/60 hover:bg-amber-100",
      contentBorder: "border-amber-200/80",
    },
    brand: {
      card: "bg-brand-50/50 border-brand-200/90 text-brand-950",
      iconBg: "text-brand-600 bg-brand-100/80",
      badge: "bg-brand-100 text-brand-900 border-brand-300",
      btn: "text-brand-800 hover:text-brand-950 bg-brand-100/60 hover:bg-brand-100",
      contentBorder: "border-brand-200/80",
    },
    emerald: {
      card: "bg-emerald-50/50 border-emerald-200/90 text-emerald-950",
      iconBg: "text-emerald-600 bg-emerald-100/80",
      badge: "bg-emerald-100 text-emerald-900 border-emerald-300",
      btn: "text-emerald-800 hover:text-emerald-950 bg-emerald-100/60 hover:bg-emerald-100",
      contentBorder: "border-emerald-200/80",
    },
    slate: {
      card: "bg-slate-50 border-slate-200 text-slate-900",
      iconBg: "text-slate-600 bg-slate-200/80",
      badge: "bg-slate-200 text-slate-800 border-slate-300",
      btn: "text-slate-700 hover:text-slate-900 bg-slate-200/60 hover:bg-slate-200",
      contentBorder: "border-slate-200",
    },
  }[variant]

  return (
    <div className={`rounded-xl border transition-all duration-200 ${variantStyles.card} ${className}`}>
      {/* Header bar */}
      <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5 min-w-0">
          <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 sm:mt-0 ${variantStyles.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold tracking-tight">{title}</span>
              {badgeText && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${variantStyles.badge}`}>
                  {badgeText}
                </span>
              )}
            </div>
            {summary && <div className="text-xs mt-0.5 opacity-90">{summary}</div>}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer ${variantStyles.btn}`}
          aria-expanded={isOpen}
        >
          <span>{isOpen ? collapseLabel : expandLabel}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Content with smooth transition */}
      {isOpen && (
        <div className={`px-4 pb-4 pt-2 border-t text-xs leading-relaxed animate-in fade-in-50 duration-200 ${variantStyles.contentBorder}`}>
          {children}
        </div>
      )}
    </div>
  )
}

export default CollapsibleGuideline
