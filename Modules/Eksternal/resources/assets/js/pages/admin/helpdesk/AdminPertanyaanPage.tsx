import React, { useState } from "react"
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
} from "lucide-react"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/Button"
import toast from "react-hot-toast"

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
    sender: "PELANGGAN" | "PETUGAS"
    nama: string
    waktu: string
    isi: string
  }[]
}

export const AdminPertanyaanPage: React.FC = () => {
  const [tickets, setTickets] = useState<TiketAdminItem[]>([
    {
      id: "1",
      no_tiket: "TCK-2026-0801",
      pelanggan: "Ir. Hendri Gunawan",
      instansi: "PT Indorubber Global Tech",
      topik: "Pengujian Laboratorium",
      judul: "Pertanyaan mengenai waktu pengerjaan uji vulkanisasi karet SNI",
      status: "OPEN",
      tgl_dibuat: "18 Agu 2026, 08:30 WIB",
      pesan_terakhir: "Apakah pengujian bisa dipercepat menjadi 3 hari kerja?",
      messages: [
        {
          sender: "PELANGGAN",
          nama: "Ir. Hendri Gunawan",
          waktu: "18 Agu 2026, 08:30 WIB",
          isi: "Selamat pagi tim BBKKP, kami ingin menanyakan apakah untuk uji tarik dan ketahanan ozon karet dapat diajukan skema percepatan (fast-track)? Terima kasih.",
        },
      ],
    },
    {
      id: "2",
      no_tiket: "TCK-2026-0802",
      pelanggan: "Siti Nurhaliza",
      instansi: "Dinas Perindustrian Jateng",
      topik: "Bimtek & Pelatihan",
      judul: "Konfirmasi kuota peserta pelatihan polimer hijau",
      status: "CLOSED",
      tgl_dibuat: "16 Agu 2026, 11:00 WIB",
      pesan_terakhir: "Terima kasih atas informasinya, kuota telah kami konfirmasi.",
      messages: [
        {
          sender: "PELANGGAN",
          nama: "Siti Nurhaliza",
          waktu: "16 Agu 2026, 11:00 WIB",
          isi: "Apakah masih tersedia kuota untuk 15 orang peserta dari dinas kami?",
        },
        {
          sender: "PETUGAS",
          nama: "Customer Service BBKKP",
          waktu: "16 Agu 2026, 11:45 WIB",
          isi: "Selamat siang Ibu Siti, kuota untuk batch Agustus masih tersedia 20 slot. Silakan melanjutkan proses pengajuan pendaftaran melalui portal. Terima kasih.",
        },
      ],
    },
  ])

  const [selectedTicket, setSelectedTicket] = useState<TiketAdminItem>(tickets[0])
  const [replyText, setReplyText] = useState("")

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    const newMsg = {
      sender: "PETUGAS" as const,
      nama: "Petugas Helpdesk BBKKP",
      waktu: "Baru saja",
      isi: replyText,
    }

    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMsg],
    }

    setSelectedTicket(updatedTicket)
    setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)))
    setReplyText("")
    toast.success("Balasan pesan berhasil dikirimkan ke pelanggan!")
  }

  const handleCloseTicket = () => {
    const updatedTicket = { ...selectedTicket, status: "CLOSED" as const }
    setSelectedTicket(updatedTicket)
    setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)))
    toast.success("Tiket resmi ditutup.")
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
            Kelola pertanyaan teknis dan layanan dari pelanggan secara langsung melalui obrolan terstruktur.
          </p>
        </div>
      </div>

      {/* Chat Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List Panel */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="p-3.5 border-b border-slate-200 bg-slate-50/70">
            <CardTitle className="text-xs font-bold">Daftar Tiket Masuk</CardTitle>
          </CardHeader>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`w-full text-left p-3 rounded-xl transition-colors ${
                  selectedTicket.id === t.id
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
            ))}
          </div>
        </Card>

        {/* Chat Thread Panel */}
        <Card className="lg:col-span-2 h-[600px] flex flex-col">
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
              <Button type="submit" size="sm" variant="primary">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          ) : (
            <div className="p-3 border-t border-slate-200 bg-slate-100 text-center text-xs text-slate-500">
              Percakapan tiket ini telah ditutup.
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default AdminPertanyaanPage
