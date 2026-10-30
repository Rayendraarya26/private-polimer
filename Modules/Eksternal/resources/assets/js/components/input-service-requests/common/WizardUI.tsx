import React from "react"
import { Check, Info, AlertTriangle, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "../../ui/Button"
import { StickyFormActions } from "../../forms"

/**
 * Komponen UI terstandarisasi untuk seluruh formulir permohonan layanan eksternal.
 * Mengacu pada desain teruji di Form Permohonan Kalibrasi:
 * Flat border-only, proporsional h-10, header card ringkas, zero shadow.
 */

export const cx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ")

/** Kelas standar untuk input teks / number di dalam wizard */
export const inputClass =
  "w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-brand-600 focus:outline-none focus:ring-0 shadow-none"

/** Kelas standar untuk dropdown select di dalam wizard */
export const selectClass = cx(inputClass, "cursor-pointer pr-9")

/** Kelas standar untuk textarea di dalam wizard */
export const textareaClass =
  "w-full min-h-[80px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-brand-600 focus:outline-none focus:ring-0 shadow-none resize-y"

/* ------------------------------------------------------------------ */
/* Panel Utama Langkah Wizard (StepPanel)                             */
/* ------------------------------------------------------------------ */
export interface StepPanelProps {
  icon: React.ElementType
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  flush?: boolean
  className?: string
}

export const StepPanel: React.FC<StepPanelProps> = ({
  icon: Icon,
  title,
  description,
  action,
  children,
  flush = false,
  className,
}) => (
  <section
    className={cx(
      "rounded-2xl border border-slate-200 bg-white shadow-none",
      flush ? "overflow-hidden" : "overflow-visible",
      className
    )}
  >
    <header className="px-5 sm:px-6 py-3.5 border-b border-slate-200 rounded-t-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
      <div>
        <h2 className="text-base sm:text-[17px] font-bold text-slate-900 flex items-center gap-2.5">
          <Icon className="w-5 h-5 text-brand-600 shrink-0" />
          <span>{title}</span>
        </h2>
        {description && (
          <p className="text-xs sm:text-[13px] text-slate-500 mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </header>
    <div className={flush ? "" : "p-6 sm:p-7 space-y-7"}>{children}</div>
  </section>
)

/* ------------------------------------------------------------------ */
/* Judul Sub-bagian (SectionHeading)                                   */
/* Catatan: Sub-bagian umum tidak memakai nomor. Nomor bersifat        */
/* opsional dan digunakan khusus untuk konteks urutan item berulang   */
/* (misal: daftar informasi alat-alat yang dikalibrasi pada kalibrasi)*/
/* ------------------------------------------------------------------ */
export interface SectionHeadingProps {
  number?: number | string
  title: string
  description?: string
  optional?: boolean
  required?: boolean
  action?: React.ReactNode
  className?: string
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  number,
  title,
  description,
  optional,
  required,
  action,
  className = "",
}) => (
  <div className={`flex items-start justify-between gap-3 mb-4 ${className}`}>
    <div className="flex items-start gap-3 min-w-0">
      {number !== undefined && number !== null && number !== "" && (
        <span className="w-6 h-6 rounded-md bg-brand-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
          {number}
        </span>
      )}
      <div className="min-w-0">
        <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 leading-snug">
          {title}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
          {optional && <span className="ml-1.5 text-xs font-normal text-slate-400">(opsional)</span>}
        </h3>
        {description && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>}
      </div>
    </div>
    {action}
  </div>
)

/* ------------------------------------------------------------------ */
/* Label & Hint Input (FieldLabel, FieldHint)                          */
/* ------------------------------------------------------------------ */
export interface FieldLabelProps {
  children: React.ReactNode
  required?: boolean
  optional?: boolean
  htmlFor?: string
  className?: string
}

export const FieldLabel: React.FC<FieldLabelProps> = ({
  children,
  required,
  optional,
  htmlFor,
  className = "",
}) => (
  <label
    htmlFor={htmlFor}
    className={`block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5 ${className}`}
  >
    {children}
    {required && <span className="text-rose-500 ml-0.5">*</span>}
    {optional && <span className="ml-1 font-normal text-slate-400">(opsional)</span>}
  </label>
)

export const FieldHint: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <p className={`mt-1 text-xs text-slate-400 leading-relaxed ${className}`}>{children}</p>
)

/* ------------------------------------------------------------------ */
/* Pilihan Radio & Kartu (RadioDot, OptionIcon, OptionCard, OptionGroup)*/
/* ------------------------------------------------------------------ */
export const RadioDot: React.FC<{ selected: boolean }> = ({ selected }) => (
  <span className="shrink-0">
    {selected ? (
      <span className="w-[18px] h-[18px] rounded-full border border-brand-600 flex items-center justify-center text-brand-600 bg-white">
        <Check className="w-3 h-3" strokeWidth={2.5} />
      </span>
    ) : (
      <span className="w-[18px] h-[18px] rounded-full border border-slate-300 block bg-white" />
    )}
  </span>
)

export const OptionIcon: React.FC<{ icon: React.ElementType; active: boolean; className?: string }> = ({
  icon: Icon,
  active,
  className = "",
}) => (
  <span
    className={cx(
      "w-8 h-8 rounded-md border flex items-center justify-center shrink-0 transition-colors",
      active
        ? "border-brand-500 bg-brand-50 text-brand-700"
        : "border-slate-200 bg-white text-slate-500 group-hover:border-slate-300",
      className
    )}
  >
    <Icon className="w-4 h-4" />
  </span>
)

export interface OptionCardProps {
  id?: string
  selected: boolean
  onSelect: () => void
  category?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  badge?: React.ReactNode
  leading?: React.ReactNode
  compact?: boolean
  children?: React.ReactNode
  className?: string
}

export const OptionCard: React.FC<OptionCardProps> = ({
  id,
  selected,
  onSelect,
  category,
  title,
  description,
  badge,
  leading,
  compact = false,
  children,
  className = "",
}) => (
  <div
    id={id}
    role="radio"
    aria-checked={selected}
    tabIndex={0}
    onClick={onSelect}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onSelect()
      }
    }}
    style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
    className={cx(
      "group relative flex items-center gap-3 rounded-lg border text-left cursor-pointer select-none transition-all duration-150 shadow-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0",
      compact ? "px-3.5 py-2.5 min-h-[48px]" : "p-4 min-h-[54px]",
      selected
        ? "border-2 border-brand-600 bg-white"
        : "border border-slate-200 bg-white hover:border-slate-300",
      className
    )}
  >
    {leading}
    <div className="flex-1 min-w-0">
      {category && (
        <p className="text-[11px] font-medium text-slate-400 mb-0.5 tracking-wide">
          {category}
        </p>
      )}
      <div className="flex items-center justify-between gap-2">
        <div className="text-[14px] font-bold text-slate-900 leading-snug">
          {title}
        </div>
        {badge && (
          <span
            className={cx(
              "text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 transition-colors",
              selected
                ? "bg-brand-100/80 text-brand-700 border-brand-200"
                : "bg-slate-100 text-slate-600 border-slate-200"
            )}
          >
            {badge}
          </span>
        )}
      </div>
      {description && (
        <p className="mt-0.5 text-[12px] leading-relaxed text-slate-500">{description}</p>
      )}
      {children}
    </div>
    <RadioDot selected={selected} />
  </div>
)

const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
}

export const OptionGroup: React.FC<{
  label: string
  cols?: 1 | 2 | 3 | 4
  className?: string
  children: React.ReactNode
}> = ({ label, cols = 2, className = "", children }) => (
  <div role="radiogroup" aria-label={label} className={cx("grid gap-3.5", GRID_COLS[cols] || "grid-cols-1 sm:grid-cols-2", className)}>
    {children}
  </div>
)

/* ------------------------------------------------------------------ */
/* Callout Pemberitahuan (Callout)                                     */
/* ------------------------------------------------------------------ */
export interface CalloutProps {
  tone?: "info" | "warning" | "success" | "danger"
  icon?: React.ElementType
  children: React.ReactNode
  className?: string
}

export const Callout: React.FC<CalloutProps> = ({
  tone = "info",
  icon,
  children,
  className = "",
}) => {
  const Icon =
    icon ||
    (tone === "warning" || tone === "danger"
      ? AlertTriangle
      : Info)

  const toneStyles = {
    info: "bg-slate-50/70 border-slate-200 text-slate-600 [&_svg]:text-brand-600",
    warning: "bg-amber-50/80 border-amber-200 text-amber-900 [&_svg]:text-amber-600",
    success: "bg-emerald-50/80 border-emerald-200 text-emerald-900 [&_svg]:text-emerald-600",
    danger: "bg-rose-50/80 border-rose-200 text-rose-900 [&_svg]:text-rose-600",
  }

  return (
    <div
      className={cx(
        "flex items-center gap-2.5 rounded-xl border px-4 py-3 text-xs sm:text-[13px] leading-relaxed shadow-none",
        toneStyles[tone] || toneStyles.info,
        className
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <div className="min-w-0">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Baris Rekapitulasi Data (SummaryRow)                               */
/* ------------------------------------------------------------------ */
export interface SummaryRowProps {
  label: string
  value: React.ReactNode
  labelWidth?: string
  className?: string
  highlight?: boolean
}

export const SummaryRow: React.FC<SummaryRowProps> = ({
  label,
  value,
  labelWidth = "190px",
  className = "",
  highlight = false,
}) => (
  <div
    className={`grid grid-cols-[${labelWidth}_10px_1fr] items-start py-0.5 text-xs sm:text-[13px] ${className}`}
    style={{ gridTemplateColumns: `${labelWidth} 10px 1fr` }}
  >
    <span className="text-slate-500 font-medium">{label}</span>
    <span className="text-slate-400">:</span>
    <span className={cx(highlight ? "font-bold text-brand-700" : "font-medium text-slate-900")}>
      {value ?? "-"}
    </span>
  </div>
)

/* ------------------------------------------------------------------ */
/* Kartu Review Item (ReviewCard)                                     */
/* Digunakan untuk rekap alat, sampel uji, komoditi, dll.             */
/* ------------------------------------------------------------------ */
export interface ReviewCardProps {
  number?: number | string
  title: React.ReactNode
  extraHeader?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  number,
  title,
  extraHeader,
  children,
  className = "",
}) => (
  <div className={cx("rounded-xl border border-slate-200 overflow-hidden bg-white shadow-none", className)}>
    <div className="bg-slate-50/90 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-1.5">
        {number !== undefined && (
          <span className="text-slate-600 text-sm font-normal">#{number} | </span>
        )}
        <strong className="text-slate-900 text-sm font-bold">{title}</strong>
      </div>
      {extraHeader && <div>{extraHeader}</div>}
    </div>
    <div className="p-4 space-y-3.5 text-xs sm:text-[13px]">{children}</div>
  </div>
)

/* ------------------------------------------------------------------ */
/* Navigasi Bawah Langkah (WizardNav)                                  */
/* ------------------------------------------------------------------ */
export interface WizardNavProps {
  onBack?: () => void
  onNext: () => void
  nextLabel?: string
  backLabel?: string
  loading?: boolean
  disabled?: boolean
  className?: string
}

export const WizardNav: React.FC<WizardNavProps> = ({
  onBack,
  onNext,
  nextLabel = "Selanjutnya",
  backLabel = "Sebelumnya",
  loading = false,
  disabled = false,
  className,
}) => (
  <div className={cx("flex items-center justify-between pt-4 border-t border-slate-200 mt-6", className)}>
    <div>
      {onBack ? (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading || disabled}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="px-5 py-2.5 font-semibold text-xs border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl"
        >
          {backLabel}
        </Button>
      ) : (
        <div />
      )}
    </div>

    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="primary"
        onClick={onNext}
        disabled={loading || disabled}
        isLoading={loading}
        rightIcon={!loading ? <ArrowRight className="w-4 h-4" /> : undefined}
        className="px-6 py-2.5 font-bold text-xs shadow-sm bg-brand-600 hover:bg-brand-700 text-white rounded-xl"
      >
        {nextLabel}
      </Button>
    </div>
  </div>
)
