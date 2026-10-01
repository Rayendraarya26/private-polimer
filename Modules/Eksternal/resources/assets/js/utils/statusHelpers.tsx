import React from "react"
import { Badge } from "../components/ui/Badge"

/**
 * Status badge & step-index helpers for DetailPermohonanPage.
 * Extracted from DetailPermohonanPage.tsx — Phase 1 refactor.
 */

interface StatusBadgeParams {
  status: string
  isPendingApproval: boolean
  isDitolak: boolean
  isPenawaranDisetujui: boolean
  isLunas: boolean
}

/**
 * Returns the appropriate <Badge> element for a given workflow status.
 */
export const getStatusBadge = ({
  status,
  isPendingApproval,
  isDitolak,
  isPenawaranDisetujui,
  isLunas,
}: StatusBadgeParams): React.ReactElement => {
  if (isPendingApproval) {
    return <Badge variant="warning">Menunggu Persetujuan</Badge>
  }
  if (isDitolak) {
    return <Badge variant="danger">Ditolak</Badge>
  }

  switch (status) {
    case "DRAFT":
      return <Badge variant="neutral">Draf</Badge>

    case "PERMOHONAN":
      return <Badge variant="primary">Diajukan</Badge>

    case "IN_REVIEW":
    case "KAJIAN_TEKNIS":
      return <Badge variant="warning">Kajian Teknis</Badge>

    case "PENAWARAN_BIAYA":
    case "MENUNGGU_PERSETUJUAN_PELANGGAN":
      return isPenawaranDisetujui
        ? <Badge variant="primary">Menunggu Pembayaran</Badge>
        : <Badge variant="warning">Menunggu Persetujuan Biaya</Badge>

    case "REVISI":
      return <Badge variant="danger">Perlu Perbaikan</Badge>

    case "PEMBAYARAN":
      return isLunas
        ? <Badge variant="info">Lunas (Menunggu Audit)</Badge>
        : <Badge variant="primary">Menunggu Pembayaran</Badge>

    case "PROSES":
    case "PROCESS":
      return <Badge variant="info">Pelaksanaan Audit & Uji</Badge>

    case "LUNAS":
      return <Badge variant="info">Lunas (Siap Audit)</Badge>

    case "DONE":
    case "SELESAI":
      return <Badge variant="success">Selesai</Badge>

    default:
      return <Badge variant="neutral">{status}</Badge>
  }
}

interface StepIndexParams {
  status: string
  isPendingApproval: boolean
  isPenawaranDisetujui: boolean
  isLunas: boolean
}

/**
 * Returns the current zero-based step index for the workflow stepper.
 *
 * 0 = Draft / awal
 * 1 = Kajian Teknis / Revisi
 * 2 = Menunggu Persetujuan Penawaran
 * 3 = Pembayaran / Menunggu Bayar
 * 4 = Proses / Lunas / Done
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
