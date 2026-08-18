import React, { useState } from "react"
import { Users, Plus, ShieldCheck, Ban, CheckCircle2, Search, Edit, Lock } from "lucide-react"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/Button"
import { Modal } from "../../../components/ui/Modal"
import toast from "react-hot-toast"

interface UserAdminItem {
  id: string
  name: string
  email: string
  role: string
  bagian: string
  tipe: "INTERNAL" | "EKSTERNAL"
  status: "AKTIF" | "BANNED"
}

export const AdminManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserAdminItem[]>([
    {
      id: "1",
      name: "Dr. Hendra Wijaya, M.T.",
      email: "hendra.wijaya@kemenperin.go.id",
      role: "Verifikator & Asesor",
      bagian: "Seksi Pengujian & Sertifikasi Mutu",
      tipe: "INTERNAL",
      status: "AKTIF",
    },
    {
      id: "2",
      name: "Rina Anggraini, S.Si.",
      email: "rina.anggraini@kemenperin.go.id",
      role: "Bendahara Penerimaan",
      bagian: "Sub Bagian Keuangan & PNBP",
      tipe: "INTERNAL",
      status: "AKTIF",
    },
    {
      id: "3",
      name: "PT Indorubber Global Tech",
      email: "admin@indorubber.co.id",
      role: "Pelanggan Perusahaan",
      bagian: "Eksternal Industri",
      tipe: "EKSTERNAL",
      status: "AKTIF",
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Verifikator & Asesor", bagian: "" })

  const handleToggleBan = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === "AKTIF" ? ("BANNED" as const) : ("AKTIF" as const),
            }
          : u
      )
    )
    toast.success("Status akun pengguna berhasil diperbarui!")
  }

  return (
    <div className="space-y-6">
      <Head title="Manajemen Pengguna & Pegawai" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600" />
            Manajemen Pengguna & Pegawai
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola akun petugas internal balai, penugasan unit kerja, dan akun pelanggan eksternal.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowModal(true)}
        >
          Tambah Akun Pegawai
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm">Daftar Pengguna Sistem</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Nama Lengkap & Email</th>
                  <th className="py-3 px-4 font-bold">Peran (Role)</th>
                  <th className="py-3 px-4 font-bold">Bagian / Unit Kerja</th>
                  <th className="py-3 px-4 font-bold">Tipe Akun</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-center whitespace-nowrap min-w-[120px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <span className="text-[11px] text-slate-400">{u.email}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-brand-700">{u.role}</td>
                    <td className="py-3.5 px-4 text-slate-600">{u.bagian}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={u.tipe === "INTERNAL" ? "info" : "secondary"}>{u.tipe}</Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      {u.status === "AKTIF" ? (
                        <Badge variant="success">Aktif</Badge>
                      ) : (
                        <Badge variant="danger">Diblokir (Banned)</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="sm"
                          variant={u.status === "AKTIF" ? "danger" : "success"}
                          onClick={() => handleToggleBan(u.id)}
                          className="text-xs"
                        >
                          {u.status === "AKTIF" ? "Blokir" : "Aktifkan"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} title="Tambah Akun Pegawai Balai" size="md">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setUsers([
              ...users,
              {
                id: String(Date.now()),
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                bagian: newUser.bagian,
                tipe: "INTERNAL",
                status: "AKTIF",
              },
            ])
            toast.success("Akun pegawai berhasil didaftarkan!")
            setShowModal(false)
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="font-bold text-slate-800">Nama Lengkap & Gelar</label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi Santoso, M.Sc."
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="font-bold text-slate-800">Email Kedinasan</label>
            <input
              type="email"
              required
              placeholder="nama@kemenperin.go.id"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="font-bold text-slate-800">Peran Sistem (Role)</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
            >
              <option value="Verifikator & Asesor">Verifikator & Asesor</option>
              <option value="Bendahara Penerimaan">Bendahara Penerimaan</option>
              <option value="Petugas Laboratorium">Petugas Laboratorium</option>
              <option value="Customer Service">Customer Service</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-800">Bagian / Seksi</label>
            <input
              type="text"
              required
              placeholder="Seksi Standardisasi & Pelayanan Jasa Industri"
              value={newUser.bagian}
              onChange={(e) => setNewUser({ ...newUser, bagian: e.target.value })}
              className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <Button size="sm" variant="outline" type="button" onClick={() => setShowModal(false)}>Batal</Button>
            <Button size="sm" variant="primary" type="submit">Daftarkan Akun</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AdminManageUsersPage
