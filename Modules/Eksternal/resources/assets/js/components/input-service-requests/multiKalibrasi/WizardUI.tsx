import React from "react"
import { Check, Info, AlertTriangle } from "lucide-react"
import { StickyFormActions } from "../../forms"

/**
 * Komponen UI lokal terstandarisasi untuk wizard Permohonan Kalibrasi.
 * Mengacu pada style guide flat, border-only, proporsional h-10, dan zero shadow.
 */

export const cx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ")

/** Kelas standar untuk input teks / select / number di dalam wizard */
export const inputClass =
  "w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-brand-600 focus:outline-none focus:ring-0 shadow-none"

export const textareaClass =
  "w-full min-h-[80px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-brand-600 focus:outline-none focus:ring-0 shadow-none resize-y"

/* ------------------------------------------------------------------ */
/* Panel utama setiap langkah                                           */
/* ------------------------------------------------------------------ */
interface StepPanelProps {
  icon: React.ElementType
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  flush?: boolean
}

export const StepPanel: React.FC<StepPanelProps> = ({
  icon: Icon,
  title,
  description,
  action,
  children,
  flush = false,
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-none">
    <header className="px-5 sm:px-6 py-3.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
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
      <span className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center text-white shadow-2xs transition-transform duration-150">
        <Check className="w-3 h-3 text-white" strokeWidth={3} />
      </span>
    ) : (
      <span className="w-5 h-5 rounded-full border-2 border-slate-300 block bg-white transition-colors group-hover:border-slate-400" />
    )}
  </span>
)

interface OptionCardProps {
  id?: string
  selected: boolean
  onSelect: () => void
  title: React.ReactNode
  description?: React.ReactNode
  badge?: React.ReactNode
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
  badge,
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
      "group relative flex gap-3.5 rounded-xl border text-left cursor-pointer select-none transition-all duration-200 outline-none focus:outline-none ring-0",
      description ? "items-start" : "items-center",
      compact ? "px-3.5 py-3 min-h-[50px]" : "p-4 min-h-[56px]",
      selected
        ? "border-2 border-brand-600 bg-brand-50/25 ring-1 ring-brand-500/20 shadow-2xs"
        : "border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
    )}
  >
    {leading}
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <p
          className={cx(
            "text-[13px] font-bold leading-snug transition-colors",
            selected ? "text-brand-950" : "text-slate-800"
          )}
        >
          {title}
        </p>
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
        <p
          className={cx(
            "mt-1 text-xs leading-relaxed transition-colors",
            selected ? "text-slate-600" : "text-slate-500"
          )}
        >
          {description}
        </p>
      )}
      {children}
    </div>
    <div className={description ? "mt-0.5" : ""}>
      <RadioDot selected={selected} />
    </div>
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

