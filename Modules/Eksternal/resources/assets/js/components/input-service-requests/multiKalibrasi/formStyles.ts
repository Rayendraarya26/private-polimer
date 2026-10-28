// Token gaya bersama untuk form permohonan kalibrasi (minimalis modern)

export const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 " +
  "focus:outline-none focus:border-brand-600 focus:ring-0"

export const labelCls = "block text-[13px] font-medium text-slate-700 mb-1.5"

export const hintCls = "text-xs text-slate-500 mt-1"

export const sectionCls = "bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"

export const sectionHeaderCls = "px-6 pt-6 pb-1"

export const sectionTitleCls = "text-base font-semibold text-slate-900 tracking-tight"

export const sectionDescCls = "text-sm text-slate-500 mt-0.5"

export const optionCardCls = (active: boolean) =>
  `relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
    active
      ? "border-brand-500 bg-brand-50/40 ring-4 ring-brand-500/10"
      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
  }`

export const formatRupiah = (n: number) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`
