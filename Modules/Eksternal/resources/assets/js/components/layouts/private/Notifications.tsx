import { format } from "date-fns"
import { id } from "date-fns/locale/id"
import React, { forwardRef, memo } from "react"
import { Badge, Button, Dropdown } from "react-bootstrap"
import { Bell, Clock } from "react-feather"
import { Link } from "react-router-dom"
import styled from "styled-components"

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

const NotificationItem = styled(Link)`
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
  .title {
    font-size: 0.95rem;
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
      <NotificationBadge bg="danger">5</NotificationBadge>
      <Bell/>
    </div>
  )
})

const Notifications: React.FC = () => {
  const dummyNotifications: Array<{
    title: string
    description: string
    timestamp: string
    href: string
  }> = [
    {
      title: 'Lorem ipsum dolor sit amet',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum accusantium ipsum aperiam odit atque at repellendus nesciunt, molestias nemo, laboriosam odio quo similique tenetur provident dolores culpa est. Perferendis, vero?',
      timestamp: format(new Date().toISOString(), 'dd MMMM yyyy, HH:mm', { locale: id }),
      href: ''
    },
    {
      title: 'Lorem ipsum dolor sit amet',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum accusantium ipsum aperiam odit atque at repellendus nesciunt, molestias nemo, laboriosam odio quo similique tenetur provident dolores culpa est. Perferendis, vero?',
      timestamp: format(new Date().toISOString(), 'dd MMMM yyyy, HH:mm', { locale: id }),
      href: ''
    },
    {
      title: 'Lorem ipsum dolor sit amet',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum accusantium ipsum aperiam odit atque at repellendus nesciunt, molestias nemo, laboriosam odio quo similique tenetur provident dolores culpa est. Perferendis, vero?',
      timestamp: format(new Date().toISOString(), 'dd MMMM yyyy, HH:mm', { locale: id }),
      href: ''
    },
    {
      title: 'Lorem ipsum dolor sit amet',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum accusantium ipsum aperiam odit atque at repellendus nesciunt, molestias nemo, laboriosam odio quo similique tenetur provident dolores culpa est. Perferendis, vero?',
      timestamp: format(new Date().toISOString(), 'dd MMMM yyyy, HH:mm', { locale: id }),
      href: ''
    },
    {
      title: 'Lorem ipsum dolor sit amet',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum accusantium ipsum aperiam odit atque at repellendus nesciunt, molestias nemo, laboriosam odio quo similique tenetur provident dolores culpa est. Perferendis, vero?',
      timestamp: format(new Date().toISOString(), 'dd MMMM yyyy, HH:mm', { locale: id }),
      href: ''
    },
    {
      title: 'Lorem ipsum dolor sit amet',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum accusantium ipsum aperiam odit atque at repellendus nesciunt, molestias nemo, laboriosam odio quo similique tenetur provident dolores culpa est. Perferendis, vero?',
      timestamp: format(new Date().toISOString(), 'dd MMMM yyyy, HH:mm', { locale: id }),
      href: ''
    },
    {
      title: 'Lorem ipsum dolor sit amet',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum accusantium ipsum aperiam odit atque at repellendus nesciunt, molestias nemo, laboriosam odio quo similique tenetur provident dolores culpa est. Perferendis, vero?',
      timestamp: format(new Date().toISOString(), 'dd MMMM yyyy, HH:mm', { locale: id }),
      href: ''
    },
    {
      title: 'Lorem ipsum dolor sit amet',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum accusantium ipsum aperiam odit atque at repellendus nesciunt, molestias nemo, laboriosam odio quo similique tenetur provident dolores culpa est. Perferendis, vero?',
      timestamp: format(new Date().toISOString(), 'dd MMMM yyyy, HH:mm', { locale: id }),
      href: ''
    },
    {
      title: 'Lorem ipsum dolor sit amet',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum accusantium ipsum aperiam odit atque at repellendus nesciunt, molestias nemo, laboriosam odio quo similique tenetur provident dolores culpa est. Perferendis, vero?',
      timestamp: format(new Date().toISOString(), 'dd MMMM yyyy, HH:mm', { locale: id }),
      href: ''
    },
    {
      title: 'Lorem ipsum dolor sit amet',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum accusantium ipsum aperiam odit atque at repellendus nesciunt, molestias nemo, laboriosam odio quo similique tenetur provident dolores culpa est. Perferendis, vero?',
      timestamp: format(new Date().toISOString(), 'dd MMMM yyyy, HH:mm', { locale: id }),
      href: ''
    },
    {
      title: 'Lorem ipsum dolor sit amet',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum accusantium ipsum aperiam odit atque at repellendus nesciunt, molestias nemo, laboriosam odio quo similique tenetur provident dolores culpa est. Perferendis, vero?',
      timestamp: format(new Date().toISOString(), 'dd MMMM yyyy, HH:mm', { locale: id }),
      href: ''
    },
    {
      title: 'Lorem ipsum dolor sit amet',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum accusantium ipsum aperiam odit atque at repellendus nesciunt, molestias nemo, laboriosam odio quo similique tenetur provident dolores culpa est. Perferendis, vero?',
      timestamp: format(new Date().toISOString(), 'dd MMMM yyyy, HH:mm', { locale: id }),
      href: ''
    }
  ]

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
            {dummyNotifications.map((r, i) => (
              <NotificationItem to={r.href} key={i} className="w-100 d-flex flex-column gap-1">
                <div className="title fw-semibold">{r.title}</div>
                <p className="description mb-0">{r.description}</p>
                <p className="timestamp fw-light mb-0 d-inline-flex align-items-center justify-content-end gap-1">
                  <Clock size={12}/><div>{r.timestamp}</div>
                </p>
              </NotificationItem>
            ))}
          </NotificationContents>
          <NotificationFooter>
            <Button className="w-100 fw-6">Lihat Semua</Button>
          </NotificationFooter>
        </StyledDropdownMenu>
      </Dropdown>
    </>
  )
}

export default memo(Notifications)