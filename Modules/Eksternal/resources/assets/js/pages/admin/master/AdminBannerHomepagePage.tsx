import React, { useState } from "react"
import { Sliders, Plus, Trash2, Edit, Eye, Upload, ExternalLink, Image as ImageIcon } from "lucide-react"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/Button"
import { Modal } from "../../../components/ui/Modal"
import toast from "react-hot-toast"

export const AdminBannerHomepagePage: React.FC = () => {
  const [banners, setBanners] = useState([
    {
      id: "1",
      judul: "Layanan Sertifikasi Profesi LSP BBKKP BNSP",
      deskripsi: "Tingkatkan daya saing SDM industri kulit dan polimer Indonesia",
      url_banner: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60",
      link_url: "/#/permohonan/sertifikasi-profesi",
      urutan: 1,
      status: "AKTIF",
    },
    {
      id: "2",
      judul: "Fasilitas Pengujian Mutu SNI & ISO Terakreditasi KAN",
      deskripsi: "Laboratorium pengujian fisika dan kimia berstandar internasional",
      url_banner: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=60",
      link_url: "/#/permohonan",
      urutan: 2,
      status: "AKTIF",
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [newBanner, setNewBanner] = useState({ judul: "", deskripsi: "", link_url: "", urutan: 3 })

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault()
    setBanners([
      ...banners,
      {
        id: String(Date.now()),
        ...newBanner,
        url_banner: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
        status: "AKTIF",
      },
    ])
    toast.success("Banner baru berhasil diunggah!")
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      <Head title="Manajemen Banner & Konten Homepage" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-brand-600" />
            Manajemen Banner & Slider Homepage
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengaturan slide promosi dan pengumuman visual di halaman utama portal.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowModal(true)}
        >
          Upload Banner Baru
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm">Daftar Banner Aktif</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold w-16">Urutan</th>
                <th className="py-3 px-4 font-bold w-40">Preview</th>
                <th className="py-3 px-4 font-bold">Judul & Deskripsi</th>
                <th className="py-3 px-4 font-bold">Target Link</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {banners.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 font-bold text-center text-slate-700">{b.urutan}</td>
                  <td className="py-3.5 px-4">
                    <img
                      src={b.url_banner}
                      alt={b.judul}
                      className="w-32 h-16 object-cover rounded-lg border border-slate-200"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800">{b.judul}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{b.deskripsi}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-brand-600">{b.link_url}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success">{b.status}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="text-slate-400 hover:text-brand-600 p-1">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-slate-400 hover:text-rose-600 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal Upload */}
      <Modal show={showModal} onClose={() => setShowModal(false)} title="Upload Banner Baru" size="md">
        <form onSubmit={handleSaveBanner} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-800">Judul Banner</label>
            <input
              type="text"
              required
              value={newBanner.judul}
              onChange={(e) => setNewBanner({ ...newBanner, judul: e.target.value })}
              className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="font-bold text-slate-800">Deskripsi Ringkas</label>
            <input
              type="text"
              value={newBanner.deskripsi}
              onChange={(e) => setNewBanner({ ...newBanner, deskripsi: e.target.value })}
              className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="font-bold text-slate-800">File Gambar Banner (1920x600 px)</label>
            <input type="file" required accept="image/*" className="w-full mt-1 text-xs text-slate-500" />
          </div>
          <div>
            <label className="font-bold text-slate-800">Target Tautan / URL</label>
            <input
              type="text"
              value={newBanner.link_url}
              onChange={(e) => setNewBanner({ ...newBanner, link_url: e.target.value })}
              placeholder="/#/permohonan"
              className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <Button size="sm" variant="outline" type="button" onClick={() => setShowModal(false)}>Batal</Button>
            <Button size="sm" variant="primary" type="submit">Simpan & Publikasikan</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AdminBannerHomepagePage
