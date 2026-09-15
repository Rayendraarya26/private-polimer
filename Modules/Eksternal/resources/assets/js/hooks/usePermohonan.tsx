import { useQuery } from "@tanstack/react-query"
import { checkProfileStatus } from "../services/permohonan"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

export const useProfileStatus = () => {
  const navigate = useNavigate()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["profileStatus"],
    queryFn: async () => {
      try {
        const result = await checkProfileStatus()

        // Sinkronisasi LocalStorage
        try {
          const userLocal = JSON.parse(localStorage.getItem("user") || "{}")
          if (userLocal.pelanggan?.detail) {
            userLocal.pelanggan.detail.alamat = result.alamat
            localStorage.setItem("user", JSON.stringify(userLocal))
          }
        } catch (e) {
          // ignore
        }

        return result
      } catch (err) {
        console.error("Gagal memeriksa status profil:", err)
        return { is_profile_complete: false, alamat: "" }
      }
    },
    staleTime: 1000 * 60 * 10, // 10 menit cache segar di memori
    gcTime: 1000 * 60 * 30,
  })

  const isComplete = data?.is_profile_complete ?? null

  /**
   * Helper function untuk memproteksi navigasi pengajuan layanan.
   * Menampilkan dialog peringatan modern yang sesuai dengan Design System BBKKP.
   */
  const checkAndRun = async (onComplete: () => void) => {
    let currentComplete = isComplete

    // Jika belum pernah difetch (first load), tunggu hasil query
    if (currentComplete === null || isLoading) {
      const res = await refetch()
      currentComplete = res.data?.is_profile_complete ?? false
    }

    if (currentComplete) {
      onComplete()
    } else {
      // Tampilkan Modal Peringatan Modern dengan Styling Tailwind & Kemenperin Navy
      Swal.fire({
        title: "Lengkapi Profil Akun",
        html: `
          <div class="space-y-2 text-left text-xs text-slate-600">
            <p>Untuk melanjutkan pengajuan permohonan layanan publik BBKKP, data profil dan legalitas Anda harus sudah lengkap.</p>
            <div class="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-amber-800 text-[11px] flex flex-col gap-1 mt-2">
              <span class="font-bold text-amber-950">Informasi Penting:</span>
              <span>Pastikan NIK, kontak WhatsApp, dan alamat domisili/kantor terisi dengan benar.</span>
            </div>
          </div>
        `,
        icon: "warning",
        iconColor: "#D97706",
        showCancelButton: true,
        confirmButtonColor: "#1E3A8A",
        cancelButtonColor: "#64748B",
        confirmButtonText: "Lengkapi Profil Sekarang",
        cancelButtonText: "Nanti Saja",
        reverseButtons: true,
        customClass: {
          popup: "rounded-2xl shadow-xl border border-slate-200/80 font-sans p-6",
          title: "text-lg font-bold text-slate-900 tracking-tight",
          confirmButton: "rounded-xl px-5 py-2.5 text-xs font-semibold shadow-md transition-all",
          cancelButton: "rounded-xl px-4 py-2.5 text-xs font-semibold transition-all",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/profile/update")
        }
      })
    }
  }

  return { isComplete, isLoading, checkAndRun, refreshStatus: refetch }
}