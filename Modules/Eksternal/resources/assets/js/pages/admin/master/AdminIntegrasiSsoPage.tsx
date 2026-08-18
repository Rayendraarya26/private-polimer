import React, { useState } from "react"
import { KeyRound, Plus, RotateCcw, Copy, ShieldAlert, Check } from "lucide-react"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/Button"
import { Modal } from "../../../components/ui/Modal"
import toast from "react-hot-toast"

interface SsoClientItem {
  id: string
  client_name: string
  client_id: string
  client_secret: string
  redirect_url: string
  status: "AKTIF" | "NONAKTIF"
}

export const AdminIntegrasiSsoPage: React.FC = () => {
  const [clients, setClients] = useState<SsoClientItem[]>([
    {
      id: "1",
      client_name: "Sistem Informasi Sertifikasi Produk (SISPRO)",
      client_id: "sispro_bbkkp_client_982",
      client_secret: "sec_live_9a8b7c6d5e4f3a2b1c",
      redirect_url: "https://sispro.kemenperin.go.id/auth/callback",
      status: "AKTIF",
    },
    {
      id: "2",
      client_name: "Portal Monitoring Industri Kemenperin (SIINas)",
      client_id: "siinas_connector_bbkkp_441",
      client_secret: "sec_live_ffeeddccbbaa009988",
      redirect_url: "https://siinas.kemenperin.go.id/sso/bbkkp/callback",
      status: "AKTIF",
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [newClient, setNewClient] = useState({ client_name: "", redirect_url: "" })

  const handleRegenerateSecret = (id: string) => {
    setClients(
      clients.map((c) =>
        c.id === id
          ? {
              ...c,
              client_secret: "sec_live_" + Math.random().toString(36).substring(2, 15),
            }
          : c
      )
    )
    toast.success("Client Secret berhasil di-regenerate!")
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Disalin ke clipboard!")
  }

  return (
    <div className="space-y-6">
      <Head title="Integrasi Single Sign-On (SSO)" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-brand-600" />
            Integrasi Single Sign-On (SSO OAuth)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen client application OAuth2 untuk integrasi login antar aplikasi internal Kemenperin.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowModal(true)}
        >
          Daftarkan Client SSO
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm">Daftar Aplikasi Terhubung</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Nama Aplikasi Client</th>
                <th className="py-3 px-4 font-bold">Client ID & Callback URL</th>
                <th className="py-3 px-4 font-bold">Client Secret</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 font-bold text-slate-800">{c.client_name}</td>
                  <td className="py-3.5 px-4 font-mono">
                    <div className="flex items-center gap-1.5 text-brand-700 font-semibold">
                      <span>{c.client_id}</span>
                      <button
                        onClick={() => handleCopy(c.client_id)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{c.redirect_url}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <span>{c.client_secret}</span>
                      <button
                        onClick={() => handleCopy(c.client_secret)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success">{c.status}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => handleRegenerateSecret(c.id)}
                    >
                      <RotateCcw className="w-3 h-3 mr-1" /> Reset Secret
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} title="Daftarkan SSO Client" size="md">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setClients([
              ...clients,
              {
                id: String(Date.now()),
                client_name: newClient.client_name,
                client_id: "client_" + Math.random().toString(36).substring(2, 10),
                client_secret: "sec_live_" + Math.random().toString(36).substring(2, 18),
                redirect_url: newClient.redirect_url,
                status: "AKTIF",
              },
            ])
            toast.success("Client SSO berhasil dibuat!")
            setShowModal(false)
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="font-bold text-slate-800">Nama Aplikasi</label>
            <input
              type="text"
              required
              placeholder="Contoh: SIINas Mobile App"
              value={newClient.client_name}
              onChange={(e) => setNewClient({ ...newClient, client_name: e.target.value })}
              className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="font-bold text-slate-800">Callback / Redirect URI</label>
            <input
              type="url"
              required
              placeholder="https://app.kemenperin.go.id/oauth/callback"
              value={newClient.redirect_url}
              onChange={(e) => setNewClient({ ...newClient, redirect_url: e.target.value })}
              className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <Button size="sm" variant="outline" type="button" onClick={() => setShowModal(false)}>Batal</Button>
            <Button size="sm" variant="primary" type="submit">Buat Kredensial SSO</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AdminIntegrasiSsoPage
