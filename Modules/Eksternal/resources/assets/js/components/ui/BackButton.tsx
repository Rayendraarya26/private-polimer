import React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button, ButtonProps } from "./Button"

export interface BackButtonProps extends Omit<ButtonProps, "onClick"> {
  /**
   * Rute tujuan navigasi (misal: "/dashboard", "/permohonan").
   * Jika tidak diisi, otomatis kembali ke halaman sebelumnya (navigate(-1)).
   */
  to?: string | number
  /**
   * Handler opsional sebelum navigasi dijalankan.
   * Jika handler memanggil `e.preventDefault()`, navigasi otomatis akan dibatalkan.
   */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  /**
   * Label teks tombol (default: "Kembali")
   */
  label?: React.ReactNode
}

export const BackButton: React.FC<BackButtonProps> = ({
  to,
  onClick,
  label = "Kembali",
  variant = "outline",
  size = "sm",
  leftIcon = <ArrowLeft className="w-4 h-4" />,
  className = "shrink-0",
  children,
  ...props
}) => {
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e)
      if (e.defaultPrevented) return
    }

    if (typeof to === "string" || typeof to === "number") {
      navigate(to as any)
    } else {
      navigate(-1)
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      leftIcon={leftIcon}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children || label}
    </Button>
  )
}

export default BackButton
