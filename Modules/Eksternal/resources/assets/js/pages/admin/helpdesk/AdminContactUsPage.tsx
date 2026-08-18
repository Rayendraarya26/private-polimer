import React, { useState } from "react"
import { Globe, Search, Mail, Phone, Calendar, Eye, Trash2 } from "lucide-react"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/Button"
import { Modal } from "../../../components/ui/Modal"

interface ContactMessage {
  id: string
  nama: string
  email: string
  no_telp: string
  subjek: string
  pesan: string
  tgl_kirim: string
  status: "BARU" | "DIBACA"
}

export const AdminContactUsPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([
    {
      id: "1",
      nama: "Dr. Bambang Setiadi",
      email: "bambang.setiadi@univ.ac.id",
      no_telp: "+62 813-9876-5432",
      subjek: "Kerjasama Riset Polimer Terbarukan",
      pesan: "Kami dari Fakultas Teknik Kimia bermaksud mengajukan proposal kerjasama riset pengujian degradasi bioplastik bersama laboratorium BBKKP. Mohon informasi kontak PIC terkait.",
      tgl_kirim: "18 Agu 2026, 09:15 WIB",
      status: "BARU",
    },
    {
      id: "2",
      nama: "PT Sentosa Abadi Plastik",
      email: "info@sentosaplastik.com",
      no_telp: "+62 21-8899-0011",
      subjek: "Permintaan Penawaran Kalibrasi Mesin UTM",
      pesan: "Mohon dikirimkan surat penawaran harga resmi untuk jasa kalibrasi berkala 3 unit Universal Testing Machine di pabrik kami.",
      tgl_kirim: "15 Agu 2026, 14:00 WIB",
      status: "DIBACA",
    },
  ])

  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null)

  const handleOpenDetail = (msg: ContactMessage) => {
    setSelectedMsg(msg)
    setMessages(messages.map((m) => (m.id === msg.id ? { ...m, status: "DIBACA" as const } : m)))
  }

  return (
    <div className="space-y-6">
      <Head title="Pesan Masuk Contact Us" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Globe className="w-6 h-6 text-brand-600" />
            Pesan Masuk Formulir Kontak (Contact Us)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar pertanyaan, permohonan informasi, dan kerjasama yang dikirim publik melalui website.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm">Kotak Masuk Pesan Publik</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Pengirim & Email</th>
                  <th className="py-3 px-4 font-bold">Subjek Pesan</th>
                  <th className="py-3 px-4 font-bold">Waktu Masuk</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{msg.nama}</p>
                      <span className="text-[11px] text-slate-400">{msg.email}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{msg.subjek}</td>
                    <td className="py-3.5 px-4 text-slate-500">{msg.tgl_kirim}</td>
                    <td className="py-3.5 px-4">
                      {msg.status === "BARU" ? (
                        <Badge variant="warning">Pesan Baru</Badge>
                      ) : (
                        <Badge variant="secondary">Sudah Dibaca</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => handleOpenDetail(msg)}
                      >
                        Baca
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Detail Pesan */}
      {selectedMsg && (
        <Modal
          show={Boolean(selectedMsg)}
          onClose={() => setSelectedMsg(null)}
          title="Detail Pesan Kontak Masuk"
          size="md"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Dari:</span>
                <span className="font-bold text-slate-800">{selectedMsg.nama}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-medium text-slate-700">{selectedMsg.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Telepon:</span>
                <span className="font-medium text-slate-700">{selectedMsg.no_telp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Waktu:</span>
                <span className="text-slate-500">{selectedMsg.tgl_kirim}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-bold block mb-1">Subjek:</span>
              <p className="font-bold text-slate-900">{selectedMsg.subjek}</p>
            </div>

            <div>
              <span className="text-slate-400 font-bold block mb-1">Isi Pesan:</span>
              <div className="p-3 bg-slate-100 rounded-xl text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selectedMsg.pesan}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <Button size="sm" variant="outline" onClick={() => setSelectedMsg(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default AdminContactUsPage
