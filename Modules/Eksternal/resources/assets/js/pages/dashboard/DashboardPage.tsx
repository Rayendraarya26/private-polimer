import clsx from "clsx"
import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import { Badge, Button, Card, Carousel, Col, Dropdown, Form, ProgressBar, Row, Spinner } from "react-bootstrap"
import { Award, Download, Edit, Plus, Send, Trash, Eye } from "react-feather"
import styled from "styled-components"
import { FeedbackItemStatusOrder, SertifikatItem } from "../../types/feedbacks"
import { getDateDisplay } from "../../utils/date"
import useDashboard from "../../hooks/useDashboard"
import useFeedbacks from "../../hooks/feedback/useFeedbacks"
import { useNavigate } from "react-router-dom"
import api from "../../utils/api"
import toast from "react-hot-toast"
import { getFilenameFromContentDisposition } from "../../utils/common"
import Head from "../../components/common/Head"
import { AxiosError } from "axios"
import usePelatihan from "../../hooks/service-requests/usePelatihan"
import { useLSP } from "../../hooks/service-requests/useLSP"

const StyledBannerImage = styled.img`
  width: 100%;
  aspect-ratio: 4/1;
  object-fit: cover;
  object-position: center;
`


const StyledStatsCard = styled.div`
  padding: 0.25rem;
  @media screen and (min-width: 1366px) {
    padding: 0.5rem;
  }
  .title {
    white-space: nowrap;
    font-size: 0.65rem;
    @media screen and (min-width: 1366px) {
      font-size: 0.85rem;
    }
  }
  .total {
    font-size: 3rem;
    @media screen and (min-width: 1366px) {
      font-size: 6rem;
    }
  }
`

const currentYear = (new Date()).getFullYear()

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    loading,
    statisticData,
    sliders,
    getStatisticData,
    ajukanPermohonan,
    submittedIds
  } = useDashboard()
  const getFileUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) {
    return path; // sudah URL lengkap
  }
  return `${window.location.origin}/storage/${path}`;
};
  const {
    deletePelatihan
  } = usePelatihan()
  const {
    deleteLSP
  } = useLSP()
  const {
    loading: loadingHistory,
    data,
    page,
    total,
    totalPages,
    status,
    getFeedbacks,
    setPage,
    changeStatus
  } = useFeedbacks({ useLoadMore: true })
  const [modalFile, setModalFile] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const handleCatatanClick = (value: string) => {
  if (!value) return;
  const isFile =
    value.includes('/') ||
    value.includes('.pdf') ||
    value.includes('.png') ||
    value.includes('.jpg');
  if (isFile) {
    setModalFile(value);
    setShowModal(true);
  }
};

  const [selectedStatisticYear, setSelectedStatisticYear] = useState<number>(currentYear)

  useEffect(() => {
    getFeedbacks()
  }, [page, status])

  useEffect(() => {
    getStatisticData(selectedStatisticYear)
  }, [selectedStatisticYear])

  const historyStatusOptions = useMemo(() => ([
    {
      value: undefined,
      label: '-- Semua Status --'
    },
    {
      value: FeedbackItemStatusOrder.DRAFT,
      label: 'Draft'
    },
    {
      value: FeedbackItemStatusOrder.PERMOHONAN,
      label: 'Permohonan'
    },
    {
      value: FeedbackItemStatusOrder.REVISI,
      label: 'Revisi'
    },
    {
      value: FeedbackItemStatusOrder.IN_REVIEW,
      label: 'Dalam Review'
    },
    {
      value: FeedbackItemStatusOrder.PEMBAYARAN,
      label: 'Pembayaran'
    },
    {
      value: FeedbackItemStatusOrder.PROCESS,
      label: 'Dalam proses'
    },
    {
      value: FeedbackItemStatusOrder.DONE,
      label: 'Selesai'
    }
  ]), [])

  const statisticYearOptions = useMemo<number[]>(() => ([
    currentYear,
    currentYear - 1,
    currentYear - 2,
    currentYear - 3,
    currentYear - 4
  ]), [])

  const statistics = useMemo(() => ([
    {
      colClassName: 'col',
      classNames: 'fw-semibold bg-primary text-white',
      title: 'Total Permohonan',
      total: statisticData?.total_all || 0,
    },
    {
      colClassName: 'col',
      classNames: 'fw-semibold bg-warning',
      title: 'Belum Dibayar',
      total: statisticData?.total_pembayaran || 0,
    },
    {
      colClassName: 'col',
      classNames: 'fw-semibold bg-success text-white',
      title: 'Selesai',
      total: statisticData?.total_selesai || 0,
    },
    {
      colClassName: 'col',
      classNames: 'fw-semibold bg-info',
      title: 'On Progress',
      total: statisticData?.total_proses || 0,
    },
    {
      colClassName: 'col',
      classNames: 'fw-semibold bg-danger text-white',
      title: 'Ditolak',
      total: statisticData?.total_ditolak || 0,
    }
  ]), [statisticData])

  const onDownloadCertificate = useCallback(async (data: SertifikatItem) => {
    if (!data) return
    const toastId = toast.loading('Mengunduh sertifikat')
    try {
      const res = await api.get(data.download_link, {responseType: 'blob'})
      const blob = new Blob([res.data], { type: res?.headers?.['content-type'] })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const filename = getFilenameFromContentDisposition(res?.headers?.['content-disposition'] || '')
      if (filename) link.download = filename
      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(url)
      link.parentNode?.removeChild(link)
    } catch (error) {
      const err = error as AxiosError
      if (err?.response?.headers['content-type'] === 'application/json') {
        const reader = new FileReader()
        reader.readAsText(err?.response?.data as Blob)
        reader.onload = () => {
          const errorData = JSON.parse(reader.result as string)
          toast.error(errorData?.message)
        }
      }
    } finally {
      toast.remove(toastId)
    }
  }, [])
  // const onEdit = (item: any) => {
  //     navigate(`/permohonan/edit/${item.id}`)
  //   }
    const onEdit = (item: any) => {
      navigate(`/permohonan/edit/${item.id}`)
    }
    const onReapply = async (item: any) => {
      const confirmAjukan = confirm(`Yakin ingin mengajukan ulang permohonan ${item.kode_order}?`)
      if (!confirmAjukan) return
      const toastId = toast.loading("Mengajukan ulang permohonan...")
      try {
        await api.post(`/eksternal/pelatihan/${item.id}/ajukan-ulang`)
        toast.success("Permohonan berhasil diajukan ulang")
        getFeedbacks() // refresh dashboard
      } catch (error: any) {
        const message =
          error?.response?.data?.message || "Gagal mengajukan ulang permohonan"
        toast.error(message)
      } finally {
        toast.remove(toastId)
      }
    }
    const onDelete = async (item: any) => {
  const isLSP =
    item.layanan_slug?.includes("lsp") ||
    item.layanan?.toLowerCase().includes("lsp")
  if (isLSP) {
    await deleteLSP(
      item,
      getFeedbacks
    )
    return
  }
  await deletePelatihan(
    item,
    getFeedbacks
  )
}

  return (
    <div className="w-100 d-flex flex-column align-items-stretch gap-4">
      <Head title="Dashboard"/>
      {sliders.length > 0 && (
        <div className="w-100">
          <Carousel className="rounded-3 overflow-hidden">
            {sliders.map((r, i) => (
              <Carousel.Item key={i}>
                <StyledBannerImage
                  src={r.image}
                  draggable="false"
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      )}
      <Row>
        <Col xs={12} lg={12} className="px-3 py-2">
          <Card className="h-100">
            <Card.Header className="pt-2">
              <div className="w-100 d-flex justify-content-between align-items-center gap-2">
                <h6 className="mb-0">Statistik Layanan</h6>
                <Form.Select
                  style={{ width: '7rem' }}
                  value={selectedStatisticYear}
                  disabled={loading.statistic}
                  onChange={e => setSelectedStatisticYear(parseInt(e.target.value))}
                >
                  {statisticYearOptions.map(v => <option key={v} value={v}>{v}</option>)}
                </Form.Select>
              </div>
            </Card.Header>
            <Card.Body className="position-relative">
              {loading.statistic && (
                <div
                  className="w-100 h-100 position-absolute bg-white"
                  style={{
                    inset: 0,
                    display: 'grid',
                    placeItems: 'center'
                  }}
                >
                  <Spinner variant="primary"/>
                </div>
              )}
              <div className="w-100 row m-0">
                {statistics.map((r, i) => (
                  <StyledStatsCard
                    key={i}
                    className={clsx(r.colClassName)}
                  >
                    <div className={clsx("w-100 border rounded-3 py-3", r.classNames)}>
                      <div className="w-100 text-center title">{r.title}</div>
                      <div className="w-100 h-100 d-flex">
                        <div className="m-auto total">
                          {r.total}
                        </div>
                      </div>
                    </div>
                  </StyledStatsCard>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} className="px-3 py-2">
          <Card>
            <Card.Header className="pt-3">
            <div className="w-100 d-flex justify-content-between align-items-center gap-2">
              <div>
                <h6 className="mb-0">Riwayat Permohonan Layanan</h6>
                <small style={{ fontSize: '0.75rem' }}>
                  Menampilkan {data.length} dari {total}
                </small>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate('/permohonan')}
                  className="d-flex align-items-center gap-1 shadow-sm"
                >
                 
              <Plus size={16}/>
              <div>Permohonan Baru</div>
                </Button>
                <Form.Select
                  style={{ width: '12rem' }}
                  value={status}
                  onChange={e =>
                    changeStatus((e.target.value || undefined) as FeedbackItemStatusOrder | undefined)
                  }
                >
                  {historyStatusOptions.map((r, i) => (
                    <option key={i} value={r.value || ''}>
                      {r.label}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </div>
            </Card.Header>
            <Card.Body className="w-100">
              <div
                className="w-100 d-flex align-items-center flex-column gap-2"
                style={{
                  maxHeight: '75dvh',
                  overflowY: 'auto'
                }}
              >
                {data.map(r => (
                  <div
                    key={r.id}
                    className="w-100 border rounded-3 p-3 bg-light"
                  >
                    <h6 className="fw-semibold">{r.layanan}</h6>
                    <div className="d-inline-flex align-items-center gap-3 mb-2">
                      <div
                        style={{ fontSize: '0.75rem' }}
                        className="fw-semibold"
                      >
                        ID: {r.kode_order}
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem' }}>Status:</span>{' '}
                        {r.status_order === FeedbackItemStatusOrder.DRAFT && <Badge bg="secondary">DRAFT</Badge>}
                        {r.status_order === FeedbackItemStatusOrder.PERMOHONAN && <Badge bg="secondary">Permohonan</Badge>}
                        {r.status_order === FeedbackItemStatusOrder.REVISI && <Badge bg="warning">Revisi</Badge>}
                        {r.status_order === FeedbackItemStatusOrder.PEMBAYARAN && <Badge bg="info">Pembayaran</Badge>}
                        {r.status_order === FeedbackItemStatusOrder.PROCESS && <Badge bg="warning">Dalam proses</Badge>}
                        {r.status_order === FeedbackItemStatusOrder.IN_REVIEW && <Badge bg="primary">Dalam Review</Badge>}
                        {r.status_order === FeedbackItemStatusOrder.DONE && <Badge bg="success">Selesai</Badge>}
                        {r.status_order === FeedbackItemStatusOrder.DITOLAK && (<Badge bg="danger">Ditolak</Badge>)}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem' }}>
                      Tanggal Order: {r.tanggal_order ? getDateDisplay(r.tanggal_order, true) : "-"}                    </div>
                      <div className="py-3">
                        {r.status_order === FeedbackItemStatusOrder.REVISI && <ProgressBar variant="warning" now={r.persentase_order} label={`${r.persentase_order}%`} />}
                        {r.status_order === FeedbackItemStatusOrder.PERMOHONAN && <ProgressBar variant="secondary" now={r.persentase_order} label={`${r.persentase_order}%`} />}
                        {r.status_order === FeedbackItemStatusOrder.PEMBAYARAN && <ProgressBar variant="info" now={r.persentase_order} label={`${r.persentase_order}%`} />}
                        {r.status_order === FeedbackItemStatusOrder.PROCESS && <ProgressBar variant="warning" now={r.persentase_order} label={`${r.persentase_order}%`} />}
                        {r.status_order === FeedbackItemStatusOrder.IN_REVIEW && <ProgressBar variant="primary" now={r.persentase_order} label={`${r.persentase_order}%`} />}
                        {r.status_order === FeedbackItemStatusOrder.DONE && <ProgressBar variant="success" now={r.persentase_order} label={`${r.persentase_order}%`} />}
                      </div>
                    {r.status_order === FeedbackItemStatusOrder.DONE && r.file_attachment.length < 1 && r.is_given_feedback && (
                      <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                        Saat ini sertifikat belum tersedia. Jika dalam waktu 1 hari sertifikat belum muncul, silakan hubungi CS kami di nomor{' '}
                        <a href={`https://wa.me/628112827821?text=Sertifikat Saya pada layanan *${r.layanan}* dengan ID Order *${r.kode_order}* belum tersedia pada portal JIS, mohon bantuannya untuk pengecekan data terkait. Terimakasih`} target="_blank" rel="noopener noreferrer">
                          +628112827821
                        </a> untuk bantuan lebih lanjut.
                      </div>
                    )}

                    {/* CATATAN ADMIN */}
                    {[
                      FeedbackItemStatusOrder.REVISI,
                      FeedbackItemStatusOrder.PEMBAYARAN,
                      FeedbackItemStatusOrder.DONE
                    ].includes(r.status_order) && r.catatan_admin && (() => {
                      const isFileAllowed =
                        r.status_order === FeedbackItemStatusOrder.PEMBAYARAN ||
                        r.status_order === FeedbackItemStatusOrder.DONE
                      const showAsFile =
                        isFileAllowed && typeof r.catatan_admin === "string"
                      const bgColor =
                        r.status_order === FeedbackItemStatusOrder.PEMBAYARAN
                          ? "#d1ecf1"
                          : "#fff3cd"
                      const borderColor =
                        r.status_order === FeedbackItemStatusOrder.PEMBAYARAN
                          ? "#0dcaf0"
                          : "#ffc107"
                      const title =
                        r.status_order === FeedbackItemStatusOrder.PEMBAYARAN
                          ? "Dokumen Penawaran:"
                          : r.status_order === FeedbackItemStatusOrder.DONE
                          ? "Catatan Admin:"
                          : "Catatan Revisi:"
                      return (
                        <div
                          className="mb-2 d-flex align-items-center gap-2"
                          style={{
                            fontSize: "0.75rem"
                          }}
                        >
                          <strong
                            style={{
                              color:
                                r.status_order === FeedbackItemStatusOrder.REVISI
                                  ? "#dc3545"
                                  : "#212529"
                            }}
                          >
                            {title}
                          </strong>
                          {showAsFile ? (
                            <div
                              role="button"
                              onClick={() =>
                                r.catatan_admin && handleCatatanClick(r.catatan_admin)
                              }
                              className="d-inline-flex align-items-center gap-1"
                              style={{
                                cursor: "pointer",
                                color: "#0d6efd",
                                fontWeight: 500,
                                transition: "0.2s ease",
                                fontSize: "0.75rem"
                              }}
                            >
                              <Eye size={14} />
                              <span>Lihat Dokumen</span>
                            </div>
                          ) : (
                            <span>{r.catatan_admin}</span>
                          )}
                        </div>
                      )
                    })()}
                    {showModal && modalFile && (
                      <div className="modal show fade d-block" tabIndex={-1}>
                        <div className="modal-dialog modal-xl">
                          <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-light">
                              <h5 className="modal-title fw-semibold">
                                Dokumen Penawaran
                              </h5>
                              <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowModal(false)}
                              />
                            </div>
                            <div className="modal-body p-0">
                              <div
                                style={{
                                  width: "100%",
                                  height: "80vh",
                                  background: "#f8f9fa",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  overflow: "auto"
                                }}
                              >
                                {modalFile.toLowerCase().endsWith(".pdf") ? (
                                  <iframe
                                    src={`${getFileUrl(modalFile)}#toolbar=1&navpanes=0&scrollbar=1`}
                                    width="100%"
                                    height="100%"
                                    style={{
                                      border: "none",
                                      borderRadius: "0 0 12px 12px"
                                    }}
                                  />
                                ) : (
                                  <img
                                    src={getFileUrl(modalFile)}
                                    alt="Dokumen Penawaran"
                                    style={{
                                      maxWidth: "100%",
                                      maxHeight: "100%",
                                      objectFit: "contain",
                                      padding: "1rem"
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="d-flex justify-content-end gap-2">
                      {/* <Button
                        size="sm"
                        title="Quot."
                      >
                        <FileText size={16}/>
                      </Button>
                      <Button
                        size="sm"
                        title="Invoice"
                      >
                        <DollarSign size={16}/>
                      </Button>
                      <Button
                        size="sm"
                        title="Kwitansi"
                      >
                        <Clipboard size={16}/>
                      </Button> */}

                      {/* DRAFT */}
                      {r.status_order === FeedbackItemStatusOrder.DRAFT && (
                        <>
                        <Button
                          size="sm"
                          variant="warning"
                          className="d-inline-flex align-items-center gap-1 text-white"
                          onClick={() => onEdit(r)}
                        >
                          <Edit size={16}/>
                          <div>Edit</div>
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          className="d-inline-flex align-items-center gap-1"
                          onClick={() => onDelete(r)}
                        >
                          <Trash size={16}/>
                          <div>Hapus</div>
                        </Button>
                        <Button
                            size="sm"
                            variant="success"
                            className="d-inline-flex align-items-center gap-1 text-white"
                            style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
                            onClick={() => ajukanPermohonan(r.id, getFeedbacks)}
                          >
                            <Send size={16}/>
                            <div>Ajukan</div>
                          </Button>
                        </>
                      )}
                      {r.status_order === FeedbackItemStatusOrder.REVISI && (
                        <>
                          <Button
                            size="sm"
                            variant="warning"
                            className="d-inline-flex align-items-center gap-1 text-white"
                            onClick={() => onEdit(r)}
                          >
                            <Edit size={16}/>
                            <div>Edit</div>
                          </Button>
                          <Button
                          size="sm"
                           variant="success"
                            className="d-inline-flex align-items-center gap-1 text-white"
                            style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
                            onClick={() => onReapply(r)}
                          >
                            <Send size={16}/>
                            <div>Ajukan Ulang</div>
                          </Button>
                     
                        </>
                      )}

                      {!r.is_given_feedback && r.status_order === FeedbackItemStatusOrder.DONE && (
                        <Button
                          size="sm"
                          className="d-inline-flex align-items-center gap-1"
                          onClick={() => navigate(`/feedbacks/${r.id}`)}
                        >
                          <Edit size={16}/>
                          <div>Feedback</div>
                        </Button>
                      )}
                      {r.file_attachment.length > 0 && (
                        <Dropdown>
                          <Dropdown.Toggle
                            size="sm"
                            className="d-inline-flex align-items-center gap-1"
                          >
                            <Award size={16}/>
                            <div>Sertifikat</div>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {r.file_attachment.map((f, i) => (
                              <Dropdown.Item
                                key={i}
                                onClick={() => onDownloadCertificate(f)}
                                className="d-inline-flex align-items-center gap-2"
                              >
                                <Download size={16}/>
                                {f.nama}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                  </div>
                ))}
                {(total > 0 && page < totalPages) && (
                  <div className='w-100 d-flex justify-content-center'>
                    <Button
                      type="button"
                      variant="primary"
                      className="d-inline-flex align-items-center gap-2"
                      disabled={loadingHistory}
                      onClick={() => setPage(c => c + 1)}
                    >
                      {loadingHistory && <Spinner size="sm"/>}
                      <div>Load More</div>
                    </Button>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default memo(DashboardPage)
