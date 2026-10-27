import React from "react"
import { Check, ArrowLeft, ArrowRight, Info, AlertTriangle } from "lucide-react"
import { Button } from "../../../ui/Button"
import { StickyFormActions } from "../../../forms/StickyFormActions"

/**
 * Kumpulan komponen UI lokal untuk wizard Permohonan Pengujian.
 * Sengaja dibuat terpisah dari komponen form global agar perubahan gaya
 * di sini tidak memengaruhi formulir layanan lain.
 *
 * Catatan: proyek memakai Tailwind v3 — hindari utilitas khusus v4
 * (shadow-2xs, shadow-xs, ring-3, rounded-xs) karena tidak akan ter-generate.
 */

export const cx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ")

/** Kelas standar untuk input teks / select / number di dalam wizard */
export const inputClass =
  "w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-brand-600 focus:outline-none focus:ring-0 shadow-none"

export const textareaClass =
  "w-full min-h-[80px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-brand-600 focus:outline-none focus:ring-0 shadow-none resize-y"

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Panel utama setiap langkah                                           */
/* ------------------------------------------------------------------ */
interface StepPanelProps {
  icon: React.ElementType
  title: string
  description?: string
  children: React.ReactNode
  /** Hilangkan padding body (dipakai untuk daftar sampel full-width) */
  flush?: boolean
}

export const StepPanel: React.FC<StepPanelProps> = ({
  icon: Icon,
  title,
  description,
  children,
  flush = false,
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-none">
    <header className="px-6 sm:px-7 py-5 border-b border-slate-200">
      <h2 className="text-base sm:text-[17px] font-bold text-slate-900 flex items-center gap-2.5">
        <Icon className="w-5 h-5 text-brand-600 shrink-0" />
        <span>{title}</span>
      </h2>
      {description && (
        <p className="text-xs sm:text-[13px] text-slate-500 mt-1 leading-relaxed">
          {description}
        </p>
      )}
    </header>
    <div className={flush ? "" : "p-6 sm:p-7"}>{children}</div>
  </section>
)

/* ------------------------------------------------------------------ */
/* Judul sub-bagian bernomor                                            */
/* ------------------------------------------------------------------ */
interface SectionHeadingProps {
  number?: number
  title: string
  description?: string
  optional?: boolean
  required?: boolean
  action?: React.ReactNode
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  number,
  title,
  description,
  optional,
  required,
  action,
}) => (
  <div className="flex items-start justify-between gap-3 mb-4">
    <div className="flex items-start gap-3 min-w-0">
      {number !== undefined && (
        <span className="w-6 h-6 rounded-md bg-brand-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
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
/* Label + hint field                                                   */
/* ------------------------------------------------------------------ */
interface FieldLabelProps {
  children: React.ReactNode
  required?: boolean
  optional?: boolean
  htmlFor?: string
}

export const FieldLabel: React.FC<FieldLabelProps> = ({ children, required, optional, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
    {children}
    {required && <span className="text-rose-500 ml-0.5">*</span>}
    {optional && <span className="ml-1 font-normal text-slate-400">(opsional)</span>}
  </label>
)

export const FieldHint: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mt-1 text-xs text-slate-400 leading-relaxed">{children}</p>
)

/* ------------------------------------------------------------------ */
/* Kartu pilihan (radio)                                                */
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

interface OptionCardProps {
  id?: string
  selected: boolean
  onSelect: () => void
  title: React.ReactNode
  description?: React.ReactNode
  leading?: React.ReactNode
  compact?: boolean
  children?: React.ReactNode
}

export const OptionCard: React.FC<OptionCardProps> = ({
  id,
  selected,
  onSelect,
  title,
  description,
  leading,
  compact = false,
  children,
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
        : "border border-slate-200 bg-white hover:border-slate-300"
    )}
  >
    {leading}
    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-bold text-slate-900 leading-snug">
        {title}
      </p>
      {description && (
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{description}</p>
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
}

export const OptionGroup: React.FC<{
  label: string
  cols?: 1 | 2 | 3
  children: React.ReactNode
}> = ({ label, cols = 2, children }) => (
  <div role="radiogroup" aria-label={label} className={cx("grid gap-3.5", GRID_COLS[cols])}>
    {children}
  </div>
)

/* ------------------------------------------------------------------ */
/* Callout informasi                                                    */
/* ------------------------------------------------------------------ */
export const Callout: React.FC<{
  tone?: "info" | "warning"
  icon?: React.ElementType
  children: React.ReactNode
  className?: string
}> = ({ tone = "info", icon, children, className }) => {
  const Icon = icon || (tone === "warning" ? AlertTriangle : Info)
  return (
    <div
      className={cx(
        "flex items-center gap-2.5 rounded-xl border px-4 py-3 text-xs sm:text-[13px] leading-relaxed shadow-none",
        tone === "warning"
          ? "bg-amber-50/80 border-amber-200 text-amber-900"
          : "bg-slate-50/70 border-slate-200 text-slate-600",
        className
      )}
    >
      <Icon className={cx("w-4 h-4 shrink-0", tone === "warning" ? "text-amber-600" : "text-brand-600")} />
      <div className="min-w-0">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Navigasi bawah langkah                                               */
/* ------------------------------------------------------------------ */
export const WizardNav: React.FC<{
  onBack?: () => void
  onNext: () => void
  nextLabel?: string
}> = ({ onBack, onNext, nextLabel = "Selanjutnya" }) => (
  <StickyFormActions
    canGoBack={Boolean(onBack)}
    onBack={onBack}
    onNext={onNext}
    nextLabel={nextLabel}
    isSticky={false}
  />
)
