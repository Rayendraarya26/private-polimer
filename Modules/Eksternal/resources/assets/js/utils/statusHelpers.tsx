import React from "react"
import { Badge, BadgeProps } from "../components/ui/Badge"
import { titleCase } from "./string"
import { cn } from "./cn"

/**
 * Parameter terstruktur untuk penentuan status workflow pada halaman Detail.
 */
export interface StatusBadgeParams {
  status?: string | null
  isPendingApproval?: boolean
  isDitolak?: boolean
  isPenawaranDisetujui?: boolean
  isLunas?: boolean
}

export type StatusBadgeInput = string | StatusBadgeParams | null | undefined

export interface StatusBadgeOptions {
  dot?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export interface StatusInfo {
  label: string
  variant: NonNullable<BadgeProps["variant"]>
  dot: boolean
  textColor: string
}

/**
 * Mengambil informasi status murni (label teks, warna variant badge, dot, dan class warna teks)
 * tanpa membungkusnya dalam elemen JSX Badge.
 */
export const getStatusInfo = (input?: StatusBadgeInput): StatusInfo => {
  let statusRaw = ""
  let isPendingApproval = false
  let isDitolak = false
  let isPenawaranDisetujui = false
  let isLunas = false

  if (typeof input === "string") {
    statusRaw = input
  } else if (input && typeof input === "object") {
    statusRaw = input.status || ""
    isPendingApproval = Boolean(input.isPendingApproval)
    isDitolak = Boolean(input.isDitolak)
    isPenawaranDisetujui = Boolean(input.isPenawaranDisetujui)
    isLunas = Boolean(input.isLunas)
  }

  const normalized = (statusRaw || "").trim().toUpperCase()

  // 1. Kondisi Ditolak
  if (isDitolak || normalized === "DITOLAK" || normalized === "REJECTED") {
    return {
      label: "Ditolak",
      variant: "danger",
      dot: false,
      textColor: "text-rose-600",
    }
  }

  // 2. Kondisi Draft
  if (normalized === "DRAFT") {
    return {
      label: "Draft",
      variant: "neutral",
      dot: false,
      textColor: "text-slate-600",
    }
  }

  // 3. Kondisi Permohonan Masuk
  if (normalized === "PERMOHONAN" || normalized === "DIAJUKAN") {
    return {
      label: "Permohonan",
      variant: "primary",
      dot: false,
      textColor: "text-brand-700",
    }
  }

  // 4. Kondisi Review / Kajian Teknis
  if (normalized === "REVIEW" || normalized === "IN_REVIEW" || normalized === "KAJIAN_TEKNIS") {
    return {
      label: "Dalam Review",
      variant: "primary",
      dot: false,
      textColor: "text-brand-700",
    }
  }

  // 5. Kondisi Perlu Revisi / Perbaikan
  if (normalized === "REVISI" || normalized === "PERBAIKAN") {
    return {
      label: "Perlu Revisi",
      variant: "warning",
      dot: false,
      textColor: "text-amber-600",
    }
  }

  // 6. Kondisi Menunggu Persetujuan Penawaran Biaya
  if (
    isPendingApproval ||
    normalized === "MENUNGGU_PERSETUJUAN" ||
    (!isPenawaranDisetujui && (normalized === "PENAWARAN_BIAYA" || normalized === "MENUNGGU_PERSETUJUAN_PELANGGAN"))
  ) {
    return {
      label: "Menunggu Persetujuan",
      variant: "warning",
      dot: false,
      textColor: "text-amber-600",
    }
  }

  // 7. Kondisi Pembayaran
  if (
    normalized === "PEMBAYARAN" ||
    (isPenawaranDisetujui && (normalized === "PENAWARAN_BIAYA" || normalized === "MENUNGGU_PERSETUJUAN_PELANGGAN"))
  ) {
    if (isLunas) {
      return {
        label: "Dalam Proses",
        variant: "info",
        dot: false,
        textColor: "text-sky-600",
      }
    }
    return {
      label: "Pembayaran",
      variant: "primary",
      dot: false,
      textColor: "text-brand-700",
    }
  }

  // 8. Kondisi Proses / Lunas / Audit
  if (
    normalized === "PROSES" ||
    normalized === "PROCESS" ||
    normalized === "LUNAS" ||
    normalized === "PROSES_AUDIT"
  ) {
    return {
      label: "Dalam Proses",
      variant: "info",
      dot: false,
      textColor: "text-sky-600",
    }
  }

  // 9. Kondisi Selesai
  if (normalized === "DONE" || normalized === "SELESAI") {
    return {
      label: "Selesai",
      variant: "success",
      dot: false,
      textColor: "text-emerald-600",
    }
  }

  // Fallback
  return {
    label: titleCase(statusRaw) || "Permohonan",
    variant: "neutral",
    dot: false,
    textColor: "text-slate-700",
  }
}

/**
 * Mengembalikan elemen teks dengan warna yang sesuai status (tanpa badge / border).
 * Contoh: <span className="font-bold text-sm text-emerald-600">Selesai</span>
 */
export const getStatusText = (
  input?: StatusBadgeInput,
  options?: { className?: string }
): React.ReactElement => {
  const info = getStatusInfo(input)
  return (
    <span className={cn("font-bold text-sm", info.textColor, options?.className)}>
      {info.label}
    </span>
  )
}

/**
 * Mengembalikan string teks murni status (hanya string teks tanpa tag JSX / styling).
 * Contoh: getStatusLabel("in_review") => "Dalam Review"
 */
export const getStatusLabel = (input?: StatusBadgeInput): string => {
  return getStatusInfo(input).label
}

/**
 * Mengembalikan class text color Tailwind sesuai status (misal: "text-emerald-600").
 */
export const getStatusTextColor = (input?: StatusBadgeInput): string => {
  return getStatusInfo(input).textColor
}

/**
 * Mengembalikan elemen <Badge> yang telah disatukan dan distandarisasi
 * untuk digunakan di Dashboard, Halaman Detail, maupun komponen lainnya.
 */
export const getStatusBadge = (
  input?: StatusBadgeInput,
  options?: StatusBadgeOptions
): React.ReactElement => {
  const info = getStatusInfo(input)

  return (
    <Badge
      variant={info.variant}
      dot={options?.dot ?? info.dot}
      size={options?.size}
      className={options?.className}
    >
      {info.label}
    </Badge>
  )
}

interface StepIndexParams {
  status: string
  isPendingApproval: boolean
  isPenawaranDisetujui: boolean
  isLunas: boolean
}

/**
 * Menghitung indeks tahapan workflow (zero-based):
 * 0 = Draft
 * 1 = Kajian Teknis / Revisi
 * 2 = Menunggu Persetujuan Penawaran
 * 3 = Pembayaran / Menunggu Bayar
 * 4 = Proses / Lunas / Selesai
 */
export const getStepIndex = ({
  status,
  isPendingApproval,
  isPenawaranDisetujui,
  isLunas,
}: StepIndexParams): number => {
  if (status === "DRAFT") return 0
  if (status === "PERMOHONAN") return 1
  if (status === "IN_REVIEW" || status === "KAJIAN_TEKNIS" || status === "REVISI") return 1

  if (
    isPendingApproval ||
    (!isPenawaranDisetujui && (status === "PENAWARAN_BIAYA" || status === "MENUNGGU_PERSETUJUAN_PELANGGAN"))
  ) return 2

  if (
    status === "PEMBAYARAN" ||
    (isPenawaranDisetujui && (status === "PENAWARAN_BIAYA" || status === "MENUNGGU_PERSETUJUAN_PELANGGAN"))
  ) {
    return isLunas ? 4 : 3
  }

  if (
    status === "PROSES" ||
    status === "PROCESS" ||
    status === "LUNAS" ||
    status === "DONE" ||
    status === "SELESAI"
  ) return 4

  return 0
}
