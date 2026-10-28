import React from "react"
import type { LucideIcon } from "lucide-react"
import { sectionCls } from "./formStyles"

interface StepPanelProps {
  step: number
  total: number
  icon: LucideIcon
  title: string
  description: string
  children: React.ReactNode
}

/**
 * Pembungkus bersama untuk setiap langkah formulir kalibrasi.
 * Eyebrow "Langkah X dari Y" valid karena wizard memang berurutan.
 */
export const StepPanel: React.FC<StepPanelProps> = ({
  step,
  total,
  icon: Icon,
  title,
  description,
  children,
}) => (
  <section className={sectionCls}>
    <header className="flex items-start gap-4 px-6 pt-6 pb-5 border-b border-slate-100">
      <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 shrink-0">
        <Icon className="w-5 h-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase text-brand-700">
          Langkah {step} dari {total}
        </p>
        <h2 className="text-lg font-semibold text-slate-900 tracking-tight">{title}</h2>
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
      </div>
    </header>
    <div className="p-6 space-y-6">{children}</div>
  </section>
)

export default StepPanel
