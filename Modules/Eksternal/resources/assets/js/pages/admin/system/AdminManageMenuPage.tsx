import React, { useState } from "react"
import { FileSpreadsheet, Plus, Edit, Trash2, ChevronRight, ChevronDown, CheckCircle2 } from "lucide-react"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/Button"
import { Modal } from "../../../components/ui/Modal"
import toast from "react-hot-toast"

interface MenuItemNode {
  id: string
  title: string
  url: string
  icon: string
  status: "AKTIF" | "NONAKTIF"
  actions: string[]
  children?: MenuItemNode[]
}

export const AdminManageMenuPage: React.FC = () => {
  const [menuTree, setMenuTree] = useState<MenuItemNode[]>([
    {
      id: "1",
      title: "Dashboard Operasional",
      url: "/admin/dashboard",
      icon: "LayoutDashboard",
      status: "AKTIF",
      actions: ["Read", "Export SLA"],
    },
    {
      id: "2",
      title: "Permohonan Layanan",
      url: "/admin/permohonan",
      icon: "ClipboardList",
      status: "AKTIF",
      actions: ["Read", "Create", "Approve", "Revisi", "Reject", "Disposisi"],
      children: [
        {
          id: "2-1",
          title: "Input Hasil Uji Lab",
          url: "/admin/sertifikasi/hasil-uji",
          icon: "FlaskConical",
          status: "AKTIF",
          actions: ["Read", "Create", "Update", "Sign TTE"],
        },
      ],
    },
    {
      id: "3",
      title: "Keuangan & PNBP",
      url: "/admin/finance/invoice",
      icon: "Receipt",
      status: "AKTIF",
      actions: ["Read", "Create", "Simpan Tarif", "Confirm Pay"],
      children: [
        {
          id: "3-1",
          title: "Monitoring VA & Kuitansi",
          url: "/admin/finance/pembayaran",
          icon: "CreditCard",
          status: "AKTIF",
          actions: ["Read", "Download Receipt"],
        },
      ],
    },
  ])

  return (
    <div className="space-y-6">
      <Head title="Manajemen Hierarki Menu Sistem" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-brand-600" />
            Manajemen Menu Sistem & Actions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengaturan struktur menu navigasi sistem internal dan penetapan tombol aksi dinamis.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm">Treegrid Struktur Menu</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Nama Menu Induk / Sub-Menu</th>
                  <th className="py-3 px-4 font-bold">URL Route</th>
                  <th className="py-3 px-4 font-bold">Aksi Tombol Diizinkan</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-center w-20">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {menuTree.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr className="hover:bg-slate-50/80 bg-white">
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                        <span>{item.title}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-brand-700">{item.url}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {item.actions.map((act, aIdx) => (
                            <span
                              key={aIdx}
                              className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-600"
                            >
                              {act}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="success">{item.status}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button className="text-slate-400 hover:text-brand-600 p-1">
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>

                    {/* Children Sub-menu rows */}
                    {item.children?.map((child) => (
                      <tr key={child.id} className="hover:bg-slate-50/80 bg-slate-50/40">
                        <td className="py-3 px-4 pl-10 font-semibold text-slate-700 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                          <span>{child.title}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">{child.url}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {child.actions.map((act, aIdx) => (
                              <span
                                key={aIdx}
                                className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-500"
                              >
                                {act}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="success">{child.status}</Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button className="text-slate-400 hover:text-brand-600 p-1">
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminManageMenuPage
