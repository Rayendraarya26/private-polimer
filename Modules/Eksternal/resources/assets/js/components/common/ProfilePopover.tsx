import React, { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { User, KeyRound, LogOut, ChevronDown, ShieldCheck, Mail } from "lucide-react"
import Swal from "sweetalert2"
import { RootState } from "../../store"
import { getAvatar } from "../../utils/avatar"

export const ProfilePopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerButtonRef = useRef<HTMLButtonElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const profile = useSelector(({ profile }: RootState) => profile?.profile)

  const userName = profile?.name || profile?.detail?.nama || "Pelanggan BBKKP"
  const userEmail = profile?.email || "pelanggan@bbkkp.kemenperin.go.id"
  const userType = profile?.detail?.type
    ? profile.detail.type.toUpperCase()
    : "PORTAL PELANGGAN"
  const initial = userName.charAt(0).toUpperCase()

  // Handler hover masuk
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsOpen(true)
  }

  // Handler hover keluar dengan delay aman 200ms
  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }

  // Cleanup timeout saat unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Menutup popover saat klik di luar area atau tombol Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false)
        triggerButtonRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  // Konfirmasi sebelum logout
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsOpen(false)

    Swal.fire({
      title: "Keluar dari Akun?",
      text: "Anda akan mengakhiri sesi dan diarahkan kembali ke halaman login portal BBKKP.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl font-semibold px-4 py-2",
        cancelButton: "rounded-xl font-semibold px-4 py-2",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/auth/logout"
      }
    })
  }

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button Profil */}
      <button
        ref={triggerButtonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Menu Profil Pengguna"
        className={`flex items-center gap-2.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand-500 group select-none ${
          isOpen ? "bg-slate-100 shadow-2xs" : "hover:bg-slate-100/80"
        }`}
      >
        {/* Info Nama & Kategori (Desktop) */}
        <div className="text-right hidden sm:block max-w-[140px] md:max-w-[180px]">
          <p className="text-xs font-bold text-slate-800 leading-tight truncate">
            {userName}
          </p>
          <span className="text-[10px] text-slate-500 font-medium leading-tight block mt-0.5 uppercase tracking-wider truncate">
            {userType}
          </span>
        </div>

        {/* Avatar Bulat */}
        <div className="relative">
          <img
            src={getAvatar(profile?.picture, userName)}
            alt={userName}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-100 shadow-xs group-hover:ring-brand-200 transition-all"
            onError={(e) => {
              // Fallback gambar jika URL eksternal gagal dimuat
              const target = e.target as HTMLImageElement
              target.onerror = null
              target.style.display = "none"
              const fallback = target.nextElementSibling as HTMLElement
              if (fallback) fallback.style.display = "flex"
            }}
          />
          {/* Fallback Inisial Huruf */}
          <div
            style={{ display: "none" }}
            className="w-9 h-9 rounded-full bg-brand-600 text-white items-center justify-center font-bold text-sm shadow-xs ring-2 ring-brand-100"
          >
            {initial}
          </div>
          {/* Status Online Dot */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
        </div>

        {/* Chevron Icon */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-brand-600" : ""
          }`}
        />
      </button>

      {/* Popover Dropdown Card */}
      {isOpen && (
        <div
          role="menu"
          aria-label="Menu Profil"
          className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 z-50 overflow-hidden flex flex-col animate-in fade-in-50 zoom-in-95 duration-150"
        >
          {/* Header Popover: Ringkasan Identitas Pengguna */}
          <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-brand-50/20">
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <img
                  src={getAvatar(profile?.picture, userName)}
                  alt={userName}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-200 shadow-xs"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 tracking-tight truncate">
                  {userName}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate mt-0.5">
                  <Mail className="w-3 h-3 shrink-0 text-slate-400" />
                  <span className="truncate">{userEmail}</span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 text-brand-700 border border-brand-200/80">
                  <ShieldCheck className="w-3 h-3 text-brand-600" />
                  <span>{userType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* List Menu Navigasi */}
          <div className="p-1.5 space-y-0.5">
            {/* Profil Saya */}
            <Link
              to="/profile/update"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-700 hover:bg-slate-100 transition-colors group"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <span className="flex-1">Profil Saya</span>
            </Link>

            {/* Keamanan & Password */}
            <Link
              to="/profile/change-account-and-password"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-700 hover:bg-slate-100 transition-colors group"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors flex items-center justify-center shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <span className="flex-1">Keamanan & Password</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 my-1 mx-2" />

          {/* Tombol Logout */}
          <div className="p-1.5 pt-0">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors group text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-100 transition-colors flex items-center justify-center shrink-0">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="flex-1">Keluar Akun</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePopover
