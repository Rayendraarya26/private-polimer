import clsx from "clsx"
import React, { memo, useEffect, useMemo, useState } from "react"
import { Badge, Button, Card, Carousel, Col, Form, ProgressBar, Row, Spinner } from "react-bootstrap"
import { Award, FilePlus, HelpCircle } from "react-feather"
import styled from "styled-components"
import { FeedbackItemStatusOrder } from "../../types/feedbacks"
import { getDateDisplay } from "../../utils/date"
import useDashboard from "../../hooks/useDashboard"

const images = [
  'https://t4.ftcdn.net/jpg/04/95/28/65/360_F_495286577_rpsT2Shmr6g81hOhGXALhxWOfx1vOQBa.jpg',
  'https://t3.ftcdn.net/jpg/07/78/74/72/360_F_778747218_NplmwtoqLpjZvfklKFwlL0ruknNGKrPN.jpg'
]

const StyledBannerImage = styled.img`
  width: 100%;
  aspect-ratio: 4/1;
  object-fit: cover;
  object-position: center;
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
  const {
    loading,
    statisticData,
    getStatisticData
  } = useDashboard()

  const [selectedHistoryStatus, setSelectedHistoryStatus] = useState<FeedbackItemStatusOrder | undefined>(undefined)
  const [selectedStatisticYear, setSelectedStatisticYear] = useState<number>(currentYear)

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

  const services = useMemo(() => ([
    { name: 'Service 1' },
    { name: 'Service 2' },
    { name: 'Service 3' },
    { name: 'Service 4' },
    { name: 'Service 5' },
    { name: 'Service 6' },
    { name: 'Service 7' },
    { name: 'Service 8' },
    { name: 'Service 9' },
    { name: 'Service 10' },
    { name: 'Service 11' },
    { name: 'Service 12'  }
  ]), [])

  return (
    <div className="w-100 d-flex flex-column align-items-stretch gap-4">
      <div className="w-100">
        <Carousel className="rounded-3 overflow-hidden">
          {images.map(url => (
            <Carousel.Item key={url}>
              <StyledBannerImage
                src={url}
                draggable="false"
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      <Row>
        <Col xs={12} lg={7} className="px-3 py-2">
          <Card>
            <Card.Header className="py-3">
              <div className="w-100 d-flex justify-content-between align-items-center gap-2">
                <h6 className="mb-0">Layanan Jasa</h6>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="w-100 row m-0">
                {services.map((r, i) => (
                  <div
                    key={i}
                    className="col-6 col-md-4 col-lg-3 p-1"
                  >
                    <div className="border rounded-3 p-2 bg-primary text-white">
                      <div className="w-100 d-flex justify-content-center py-2">
                        <FilePlus size={64}/>
                      </div>
                      <div 
                        className="fw-semibold text-center"
                        style={{ fontSize: '0.85rem' }}
                      >
                        {r.name}
                      </div>
                    </div>
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
            <Card.Header className="pt-2">
              <div className="w-100 d-flex justify-content-between align-items-center gap-2">
                <h6 className="mb-0">Riwayat Permohonan Layanan</h6>
                <Form.Select 
                  style={{ width: '12rem' }}
                  value={selectedHistoryStatus}
                  onChange={e => setSelectedHistoryStatus(e.target.value as FeedbackItemStatusOrder | undefined)}
                >
                  {historyStatusOptions.map((r, i) => <option key={i} value={r.value}>{r.label}</option>)}
                </Form.Select>
              </div>
            </Card.Header>
            <Card.Body className="w-100">
              <div className="w-100 d-flex flex-column gap-2">
                {[1,2,3,4,5,6,7,8,9,10].map(v => (
                  <div 
                    key={v}
                    className="w-100 border rounded-3 p-3 bg-light"
                  >
                    <h6 className="fw-semibold">Nama Layanan</h6>
                    <div className="d-inline-flex align-items-center gap-3 mb-2">
                      <div 
                        style={{ fontSize: '0.75rem' }}
                        className="fw-semibold"
                      >
                        ID: XXX-XXX-XXX
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem' }}>Status:</span> <Badge className="fw-semibold" bg="success">Selesai</Badge>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem' }}>
                      Tanggal Order: {getDateDisplay('2024-9-8')}
                    </div>
                    <div className="py-3">
                      <ProgressBar variant="success" now={70} label={`${70}%`} />
                    </div>
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
                      <Button 
                        size="sm"
                        title="Kuesioner"
                      >
                        <HelpCircle size={16}/>
                      </Button>
                      <Button 
                        size="sm"
                        title="Sertifikat"
                      >
                        <Award size={16}/>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default memo(DashboardPage)