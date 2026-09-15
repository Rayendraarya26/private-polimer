import React, { useState } from "react"
import { FolderTree, Plus, Edit, Trash2, Search, MapPin } from "lucide-react"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Button } from "../../../components/ui/Button"
import { Modal } from "../../../components/ui/Modal"
import toast from "react-hot-toast"

export const AdminMasterLokasiPage: React.FC = () => {
  const [level, setLevel] = useState<"PROV" | "KAB" | "KEC">("PROV")

  const [provinsiList, setProvinsiList] = useState([
    { id: "31", nama: "DKI JAKARTA" },
    { id: "32", nama: "JAWA BARAT" },
    { id: "33", nama: "JAWA TENGAH" },
    { id: "34", nama: "DI YOGYAKARTA" },
    { id: "35", nama: "JAWA TIMUR" },
    { id: "36", nama: "BANTEN" },
  ])

  const [kabupatenList, setKabupatenList] = useState([
    { id: "3216", prov_nama: "JAWA BARAT", nama: "KABUPATEN BEKASI" },
    { id: "3275", prov_nama: "JAWA BARAT", nama: "KOTA BEKASI" },
    { id: "3471", prov_nama: "DI YOGYAKARTA", nama: "KOTA YOGYAKARTA" },
    { id: "3404", prov_nama: "DI YOGYAKARTA", nama: "KABUPATEN SLEMAN" },
  ])

  const [showModal, setShowModal] = useState(false)
  const [newProv, setNewProv] = useState({ id: "", nama: "" })

  const handleSaveProv = (e: React.FormEvent) => {
    e.preventDefault()
    setProvinsiList([...provinsiList, newProv])
    toast.success("Provinsi baru berhasil ditambahkan!")
    setShowModal(false)
    setNewProv({ id: "", nama: "" })
  }

  return (
    <div className="space-y-6">
      <Head title="Master Wilayah & Lokasi" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-brand-600" />
            Master Data Wilayah & Lokasi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen master data wilayah administratif (Provinsi, Kabupaten/Kota, dan Kecamatan).
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowModal(true)}
        >
          Tambah {level === "PROV" ? "Provinsi" : level === "KAB" ? "Kabupaten" : "Kecamatan"}
        </Button>
      </div>

      {/* Tabs Level */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setLevel("PROV")}
          className={`pb-2.5 px-4 text-xs font-bold border-b-2 ${
            level === "PROV" ? "border-brand-600 text-brand-700" : "border-transparent text-slate-500"
          }`}
        >
          Provinsi ({provinsiList.length})
        </button>
        <button
          onClick={() => setLevel("KAB")}
          className={`pb-2.5 px-4 text-xs font-bold border-b-2 ${
            level === "KAB" ? "border-brand-600 text-brand-700" : "border-transparent text-slate-500"
          }`}
        >
          Kabupaten / Kota ({kabupatenList.length})
        </button>
      </div>

      {/* Tables */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold w-28">Kode Wilayah</th>
                {level === "KAB" && <th className="py-3 px-4 font-bold">Provinsi</th>}
                <th className="py-3 px-4 font-bold">Nama Wilayah Administratif</th>
                <th className="py-3 px-4 font-bold text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {level === "PROV"
                ? provinsiList.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-700">{p.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{p.nama}</td>
                      <td className="py-3.5 px-4 text-center">
                        <button className="text-slate-400 hover:text-brand-600 p-1">
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                : kabupatenList.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-700">{k.id}</td>
                      <td className="py-3.5 px-4 text-slate-500">{k.prov_nama}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{k.nama}</td>
                      <td className="py-3.5 px-4 text-center">
                        <button className="text-slate-400 hover:text-brand-600 p-1">
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal Tambah Provinsi */}
      <Modal show={showModal} onClose={() => setShowModal(false)} title="Tambah Provinsi" size="sm">
        <form onSubmit={handleSaveProv} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-800">Kode Kemendagri</label>
            <input
              type="text"
              required
              placeholder="Contoh: 31"
              value={newProv.id}
              onChange={(e) => setNewProv({ ...newProv, id: e.target.value })}
              className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="font-bold text-slate-800">Nama Provinsi</label>
            <input
              type="text"
              required
              placeholder="Contoh: BALI"
              value={newProv.nama}
              onChange={(e) => setNewProv({ ...newProv, nama: e.target.value })}
              className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <Button size="sm" variant="outline" type="button" onClick={() => setShowModal(false)}>Batal</Button>
            <Button size="sm" variant="primary" type="submit">Simpan</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AdminMasterLokasiPage
