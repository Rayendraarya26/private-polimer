import React, { useState, useRef, useEffect } from "react"
import { HelpCircle, Info } from "lucide-react"

export interface InfoTooltipProps {
  content: React.ReactNode
  title?: string
  icon?: "help" | "info"
  className?: string
  iconSize?: number
  position?: "top" | "bottom"
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  title,
  icon = "help",
  className = "",
  iconSize = 14,
  position = "top",
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsVisible(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center align-middle ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <button
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        className="text-slate-400 hover:text-brand-600 focus:outline-hidden transition-colors cursor-pointer p-0.5 rounded-full hover:bg-slate-100"
        aria-label="Informasi tambahan"
      >
        {icon === "help" ? (
          <HelpCircle style={{ width: iconSize, height: iconSize }} />
        ) : (
          <Info style={{ width: iconSize, height: iconSize }} />
        )}
      </button>

      {/* Floating Tooltip Bubble */}
      {isVisible && (
        <div
          className={`absolute z-50 w-64 sm:w-72 p-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs leading-relaxed pointer-events-auto animate-in fade-in-50 zoom-in-95 duration-150 ${
            position === "top"
              ? "bottom-full left-1/2 -translate-x-1/2 mb-2"
              : "top-full left-1/2 -translate-x-1/2 mt-2"
          }`}
          role="tooltip"
        >
          {title && (
            <div className="font-bold text-white mb-1 pb-1 border-b border-slate-700 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-brand-400" />
              <span>{title}</span>
            </div>
          )}
          <div className="text-slate-200 text-[11px] leading-normal">{content}</div>

          {/* Tooltip arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${
              position === "top"
                ? "top-full border-t-slate-900"
                : "bottom-full border-b-slate-900"
            }`}
          />
        </div>
      )}
    </div>
  )
}

export default InfoTooltip
