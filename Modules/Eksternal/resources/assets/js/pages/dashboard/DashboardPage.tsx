import clsx from "clsx"
import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import { Badge, Button, Card, Carousel, Col, Dropdown, Form, ProgressBar, Row, Spinner } from "react-bootstrap"
import { Award, Download, Edit, Layers } from "react-feather"
import styled from "styled-components"
import { FeedbackItemStatusOrder, SertifikatItem } from "../../types/feedbacks"
import { getDateDisplay } from "../../utils/date"
import useDashboard from "../../hooks/useDashboard"
import useFeedbacks from "../../hooks/feedback/useFeedbacks"
import { useNavigate } from "react-router-dom"
import api from "../../utils/api"
import toast from "react-hot-toast"
import { getErrorMessage } from "../../utils/error"
import { getFilenameFromContentDisposition } from "../../utils/common"

const StyledBannerImage = styled.img`
  width: 100%;
  aspect-ratio: 4/1;
  object-fit: cover;
  object-position: center;
`

const StyledLayananCard = styled.div`
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  scale: 0.95;
  border-color: #cecece !important;

  &:hover {
    --bs-bg-opacity: 1;
    background-color: rgba(var(--bs-primary-rgb), var(--bs-bg-opacity)) !important;
    color: white;
    cursor: pointer;
    scale: 1;
  }
`

const StyledStatsCard = styled.div`
  padding: 0.25rem;
  @media screen and (min-width: 768px) {
    padding: 0.5rem;
  }
  .title {
    white-space: nowrap;
    font-size: 0.65rem;
    @media screen and (min-width: 768px) {
      font-size: 0.85rem;
    }
  }
  .total {
    font-size: 3rem;
    @media screen and (min-width: 768px) {
      font-size: 6rem;
    }
  }
`

const currentYear = (new Date()).getFullYear()

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    loading,
    loadingLayanan,
    statisticData,
    layanan,
    sliders,
    getStatisticData
  } = useDashboard()
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
      value: FeedbackItemStatusOrder.PERMOHONAN,
      label: 'Permohonan'
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
      value: FeedbackItemStatusOrder.IN_REVIEW,
      label: 'Dalam Review'
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
      colClassName: 'col-6',
      classNames: 'fw-semibold bg-primary text-white',
      title: 'Total Permohonan',
      total: statisticData?.total_all || 0,
    },
    {
      colClassName: 'col-6',
      classNames: 'fw-semibold bg-warning',
      title: 'Belum Dibayar',
      total: statisticData?.total_pembayaran || 0,
    },
    {
      colClassName: 'col-4',
      classNames: 'fw-semibold bg-success text-white',
      title: 'Selesai',
      total: statisticData?.total_selesai || 0,
    },
    {
      colClassName: 'col-4',
      classNames: 'fw-semibold bg-info',
      title: 'On Progress',
      total: statisticData?.total_proses || 0,
    },
    {
      colClassName: 'col-4',
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
      toast.error(getErrorMessage(error))
    } finally {
      toast.remove(toastId)
    }
  }, [])

  return (
    <div className="w-100 d-flex flex-column align-items-stretch gap-4">
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
        <Col xs={12} lg={7} className="px-3 py-2">
          <Card>
            <Card.Header className="py-3">
              <div className="w-100 d-flex justify-content-between align-items-center gap-2">
                <h6 className="mb-0">Layanan Jasa</h6>
              </div>
            </Card.Header>
            <Card.Body className="position-relative">
              {loadingLayanan && (
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
                {layanan.map((r, i) => (
                  <div
                    key={i}
                    className="col-6 col-md-4 col-lg-3 p-1 h-100"
                  >
                    <StyledLayananCard
                      className="border rounded-3 p-2 h-100"
                      onClick={() => window.open(r.url)}
                    >
                      <div className="w-100 d-flex justify-content-center py-2">
                        <Layers size={60}/>
                      </div>
                      <div
                        className="fw-semibold text-center"
                        style={{ fontSize: '0.75rem' }}
                      >
                        {r.nama_layanan}
                      </div>
                    </StyledLayananCard>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} lg={5} className="px-3 py-2">
          <Card>
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
                    <div className={clsx("w-100 border rounded-3 p-3", r.classNames)}>
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
                  <small style={{ fontSize: '0.75rem' }}>Menampilkan {data.length} dari {total}</small>
                </div>
                <Form.Select
                  style={{ width: '12rem' }}
                  value={status}
                  onChange={e => changeStatus((e.target.value || undefined) as FeedbackItemStatusOrder | undefined)}
                >
                  {historyStatusOptions.map((r, i) =>
                    <option
                      key={i}
                      value={r.value || ''}
                    >
                      {r.label}
                    </option>
                  )}
                </Form.Select>
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
                        {r.status_order === FeedbackItemStatusOrder.PERMOHONAN && <Badge bg="secondary">Permohonan</Badge>}
                        {r.status_order === FeedbackItemStatusOrder.PEMBAYARAN && <Badge bg="info">Pembayaran</Badge>}
                        {r.status_order === FeedbackItemStatusOrder.PROCESS && <Badge bg="warning">Dalam proses</Badge>}
                        {r.status_order === FeedbackItemStatusOrder.IN_REVIEW && <Badge bg="primary">Dalam Review</Badge>}
                        {r.status_order === FeedbackItemStatusOrder.DONE && <Badge bg="success">Selesai</Badge>}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem' }}>
                      Tanggal Order: {getDateDisplay(r.created_at)}
                    </div>
                    <div className="py-3">
                      {r.status_order === FeedbackItemStatusOrder.PERMOHONAN && <ProgressBar variant="secondary" now={r.persentase_order} label={`${r.persentase_order}%`} />}
                      {r.status_order === FeedbackItemStatusOrder.PEMBAYARAN && <ProgressBar variant="info" now={r.persentase_order} label={`${r.persentase_order}%`} />}
                      {r.status_order === FeedbackItemStatusOrder.PROCESS && <ProgressBar variant="warning" now={r.persentase_order} label={`${r.persentase_order}%`} />}
                      {r.status_order === FeedbackItemStatusOrder.IN_REVIEW && <ProgressBar variant="primary" now={r.persentase_order} label={`${r.persentase_order}%`} />}
                      {r.status_order === FeedbackItemStatusOrder.DONE && <ProgressBar variant="success" now={r.persentase_order} label={`${r.persentase_order}%`} />}
                    </div>
                    {r.status_order === FeedbackItemStatusOrder.DONE && r.file_attachment.length < 1 && (
                      <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                        Sertifikat belum tersedia. Jika dalam waktu 1 hari sertifikat belum muncul, silakan hubungi CS kami di nomor{' '}
                        <a href="https://wa.me/628112827821" target="_blank" rel="noopener noreferrer">
                          +628112827821
                        </a> untuk bantuan lebih lanjut.
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
