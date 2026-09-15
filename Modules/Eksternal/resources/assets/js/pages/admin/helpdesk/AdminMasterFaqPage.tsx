import React, { useState } from "react"
import { HelpCircle, Plus, Trash2, Edit3, Search, FolderPlus } from "lucide-react"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Button } from "../../../components/ui/Button"
import { Modal } from "../../../components/ui/Modal"
import toast from "react-hot-toast"

export const AdminMasterFaqPage: React.FC = () => {
  const [faqs, setFaqs] = useState([
    {
      id: "1",
      layanan: "Sertifikasi Profesi LSP",
      pertanyaan: "Apa saja berkas yang wajib diunggah untuk pendaftaran LSP?",
      jawaban: "Berkas wajib meliputi KTP elektronik, Ijazah terakhir, Formulir APL-01 & APL-02 yang telah diisi, serta SK Penugasan dari pimpinan instansi.",
    },
    {
      id: "2",
      layanan: "Pengujian Laboratorium",
      pertanyaan: "Berapa lama estimasi pengerjaan pengujian karet dan kulit?",
      jawaban: "Standar pengerjaan laboratorium adalah 7-14 hari kerja terhitung sejak sampel uji diterima fisik di BBKKP dan pembayaran terkonfirmasi.",
    },
  ])

  const [topiks, setTopiks] = useState([
    { id: "1", nama: "Pengujian Laboratorium", deskripsi: "Tanya jawab pengujian fisika dan kimia" },
    { id: "2", nama: "Sertifikasi Profesi LSP", deskripsi: "Asesmen kompetensi BNSP" },
    { id: "3", nama: "Bimtek & Pelatihan", deskripsi: "Pelatihan teknis industri" },
    { id: "4", nama: "Pembayaran & Invoice", deskripsi: "Simponi dan Virtual Account BNI" },
  ])

  const [showFaqModal, setShowFaqModal] = useState(false)
  const [showTopikModal, setShowTopikModal] = useState(false)
  const [newFaq, setNewFaq] = useState({ layanan: "Pengujian Laboratorium", pertanyaan: "", jawaban: "" })
  const [newTopik, setNewTopik] = useState({ nama: "", deskripsi: "" })

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault()
    setFaqs([...faqs, { id: String(Date.now()), ...newFaq }])
    toast.success("FAQ baru berhasil ditambahkan!")
    setShowFaqModal(false)
    setNewFaq({ layanan: "Pengujian Laboratorium", pertanyaan: "", jawaban: "" })
  }

  const handleSaveTopik = (e: React.FormEvent) => {
    e.preventDefault()
    setTopiks([...topiks, { id: String(Date.now()), ...newTopik }])
    toast.success("Topik pertanyaan baru berhasil ditambahkan!")
    setShowTopikModal(false)
    setNewTopik({ nama: "", deskripsi: "" })
  }

  return (
    <div className="space-y-6">
      <Head title="Master FAQ & Topik Pertanyaan" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-brand-600" />
            Master Topik & FAQ Layanan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola bank pertanyaan umum dan topik helpdesk portal publik.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FolderPlus className="w-4 h-4" />}
            onClick={() => setShowTopikModal(true)}
          >
            Tambah Topik
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowFaqModal(true)}
          >
            Tambah FAQ
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topik List */}
        <Card className="h-fit">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm">Daftar Kategori Topik</CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {topiks.map((topik) => (
              <div
                key={topik.id}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 flex justify-between items-center text-xs"
              >
                <div>
                  <p className="font-bold text-slate-800">{topik.nama}</p>
                  <p className="text-[10px] text-slate-400">{topik.deskripsi}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* FAQ Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm">Bank Data FAQ Layanan</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {faqs.map((faq) => (
                  <div key={faq.id} className="p-4 space-y-1.5 hover:bg-slate-50/60 transition-colors">
                    <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">
                      {faq.layanan}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800">{faq.pertanyaan}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{faq.jawaban}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal FAQ */}
      <Modal show={showFaqModal} onClose={() => setShowFaqModal(false)} title="Tambah FAQ Layanan" size="md">
        <form onSubmit={handleSaveFaq} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-800">Kategori Layanan</label>
            <select
              value={newFaq.layanan}
              onChange={(e) => setNewFaq({ ...newFaq, layanan: e.target.value })}
              className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg"
            >
              {topiks.map((t) => (
                <option key={t.id} value={t.nama}>{t.nama}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-800">Pertanyaan</label>
            <input
              type="text"
              required
              value={newFaq.pertanyaan}
              onChange={(e) => setNewFaq({ ...newFaq, pertanyaan: e.target.value })}
              placeholder="Contoh: Berapa lama waktu kalibrasi alat?"
              className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="font-bold text-slate-800">Jawaban Resmi</label>
            <textarea
              required
              rows={4}
              value={newFaq.jawaban}
              onChange={(e) => setNewFaq({ ...newFaq, jawaban: e.target.value })}
              placeholder="Jawaban penjelasan yang detail..."
              className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <Button size="sm" variant="outline" type="button" onClick={() => setShowFaqModal(false)}>Batal</Button>
            <Button size="sm" variant="primary" type="submit">Simpan FAQ</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Topik */}
      <Modal show={showTopikModal} onClose={() => setShowTopikModal(false)} title="Tambah Topik Bantuan" size="sm">
        <form onSubmit={handleSaveTopik} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-800">Nama Topik</label>
            <input
              type="text"
              required
              value={newTopik.nama}
              onChange={(e) => setNewTopik({ ...newTopik, nama: e.target.value })}
              className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="font-bold text-slate-800">Deskripsi Singkat</label>
            <input
              type="text"
              value={newTopik.deskripsi}
              onChange={(e) => setNewTopik({ ...newTopik, deskripsi: e.target.value })}
              className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <Button size="sm" variant="outline" type="button" onClick={() => setShowTopikModal(false)}>Batal</Button>
            <Button size="sm" variant="primary" type="submit">Simpan</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AdminMasterFaqPage
