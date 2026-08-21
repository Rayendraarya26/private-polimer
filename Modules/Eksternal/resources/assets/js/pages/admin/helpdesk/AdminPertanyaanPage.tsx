import React, { useState, useEffect } from "react"
import {
  MessageSquare,
  Search,
  CheckCircle2,
  XCircle,
  Send,
  User,
  Clock,
  Building2,
  Lock,
  Loader2,
  RefreshCw,
} from "lucide-react"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/Button"
import toast from "react-hot-toast"
import api from "../../../utils/api"

interface TiketAdminItem {
  id: string
  no_tiket: string
  pelanggan: string
  instansi: string
  topik: string
  judul: string
  status: "OPEN" | "CLOSED"
  tgl_dibuat: string
  pesan_terakhir: string
  messages: {
    id?: string
    sender: "PELANGGAN" | "PETUGAS"
    nama: string
    waktu: string
    isi: string
  }[]
}

export const AdminPertanyaanPage: React.FC = () => {
  const [tickets, setTickets] = useState<TiketAdminItem[]>([])
  const [selectedTicket, setSelectedTicket] = useState<TiketAdminItem | null>(null)
  const [replyText, setReplyText] = useState("")
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "opened" | "closed">("all")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const { data } = await api.get<{ results: TiketAdminItem[] }>("/eksternal/admin/pertanyaan", {
        params: {
          status: filterStatus,
          search: search.trim() || undefined,
        },
      })
      const items = data?.results || []
      setTickets(items)
      if (items.length > 0) {
        // If current selected ticket still exists, keep it, else select first
        setSelectedTicket((prev) => {
          if (!prev) return items[0]
          const found = items.find((t) => t.id === prev.id)
          return found || items[0]
        })
      } else {
        setSelectedTicket(null)
      }
    } catch (err) {
      console.error("Gagal memuat tiket pertanyaan:", err)
      toast.error("Gagal memuat tiket pertanyaan dari database")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [filterStatus])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchTickets()
  }

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTicket || !replyText.trim() || submitting) return

    try {
      setSubmitting(true)
      const { data } = await api.post(`/eksternal/admin/pertanyaan/${selectedTicket.id}/reply`, {
        pesan: replyText.trim(),
      })

      const newMsg = data?.results || {
        sender: "PETUGAS" as const,
        nama: "Petugas Helpdesk",
        waktu: "Baru saja",
        isi: replyText.trim(),
      }

      const updatedTicket: TiketAdminItem = {
        ...selectedTicket,
        messages: [...selectedTicket.messages, newMsg],
      }

      setSelectedTicket(updatedTicket)
      setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)))
      setReplyText("")
      toast.success("Balasan pesan berhasil dikirimkan ke pelanggan!")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal mengirim balasan")
    } finally {
      setSubmitting(false)
    }
  }

  const handleCloseTicket = async () => {
    if (!selectedTicket || submitting) return

    try {
      setSubmitting(true)
      await api.post(`/eksternal/admin/pertanyaan/${selectedTicket.id}/close`)

      const updatedTicket: TiketAdminItem = { ...selectedTicket, status: "CLOSED" as const }
      setSelectedTicket(updatedTicket)
      setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)))
      toast.success("Tiket resmi ditutup.")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal menutup tiket")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Head title="Manajemen Tiket Tanya Jawab" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-brand-600" />
            Pusat Tiket Tanya Jawab & Konsultasi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola pertanyaan teknis dan layanan dari pelanggan secara langsung melalui obrolan terstruktur (Database Live).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={fetchTickets} disabled={loading} leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterStatus === "all" ? "bg-white shadow-xs text-slate-900" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterStatus("opened")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterStatus === "opened" ? "bg-white shadow-xs text-slate-900" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setFilterStatus("closed")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterStatus === "closed" ? "bg-white shadow-xs text-slate-900" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Closed
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2 w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nomor tiket, topik, atau nama pelanggan..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <Button type="submit" size="sm" variant="primary">
            Cari
          </Button>
        </form>
      </div>

      {/* Chat Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List Panel */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="p-3.5 border-b border-slate-200 bg-slate-50/70">
            <CardTitle className="text-xs font-bold flex items-center justify-between">
              <span>Daftar Tiket Masuk</span>
              <span className="text-[11px] font-normal text-slate-500">{tickets.length} Tiket</span>
            </CardTitle>
          </CardHeader>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {loading ? (
              <div className="p-6 text-center text-slate-400 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
                <span className="text-xs">Memuat tiket dari database...</span>
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                <p className="text-xs">Belum ada tiket pertanyaan pelanggan.</p>
              </div>
            ) : (
              tickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`w-full text-left p-3 rounded-xl transition-colors ${
                    selectedTicket?.id === t.id
                      ? "bg-brand-50/80 border border-brand-200"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-brand-700">{t.no_tiket}</span>
                    {t.status === "OPEN" ? (
                      <Badge variant="warning">Open</Badge>
                    ) : (
                      <Badge variant="secondary">Closed</Badge>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mt-1 line-clamp-1">{t.judul}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.pelanggan} • {t.instansi}</p>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Chat Thread Panel */}
        <Card className="lg:col-span-2 h-[600px] flex flex-col">
          {selectedTicket ? (
            <>
              <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between bg-slate-50/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-700">{selectedTicket.no_tiket}</span>
                    <span className="text-xs text-slate-400">• Topik: {selectedTicket.topik}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{selectedTicket.judul}</h3>
                  <p className="text-[11px] text-slate-500">
                    Pengirim: {selectedTicket.pelanggan} ({selectedTicket.instansi})
                  </p>
                </div>
                {selectedTicket.status === "OPEN" ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleCloseTicket}
                    disabled={submitting}
                    leftIcon={<Lock className="w-3.5 h-3.5" />}
                  >
                    Tutup Tiket
                  </Button>
                ) : (
                  <Badge variant="secondary">Tiket Telah Ditutup</Badge>
                )}
              </CardHeader>

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                {selectedTicket.messages.map((msg, idx) => {
                  const isOfficer = msg.sender === "PETUGAS"
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isOfficer ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-lg p-3.5 rounded-2xl text-xs space-y-1 ${
                          isOfficer
                            ? "bg-brand-600 text-white rounded-br-none shadow-md shadow-brand-900/10"
                            : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs"
                        }`}
                      >
                        <p className={`font-bold text-[11px] ${isOfficer ? "text-brand-100" : "text-brand-700"}`}>
                          {msg.nama}
                        </p>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.isi}</p>
                        <span
                          className={`text-[9px] block text-right ${
                            isOfficer ? "text-brand-200" : "text-slate-400"
                          }`}
                        >
                          {msg.waktu}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Reply Box */}
              {selectedTicket.status === "OPEN" ? (
                <form onSubmit={handleSendReply} className="p-3 border-t border-slate-200 bg-white flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Tulis balasan resmi untuk pelanggan..."
                    className="flex-1 px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                  <Button type="submit" size="sm" variant="primary" disabled={submitting || !replyText.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              ) : (
                <div className="p-3 border-t border-slate-200 bg-slate-100 text-center text-xs text-slate-500">
                  Percakapan tiket ini telah ditutup.
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-600">Pilih Tiket</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Pilih salah satu tiket di daftar sebelah kiri untuk melihat percakapan dan mengirim balasan.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default AdminPertanyaanPage

