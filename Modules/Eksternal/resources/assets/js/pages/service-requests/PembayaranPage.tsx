import React, { useEffect, useState } from "react"
import {
  Card,
  Table,
  Badge,
  Button,
  Spinner
} from "react-bootstrap"

import Head from "../../components/common/Head"
import api from "../../utils/api"
import Swal from "sweetalert2"

// IMPORT HOOK-NYA DI SINI
// Silakan sesuaikan path import-nya dengan struktur folder Mas Arif
import usePembayaran from "../../hooks/usePembayaran" 

type PembayaranItem = {
  id: string
  nama_permohonan: string
  no_permohonan: string
  tgl_order: string
  total_tagihan: number
  status_bayar: string
  invoice_file?: string | null
  kuitansi_file?: string | null
}

const PembayaranPage: React.FC = () => {
  const [data, setData] = useState<PembayaranItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // Panggil fungsi dari custom hook
  const { openInvoice } = usePembayaran()

  const fetchData = async () => {
    try {
      setLoading(true)

      const res = await api.get("/eksternal/pembayaran")

      const mapped = (res.data.data || []).map((item: any) => ({
        id: item.id,
        nama_permohonan: item.nama_permohonan || "-",
        no_permohonan: item.no_permohonan || "-",
        tgl_order: item.tgl_order || "-",
        total_tagihan: Number(item.total_tagihan || 0),
        status_bayar: item.status_bayar || "BELUM",
        invoice_file: item.invoice_file || null,
        kuitansi_file: item.kuitansi_file || null
      }))

      setData(mapped)

    } catch (error) {
      console.error("Gagal mengambil data pembayaran:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const renderStatus = (status: string) => {
    switch (status) {
      case "BELUM":
        return <Badge bg="warning">Belum Bayar</Badge>
      case "LUNAS":
        return <Badge bg="success">Lunas</Badge>
      case "BATAL":
        return <Badge bg="danger">Batal</Badge>
      default:
        return <Badge bg="secondary">-</Badge>
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }
    const showInfo = (title: string, message: string) => {
    Swal.fire({
      icon: "info",
      title,
      text: message
    })
  }


  return (
    <div className="w-100">
      <Head title="Pembayaran" />

      <Card>
        <Card.Header>
          <div className="w-100 d-flex justify-content-center align-items-center py-2">
            <Card.Title className="pt-2">
              Pembayaran
            </Card.Title>
          </div>
        </Card.Header>

        <Card.Body>

          {loading ? (
            <div className="text-center py-5">
              <Spinner />
            </div>
          ) : (

            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Tanggal Order</th>
                  <th>Nama Permohonan</th>
                  <th>No Permohonan</th>
                  <th>Status Bayar</th>
                  <th>Total Tagihan</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>

                {data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (

                  data.map((item) => (
                    <tr key={item.id}>

                      <td>{formatDate(item.tgl_order)}</td>
                      <td>{item.nama_permohonan}</td>
                      <td>{item.no_permohonan}</td>
                      <td>{renderStatus(item.status_bayar)}</td>
                      <td>{formatCurrency(item.total_tagihan)}</td>

                      <td className="d-flex gap-2">

                        {/* Panggil openInvoice dari hook */}
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => openInvoice(item)}
                        >
                          Invoice
                        </Button>
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => {
                            if (!item.kuitansi_file) {
                              showInfo(
                                "Kuitansi belum tersedia",
                                "Kuitansi akan muncul setelah pembayaran lunas"
                              )
                              return
                            }


                            window.open(
                              `${window.location.origin}/storage/${item.kuitansi_file}`,
                              "_blank"
                            )
                          }}
                        >
                          Kuitansi
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default PembayaranPage