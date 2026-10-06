import React, { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { Link } from "react-router-dom"
import {
  Bell,
  CheckCheck,
  Check,
  Clock,
  ExternalLink,
  Inbox,
  Loader2,
  FileText,
  Receipt,
  HelpCircle,
  AlertCircle,
  X,
} from "lucide-react"
import toast from "react-hot-toast"
import {
  useNotificationsQuery,
  useMarkAllNotificationsMutation,
  useMarkNotificationMutation,
} from "../../hooks/queries/useNotificationsQuery"
import { NotificationItem } from "../../types/notifications"
import { getDateDisplay } from "../../utils/date"

/**
 * Menentukan ikon kontekstual berdasarkan judul atau konten notifikasi
 */
const getNotificationIcon = (title = "", content = "") => {
  const text = `${title} ${content}`.toLowerCase()
  if (text.includes("bayar") || text.includes("invoice") || text.includes("tagihan")) {
    return <Receipt className="w-4 h-4 text-emerald-600" />
  }
  if (text.includes("tiket") || text.includes("pertanyaan") || text.includes("tanya")) {
    return <HelpCircle className="w-4 h-4 text-sky-600" />
  }
  if (
    text.includes("sertifikat") ||
    text.includes("lhu") ||
    text.includes("permohonan") ||
    text.includes("dokumen")
  ) {
    return <FileText className="w-4 h-4 text-brand-700" />
  }
  return <Bell className="w-4 h-4 text-brand-600" />
}

export const NotificationPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerLinkRef = useRef<HTMLAnchorElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const {
    data: notificationsData,
    isLoading,
    isError,
    refetch,
  } = useNotificationsQuery({ row: 15 })

  const markAllMutation = useMarkAllNotificationsMutation()
  const markSingleMutation = useMarkNotificationMutation()

  const items = useMemo(() => notificationsData?.data || [], [notificationsData])
  const unreadCount = notificationsData?.unread ?? 0
  const totalCount = notificationsData?.total ?? items.length

  const filteredItems = useMemo(() => {
    if (activeTab === "unread") {
      return items.filter((item) => item.is_read === "no")
    }
    return items
  }, [items, activeTab])

  // Timer hover handler untuk popover yang mulus dan bebas flicker
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsOpen(true)
  }

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
        triggerLinkRef.current?.focus()
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

  // Handler tandai seluruh notifikasi telah dibaca
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllMutation.mutateAsync()
      toast.success("Seluruh notifikasi telah ditandai dibaca")
    } catch {
      toast.error("Gagal menandai seluruh notifikasi")
    }
  }, [markAllMutation])

  // Handler tandai satu notifikasi telah dibaca
  const handleMarkSingleAsRead = useCallback(
    async (e: React.MouseEvent, item: NotificationItem) => {
      e.preventDefault()
      e.stopPropagation()

      if (!item.id) return

      try {
        await markSingleMutation.mutateAsync(item.id)
        toast.success("Notifikasi ditandai dibaca")
      } catch {
        toast.error("Gagal memperbarui notifikasi")
      }
    },
    [markSingleMutation]
  )

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tautan Pemicu Bell Icon: Hover membuka popover, Klik mengarah ke Pusat Notifikasi */}
      <Link
        ref={triggerLinkRef}
        to="/notifications"
        onClick={() => setIsOpen(false)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="Buka Pusat Notifikasi"
        className={`relative p-2 rounded-xl transition-all duration-200 outline-none flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brand-500 ${
          isOpen
            ? "bg-brand-50 text-brand-700 shadow-2xs"
            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        }`}
        title="Klik untuk membuka Pusat Notifikasi"
      >
        <Bell className="w-5 h-5 transition-transform hover:scale-105" />

        {/* Badge counter unread */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4.5 min-w-[18px] px-1 flex items-center justify-center shadow-xs ring-2 ring-white animate-in zoom-in-75 duration-150">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Link>

      {/* Popover Dropdown Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Daftar Notifikasi"
          className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-sm sm:max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/90 z-50 overflow-hidden flex flex-col animate-in fade-in-50 zoom-in-95 duration-150"
        >
          {/* Header Popover */}
          <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Notifikasi
                </h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/80">
                    {unreadCount} baru
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  disabled={markAllMutation.isPending}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-700 hover:text-brand-900 hover:underline disabled:opacity-50 transition-colors"
                >
                  {markAllMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCheck className="w-3.5 h-3.5" />
                  )}
                  <span>Tandai dibaca</span>
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-200/60">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === "all"
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200/80"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                Semua ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("unread")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === "unread"
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200/80"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                Belum Dibaca ({unreadCount})
              </button>
            </div>
          </div>

          {/* List Isi Notifikasi */}
          <div className="max-h-80 sm:max-h-96 overflow-y-auto divide-y divide-slate-100 scrollbar-thin scrollbar-thumb-slate-200">
            {/* Loading State */}
            {isLoading && (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((idx) => (
                  <div key={idx} className="flex items-start gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-xl bg-slate-200 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="w-3/4 h-3 rounded bg-slate-200" />
                      <div className="w-full h-2.5 rounded bg-slate-200" />
                      <div className="w-1/3 h-2 rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!isLoading && isError && (
              <div className="py-8 px-4 text-center">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-800">
                  Gagal memuat notifikasi
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-2 text-xs font-semibold text-brand-600 hover:underline"
                >
                  Coba lagi
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && filteredItems.length === 0 && (
              <div className="py-10 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
                  <Inbox className="w-5 h-5 stroke-1" />
                </div>
                <p className="text-xs font-bold text-slate-700">
                  {activeTab === "unread"
                    ? "Semua notifikasi sudah dibaca"
                    : "Belum ada notifikasi"}
                </p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-1">
                  {activeTab === "unread"
                    ? "Tidak ada pesan belum dibaca saat ini."
                    : "Pembaruan layanan, permohonan, dan tagihan akan tampil di sini."}
                </p>
              </div>
            )}

            {/* List Item Notifikasi */}
            {!isLoading &&
              !isError &&
              filteredItems.map((item, index) => {
                const isUnread = item.is_read === "no"
                return (
                  <a
                    key={item.id ?? `${item.created_at}-${index}`}
                    href={item.link}
                    onClick={() => setIsOpen(false)}
                    className={`block p-3 sm:p-3.5 transition-colors group relative ${
                      isUnread
                        ? "bg-brand-50/30 hover:bg-brand-50/50"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Ikon Kategori */}
                      <div
                        className={`p-2 rounded-xl shrink-0 mt-0.5 transition-colors ${
                          isUnread
                            ? "bg-white border border-brand-200/80 shadow-2xs"
                            : "bg-slate-100 group-hover:bg-white group-hover:border group-hover:border-slate-200"
                        }`}
                      >
                        {getNotificationIcon(item.title, item.content)}
                      </div>

                      {/* Konten Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1.5">
                          <h4
                            className={`text-xs tracking-tight line-clamp-1 ${
                              isUnread
                                ? "font-bold text-slate-900"
                                : "font-semibold text-slate-700"
                            }`}
                          >
                            {item.title}
                          </h4>

                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0 mt-1" />
                          )}
                        </div>

                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                          {item.content}
                        </p>

                        <div className="flex items-center justify-between gap-2 mt-2">
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>{getDateDisplay(item.created_at, true)}</span>
                          </div>

                          {/* Quick action: tandai 1 notif dibaca */}
                          {isUnread && item.id && (
                            <button
                              type="button"
                              onClick={(e) => handleMarkSingleAsRead(e, item)}
                              title="Tandai dibaca"
                              className="opacity-0 group-hover:opacity-100 text-[10px] font-semibold text-slate-500 hover:text-brand-700 flex items-center gap-0.5 transition-opacity"
                            >
                              <Check className="w-3 h-3" />
                              <span>Dibaca</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </a>
                )
              })}
          </div>

          {/* Footer Popover */}
          <div className="p-2.5 sm:p-3 border-t border-slate-100 bg-slate-50/70 text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center justify-center gap-1.5 py-1 px-3 rounded-lg hover:bg-brand-50/60 transition-colors w-full"
            >
              <span>Lihat Semua</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationPopover
