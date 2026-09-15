import React, { useState } from "react"
import { ShieldCheck, Plus, CheckSquare, Square, Save } from "lucide-react"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/Button"
import toast from "react-hot-toast"

interface PermissionNode {
  id: string
  label: string
  actions: string[]
  children?: PermissionNode[]
}

const permissionTree: PermissionNode[] = [
  {
    id: "operasional",
    label: "Modul Permohonan & Operasional",
    actions: ["Read", "Create", "Approve", "Revisi", "Reject", "Disposisi"],
    children: [
      { id: "verifikasi", label: "Verifikasi Berkas Masuk", actions: ["Read", "Approve", "Revisi", "Reject"] },
      { id: "hasil_uji", label: "Input Hasil Uji & TTE BSrE", actions: ["Read", "Create", "Update", "Sign TTE"] },
    ],
  },
  {
    id: "keuangan",
    label: "Modul Keuangan & PNBP",
    actions: ["Read", "Create Invoice", "Verifikasi Bayar", "Cetak Kuitansi"],
    children: [
      { id: "invoice", label: "Manajemen Invoice", actions: ["Read", "Create", "Simpan Tarif"] },
      { id: "pembayaran", label: "Konfirmasi Pembayaran", actions: ["Read", "Confirm", "Export"] },
    ],
  },
  {
    id: "helpdesk",
    label: "Modul Bantuan & Tiket",
    actions: ["Read", "Reply Ticket", "Close Ticket"],
  },
  {
    id: "master_sistem",
    label: "Master Data & Pengaturan Sistem",
    actions: ["Read", "Create", "Update", "Delete", "Manage Users", "Manage Roles"],
  },
]

export const AdminManageGroupsPage: React.FC = () => {
  const [groups, setGroups] = useState([
    { id: "1", nama: "Super Administrator", deskripsi: "Akses penuh ke seluruh sistem dan konfigurasi", total_user: 3 },
    { id: "2", nama: "Verifikator Berkas & Asesor", deskripsi: "Hak verifikasi dokumen permohonan dan asesmen teknis", total_user: 8 },
    { id: "3", nama: "Bendahara Penerimaan PNBP", deskripsi: "Hak kelola invoice tarif, monitoring VA BNI & kuitansi", total_user: 4 },
    { id: "4", nama: "Helpdesk & Customer Service", deskripsi: "Hak kelola tiket tanya jawab dan FAQ layanan", total_user: 5 },
  ])

  const [selectedGroupId, setSelectedGroupId] = useState("2")
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({
    "operasional:Read": true,
    "operasional:Approve": true,
    "operasional:Revisi": true,
    "verifikasi:Read": true,
    "verifikasi:Approve": true,
    "hasil_uji:Read": true,
    "hasil_uji:Sign TTE": true,
  })

  const togglePermission = (key: string) => {
    setSelectedPermissions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSaveMatrix = () => {
    toast.success("Matriks hak akses (Role Permissions) berhasil disimpan!")
  }

  return (
    <div className="space-y-6">
      <Head title="Grup & Matriks Hak Akses (RBAC)" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-brand-600" />
            Grup Peran & Matriks Hak Akses (RBAC)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Konfigurasi grup pengguna dan checklist permission matriks per menu/aksi.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Save className="w-4 h-4" />}
          onClick={handleSaveMatrix}
        >
          Simpan Hak Akses
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Groups List */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm">Daftar Grup / Peran</CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-1.5">
            {groups.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGroupId(g.id)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  selectedGroupId === g.id
                    ? "bg-brand-600 text-white shadow-md shadow-brand-900/20"
                    : "hover:bg-slate-50 text-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-xs">{g.nama}</p>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      selectedGroupId === g.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {g.total_user} User
                  </span>
                </div>
                <p
                  className={`text-[11px] mt-1 line-clamp-2 ${
                    selectedGroupId === g.id ? "text-brand-100" : "text-slate-400"
                  }`}
                >
                  {g.deskripsi}
                </p>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Treeview Permission Checklist */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm">Matriks Hak Akses Menu & Aksi</CardTitle>
                <CardDescription>
                  Centang modul dan aksi yang diizinkan untuk grup peran ini
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              {permissionTree.map((node) => (
                <div key={node.id} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-brand-900">{node.label}</span>
                  </div>

                  {/* Actions checkboxes */}
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-200">
                    {node.actions.map((act) => {
                      const key = `${node.id}:${act}`
                      const checked = Boolean(selectedPermissions[key])
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => togglePermission(key)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                            checked
                              ? "bg-brand-600 text-white border-brand-600 shadow-xs"
                              : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                          }`}
                        >
                          {checked ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                          <span>{act}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Children Sub-modules */}
                  {node.children && (
                    <div className="pl-4 space-y-2 pt-2 border-t border-slate-200">
                      {node.children.map((child) => (
                        <div key={child.id} className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-2">
                          <span className="font-bold text-[11px] text-slate-800">{child.label}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {child.actions.map((act) => {
                              const key = `${child.id}:${act}`
                              const checked = Boolean(selectedPermissions[key])
                              return (
                                <button
                                  key={key}
                                  type="button"
                                  onClick={() => togglePermission(key)}
                                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-all ${
                                    checked
                                      ? "bg-brand-50 text-brand-800 border-brand-300 font-bold"
                                      : "bg-white text-slate-500 border-slate-200"
                                  }`}
                                >
                                  {checked ? <CheckSquare className="w-3 h-3 text-brand-600" /> : <Square className="w-3 h-3 text-slate-400" />}
                                  <span>{act}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminManageGroupsPage
