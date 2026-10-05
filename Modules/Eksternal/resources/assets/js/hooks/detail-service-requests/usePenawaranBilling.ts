import { getStepIndex } from "../../utils/statusHelpers"

export interface UsePenawaranBillingProps {
  permohonan: any
  status: string
  isPup?: boolean
  formPupData?: any
}

export interface UsePenawaranBillingReturn {
  penawaran: any
  isPenawaranDisetujui: boolean
  isPenawaranDitolak: boolean
  isStatusTahapPenawaran: boolean
  isPendingApproval: boolean
  isLunas: boolean
  isDitolak: boolean
  isSiapBayar: boolean
  rincianList: any[]
  totalBiayaPenawaran: number
  currentStepIdx: number
}

/**
 * usePenawaranBilling
 * 
 * Helper untuk mengkalkulasi logika penawaran biaya, status persetujuan penawaran,
 * rincian item pembayaran (termasuk diskon bundling PUP), dan kesiapan pembayaran/lunas.
 * Dijalankan sebagai fungsi murni tanpa React Hook (useMemo) agar aman dari aturan Rules of Hooks.
 */
export const usePenawaranBilling = ({
  permohonan,
  status,
  isPup = false,
  formPupData,
}: UsePenawaranBillingProps): UsePenawaranBillingReturn => {
    const rawPenawaran =
      permohonan?.penawaran_biaya ||
      permohonan?.penawaranBiaya ||
      (Array.isArray(permohonan?.penawaran_biaya) && permohonan.penawaran_biaya.length > 0
        ? permohonan.penawaran_biaya[0]
        : null) ||
      (Array.isArray(permohonan?.penawaranBiaya) && permohonan.penawaranBiaya.length > 0
        ? permohonan.penawaranBiaya[0]
        : null)

    const penawaran =
      (Array.isArray(rawPenawaran) ? rawPenawaran[0] : rawPenawaran) ||
      (permohonan?.harga_permohonan ||
      permohonan?.total_harga ||
      permohonan?.file_surat_penawaran ||
      permohonan?.detail_pembayaran ||
      permohonan?.pembayaran
        ? {
            total_nominal: permohonan?.harga_permohonan || permohonan?.total_harga || 0,
            file_surat_penawaran: permohonan?.file_surat_penawaran,
            status_persetujuan:
              permohonan?.status_penawaran === "setuju"
                ? "DISETUJUI"
                : permohonan?.status_penawaran === "tolak"
                  ? "DITOLAK"
                  : "MENUNGGU",
            status:
              permohonan?.status_penawaran === "setuju"
                ? "DISETUJUI"
                : permohonan?.status_penawaran === "tolak"
                  ? "DITOLAK"
                  : "MENUNGGU",
            catatan: permohonan?.catatan_penawaran,
            rincian_json:
              permohonan?.detail_pembayaran ||
              permohonan?.pembayaran ||
              permohonan?.detailPembayaran,
          }
        : null)

    const isPenawaranDisetujui = Boolean(
      penawaran &&
        (penawaran?.status_persetujuan === "DISETUJUI" ||
          penawaran?.status === "DISETUJUI" ||
          permohonan?.status_penawaran === "setuju")
    )

    const isPenawaranDitolak = Boolean(
      penawaran &&
        (penawaran?.status_persetujuan === "DITOLAK" ||
          penawaran?.status === "DITOLAK" ||
          permohonan?.status_penawaran === "tolak")
    )

    const isStatusTahapPenawaran = [
      "PENAWARAN_BIAYA",
      "MENUNGGU_PERSETUJUAN_PELANGGAN",
      "PEMBAYARAN",
    ].includes(status)

    const isPendingApproval = Boolean(
      isStatusTahapPenawaran &&
        penawaran &&
        !isPenawaranDisetujui &&
        !isPenawaranDitolak &&
        (penawaran?.status_persetujuan === "MENUNGGU" ||
          penawaran?.status === "MENUNGGU_PERSETUJUAN" ||
          status === "MENUNGGU_PERSETUJUAN_PELANGGAN" ||
          status === "PENAWARAN_BIAYA")
    )

    const isLunas = permohonan?.status_bayar === "LUNAS" || status === "LUNAS"
    const isDitolak = status === "DITOLAK" || isPenawaranDitolak

    const isSiapBayar =
      !isPendingApproval &&
      (isPenawaranDisetujui ||
        ["PEMBAYARAN", "PROCESS", "LUNAS", "DONE", "SELESAI"].includes(status) ||
        isLunas)

    const rawRincian =
      penawaran?.rincian_json ||
      penawaran?.detail_pembayaran ||
      permohonan?.detail_pembayaran ||
      permohonan?.pembayaran ||
      permohonan?.detailPembayaran

    const parsedRincian = Array.isArray(rawRincian)
      ? rawRincian
      : typeof rawRincian === "string"
        ? JSON.parse(rawRincian || "[]")
        : []

    const rincianList = (() => {
      if (parsedRincian.length > 0) return parsedRincian
      if (isPup && Array.isArray(formPupData?.items) && formPupData.items.length > 0) {
        const items = formPupData.items.map((it: any) => ({
          nama_item: `Skema PUP: ${it.nama_skema}`,
          qty: 1,
          subtotal: Number(it.biaya || 0),
        }))
        if (Number(formPupData?.diskon_nominal) > 0) {
          items.push({
            nama_item: formPupData?.catatan_diskon || "Paket Hemat Diskon Bundling PUP",
            qty: 1,
            subtotal: -Number(formPupData.diskon_nominal),
          })
        }
        return items
      }
      return []
    })()

    const totalBiayaPenawaran = Number(
      penawaran?.total_nominal ||
        penawaran?.total_biaya ||
        permohonan?.biaya ||
        formPupData?.total_biaya_bersih ||
        permohonan?.harga_permohonan ||
        permohonan?.total_harga ||
        (rincianList.length > 0
          ? rincianList.reduce(
              (acc: number, cur: any) =>
                acc +
                Number(
                  cur.subtotal ||
                    (cur.nominal || cur.harga_satuan || 0) * (cur.qty || cur.kuantitas || 1)
                ),
              0
            )
          : 0)
    )

    const currentStepIdx = getStepIndex({
      status,
      isPendingApproval,
      isPenawaranDisetujui,
      isLunas,
    })

    return {
      penawaran,
      isPenawaranDisetujui,
      isPenawaranDitolak,
      isStatusTahapPenawaran,
      isPendingApproval,
      isLunas,
      isDitolak,
      isSiapBayar,
      rincianList,
      totalBiayaPenawaran,
      currentStepIdx,
    }
}
