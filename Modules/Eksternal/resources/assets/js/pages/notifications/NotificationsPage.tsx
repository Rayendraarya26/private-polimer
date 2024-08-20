import { memo, useEffect } from "react"
import useNotifications from "../../hooks/useNotifications"
import { Button, Card, CardBody, Spinner } from "react-bootstrap"
import styled from "styled-components"
import clsx from "clsx"
import { Clock } from "react-feather"
import { getDateDisplay } from "../../utils/date"

const NotificationCard = styled(Card)`
  text-decoration: none;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  &:hover {
    cursor: pointer;
    background-color: #dedcdc !important;
  }
  &.unread {
    background-color: #fff0d5;
    .title {
      font-weight: 600;
    }
    p.content {
      font-weight: 500;
    }
  }
`

const NotificationsPage: React.FC = () => {
  const {
    loading,
    page,
    total,
    totalPages,
    data,
    setPage,
    getNotifications,
    markAllAsRead,
  } = useNotifications({ useLoadMore: true })

  useEffect(() => {
    getNotifications()
  }, [page])

  return (
    <div className="w-100 d-flex flex-column gap-4">
      <div className="w-100 d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-2">
        <div>
          <div className="fs-3 fw-semibold">Notifikasi</div>
          <div style={{ fontSize: '0.85rem' }}>Menampilkan {data.length} dari {total} notifikasi</div>
        </div>
        <div 
          onClick={markAllAsRead}
          style={{ cursor: 'pointer', fontSize: '0.85rem' }}
          className="text-primary"
        >
          Tandai semua terbaca
        </div>
      </div>
      <div className="w-100 d-flex flex-column gap-3">
        {(data.length < 1 && loading) && (
          <div className='w-100 py-5 d-flex'>
            <Spinner
              className="m-auto" 
              animation="border"
              variant="primary"
            />
          </div>
        )}
        {data.map(r => (
          <a key={r.created_at} href={r.link} className="text-decoration-none">
            <NotificationCard className={clsx(r.is_read === 'no' && 'unread')}>
              <CardBody>
                <div className="fs-4 mb-3 title">{r.title}</div>
                <p className="fs-6 mb-3 content">{r.content}</p>
                <p className="w-100 mb-0 d-flex align-items-center justify-content-end gap-1">
                  <Clock size={16}/><div>{getDateDisplay(r.created_at, true)}</div>
                </p>
              </CardBody>
            </NotificationCard>
          </a>
        ))}
        {(total > 0 && page < totalPages) && (
          <div className='w-100 d-flex justify-content-center'>
            <Button 
              type="button"
              variant="primary"
              className="d-inline-flex align-items-center gap-2"
              disabled={loading}
              onClick={() => setPage(c => c + 1)}
            >
              {loading && <Spinner size="sm"/>}
              <div>Load More</div>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(NotificationsPage)