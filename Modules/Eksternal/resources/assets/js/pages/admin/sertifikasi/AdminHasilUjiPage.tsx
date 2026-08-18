import React, { useState } from "react"
import {
  FlaskConical,
  Plus,
  FileCheck2,
  Download,
  Eye,
  CheckCircle2,
  Trash2,
  Upload,
} from "lucide-react"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/Button"
import { Modal } from "../../../components/ui/Modal"
import toast from "react-hot-toast"

interface ParameterHasilUji {
  parameter: string
  metode: string
  satuan: string
  baku_mutu: string
  hasil_uji: string
  kesimpulan: "MEMENUHI" | "TIDAK_MEMENUHI"
}

export const AdminHasilUjiPage: React.FC = () => {
  const [showInputModal, setShowInputModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState("REQ-2026-0819")
  const [paramsList, setParamsList] = useState<ParameterHasilUji[]>([
    {
      parameter: "Kekuatan Tarik (Tensile Strength)",
      metode: "SNI 06-0001-1987",
      satuan: "MPa",
      baku_mutu: "Min. 14.0",
      hasil_uji: "18.5",
      kesimpulan: "MEMENUHI",
    },
    {
      parameter: "Perpanjangan Putus (Elongation at Break)",
      metode: "SNI 06-0001-1987",
      satuan: "%",
      baku_mutu: "Min. 300",
      hasil_uji: "420",
      kesimpulan: "MEMENUHI",
    },
    {
      parameter: "Kekerasan (Hardness Shore A)",
      metode: "ASTM D2240",
      satuan: "Shore A",
      baku_mutu: "60 ± 5",
      hasil_uji: "62",
      kesimpulan: "MEMENUHI",
    },
  ])

  const handleAddParam = () => {
    setParamsList([
      ...paramsList,
      {
        parameter: "",
        metode: "",
        satuan: "",
        baku_mutu: "",
        hasil_uji: "",
        kesimpulan: "MEMENUHI",
      },
    ])
  }

  const handleRemoveParam = (idx: number) => {
    setParamsList(paramsList.filter((_, i) => i !== idx))
  }

  const handleSimpanHasilUji = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Hasil pengujian laboratorium disimpan. Draf Sertifikat siap diajukan untuk TTE BSrE!")
    setShowInputModal(false)
  }

  return (
    <div className="space-y-6">
      <Head title="Input Hasil Uji & Penerbitan Sertifikat TTE" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-brand-600" />
            Hasil Uji Laboratorium & Sertifikat TTE
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Input parameter hasil uji laboratorium, upload draf laporan, dan penerbitan sertifikat bertanda tangan elektronik BSrE.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowInputModal(true)}
        >
          Input Hasil Uji Baru
        </Button>
      </div>

      {/* Table Data Sertifikasi / Uji */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm">Daftar Pengujian & Status Sertifikat</CardTitle>
          <CardDescription>Antrean hasil uji yang sedang berjalan dan siap terbit sertifikat</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">No. Order & Sampel</th>
                  <th className="py-3 px-4 font-bold">Pelanggan</th>
                  <th className="py-3 px-4 font-bold">Laboratorium Penguji</th>
                  <th className="py-3 px-4 font-bold">Jumlah Parameter</th>
                  <th className="py-3 px-4 font-bold">Status Sertifikat</th>
                  <th className="py-3 px-4 font-bold text-center">Aksi Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-brand-700">REQ-2026-0819</p>
                    <span className="text-[11px] text-slate-500">Kompon Karet Sol Sepatu (4 Sampel)</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    PT Indorubber Global Tech
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">Lab Uji Fisika Karet BBKKP</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">3 Parameter (Lolos)</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success">Siap Sign TTE BSrE</Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        title="Pratinjau Draf Sertifikat"
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Pratinjau PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        title="Ajukan TTE BSrE"
                        leftIcon={<FileCheck2 className="w-3.5 h-3.5" />}
                      >
                        Sign TTE
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Input Hasil Uji */}
      <Modal
        show={showInputModal}
        onClose={() => setShowInputModal(false)}
        title="Form Input Parameter Hasil Uji Laboratorium"
        size="xl"
      >
        <form onSubmit={handleSimpanHasilUji} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-800">Pilih Permohonan Masuk</label>
              <select
                value={selectedOrder}
                onChange={(e) => setSelectedOrder(e.target.value)}
                className="w-full mt-1 p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
              >
                <option value="REQ-2026-0819">REQ-2026-0819 — PT Indorubber Global Tech</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-800">Laboratorium Penguji</label>
              <input
                type="text"
                readOnly
                value="Laboratorium Pengujian Fisika & Kimia Karet BBKKP"
                className="w-full mt-1 p-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs text-slate-600"
              />
            </div>
          </div>

          {/* Dynamic Parameter Grid */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800">Tabel Parameter Hasil Uji</h4>
              <Button type="button" size="sm" variant="outline" onClick={handleAddParam}>
                <Plus className="w-3 h-3 mr-1" /> Tambah Parameter
              </Button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Parameter Uji</th>
                    <th className="p-2.5">Metode Acuan</th>
                    <th className="p-2.5">Satuan</th>
                    <th className="p-2.5">Baku Mutu</th>
                    <th className="p-2.5">Hasil Uji</th>
                    <th className="p-2.5">Kesimpulan</th>
                    <th className="p-2.5 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paramsList.map((param, idx) => (
                    <tr key={idx}>
                      <td className="p-2">
                        <input
                          type="text"
                          required
                          value={param.parameter}
                          onChange={(e) => {
                            const updated = [...paramsList]
                            updated[idx].parameter = e.target.value
                            setParamsList(updated)
                          }}
                          className="w-full p-1.5 border border-slate-300 rounded-lg text-xs"
                          placeholder="Nama parameter"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          required
                          value={param.metode}
                          onChange={(e) => {
                            const updated = [...paramsList]
                            updated[idx].metode = e.target.value
                            setParamsList(updated)
                          }}
                          className="w-full p-1.5 border border-slate-300 rounded-lg text-xs"
                          placeholder="Metode SNI/ISO"
                        />
                      </td>
                      <td className="p-2 w-20">
                        <input
                          type="text"
                          value={param.satuan}
                          onChange={(e) => {
                            const updated = [...paramsList]
                            updated[idx].satuan = e.target.value
                            setParamsList(updated)
                          }}
                          className="w-full p-1.5 border border-slate-300 rounded-lg text-xs"
                        />
                      </td>
                      <td className="p-2 w-24">
                        <input
                          type="text"
                          value={param.baku_mutu}
                          onChange={(e) => {
                            const updated = [...paramsList]
                            updated[idx].baku_mutu = e.target.value
                            setParamsList(updated)
                          }}
                          className="w-full p-1.5 border border-slate-300 rounded-lg text-xs"
                        />
                      </td>
                      <td className="p-2 w-24">
                        <input
                          type="text"
                          required
                          value={param.hasil_uji}
                          onChange={(e) => {
                            const updated = [...paramsList]
                            updated[idx].hasil_uji = e.target.value
                            setParamsList(updated)
                          }}
                          className="w-full p-1.5 border border-slate-300 rounded-lg text-xs font-bold"
                        />
                      </td>
                      <td className="p-2 w-32">
                        <select
                          value={param.kesimpulan}
                          onChange={(e) => {
                            const updated = [...paramsList]
                            updated[idx].kesimpulan = e.target.value as "MEMENUHI"
                            setParamsList(updated)
                          }}
                          className="w-full p-1.5 border border-slate-300 rounded-lg text-xs"
                        >
                          <option value="MEMENUHI">Memenuhi</option>
                          <option value="TIDAK_MEMENUHI">Tidak Memenuhi</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveParam(idx)}
                          className="text-rose-500 hover:bg-rose-50 p-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upload Draft Laporan File */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-brand-600" />
              Upload Draf Laporan Hasil Pengujian (PDF)
            </label>
            <input type="file" accept=".pdf" className="w-full text-xs text-slate-500" />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowInputModal(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan & Siapkan Sertifikat TTE
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AdminHasilUjiPage
