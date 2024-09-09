import React, { forwardRef, memo, useEffect } from "react"
import { Badge, Button, Dropdown } from "react-bootstrap"
import { Bell, Clock } from "react-feather"
import { Link } from "react-router-dom"
import styled from "styled-components"
import useNotifications from "../../../hooks/useNotifications"
import { getDateDisplay } from "../../../utils/date"
import clsx from "clsx"

const StyledDropdownMenu = styled(Dropdown.Menu)`
  width: 80dvw;
  @media screen and (min-width: 768px) {
    width: 26rem;
  }
`

const NotificationBadge = styled(Badge)`
  position: absolute;
  top: -12px;
  right: -12px;
  font-size: 0.75rem;
`

const NotificationHeader = styled.div`
  width: 100%;
  padding: 0.5rem 1rem;
`

const NotificationContents = styled.div`
  width: 100%;
  max-height: 50dvh;
  overflow-y: auto;
`

const NotificationItem = styled.a`
  text-decoration: none;
  color: black;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
  padding: 0.5rem 1rem;
  &:hover {
    cursor: pointer;
    background-color: #dedcdc !important;
  }
  &.unread {
    background-color: #fff0d5;
    .title {
      font-weight: 700;
    }
    p.description {
      font-weight: 600;
    }
  }
  .title {
    font-size: 0.95rem;
    font-weight: 500;
  }
  p.description {
    font-size: 0.75rem;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .timestamp {
    font-size: 0.75rem;
  }
`

const NotificationFooter = styled.div`
  width: 100%;
  padding: 0.5rem 1rem;
`

const NotificationIcon = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(({ onClick }, ref) => {
  const { unreadCount } = useNotifications()
  return (
    <div 
      ref={ref}
      style={{ cursor: 'pointer' }}
      className="position-relative"
      onClick={(e) => {
        e.preventDefault()
        onClick?.(e)
      }}
    >
      {unreadCount > 0 && (
        <NotificationBadge bg="danger">
          {unreadCount > 9 ? '9+' : unreadCount}
        </NotificationBadge>
      )}
      <Bell/>
    </div>
  )
})

const Notifications: React.FC = () => {
  const { data, getNotifications } = useNotifications()

  useEffect(() => {
    getNotifications()
  }, [])

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle as={NotificationIcon}/>
        <StyledDropdownMenu 
          align="end"
          className="mt-3"
        >
          <NotificationHeader className="fw-bold">
            Notifikasi
          </NotificationHeader>
          <NotificationContents>
            {data.map((r, i) => (
              <NotificationItem 
                key={i}
                href={r.link}
                className={clsx("w-100 d-flex flex-column gap-1", r.is_read === 'no' && 'unread')}
              >
                <div className="title">{r.title}</div>
                <p className="description mb-0">{r.content}</p>
                <p className="timestamp fw-light mb-0 d-inline-flex align-items-center justify-content-end gap-1">
                  <Clock size={12}/><div>{getDateDisplay(r.created_at, true)}</div>
                </p>
              </NotificationItem>
            ))}
          </NotificationContents>
          <NotificationFooter>
            <Dropdown.Item className="p-0">
              <Link to='/notifications'>
                <Button type="button" className="w-100 fw-6">Lihat Semua</Button>
              </Link>
            </Dropdown.Item>
          </NotificationFooter>
        </StyledDropdownMenu>
      </Dropdown>
    </>
  )
}

export default memo(Notifications)