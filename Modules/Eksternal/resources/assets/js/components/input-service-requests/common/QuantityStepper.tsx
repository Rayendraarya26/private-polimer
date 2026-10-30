import React from "react"
import { Minus, Plus } from "lucide-react"

export interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  title?: string
  className?: string
  size?: "sm" | "md"
}

/**
 * Komponen Numeric Stepper terstandarisasi untuk form permohonan layanan.
 * Tampilan modern [-] [ 1 ] [+] dengan border flat, zero shadow, dan tombol direct typing.
 */
export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onChange,
  min = 1,
  max,
  step = 1,
  disabled = false,
  title,
  className = "",
  size = "md",
}) => {
  const isMin = value <= min
  const isMax = max !== undefined && value >= max

  const handleDecrease = () => {
    if (disabled || isMin) return
    const nextVal = Math.max(min, value - step)
    onChange(nextVal)
  }

  const handleIncrease = () => {
    if (disabled || isMax) return
    const nextVal = max !== undefined ? Math.min(max, value + step) : value + step
    onChange(nextVal)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    if (raw === "") {
      onChange(min)
      return
    }
    const parsed = parseInt(raw, 10)
    if (isNaN(parsed)) return

    let clamped = Math.max(min, parsed)
    if (max !== undefined) {
      clamped = Math.min(max, clamped)
    }
    onChange(clamped)
  }

  const isSmall = size === "sm"
  const btnDim = isSmall ? "w-6 h-7" : "w-7 h-8"
  const inputDim = isSmall ? "w-8 h-7 text-[11px]" : "w-10 h-8 text-xs"
  const iconDim = isSmall ? "w-3 h-3" : "w-3.5 h-3.5"

  return (
    <div
      className={`inline-flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-none transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : ""
      } ${className}`}
    >
      <button
        type="button"
        disabled={disabled || isMin}
        onClick={handleDecrease}
        className={`${btnDim} flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
        title={title ? `Kurangi ${title}` : "Kurangi jumlah"}
        aria-label="Kurangi jumlah"
      >
        <Minus className={iconDim} />
      </button>

      <input
        type="number"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={handleInputChange}
        title={title || `Jumlah (Maksimal ${max !== undefined ? max : "tidak terbatas"})`}
        className={`${inputDim} text-center font-bold text-slate-900 border-x border-slate-200 bg-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
      />

      <button
        type="button"
        disabled={disabled || isMax}
        onClick={handleIncrease}
        className={`${btnDim} flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
        title={title ? `Tambah ${title}` : "Tambah jumlah"}
        aria-label="Tambah jumlah"
      >
        <Plus className={iconDim} />
      </button>
    </div>
  )
}

export default QuantityStepper
