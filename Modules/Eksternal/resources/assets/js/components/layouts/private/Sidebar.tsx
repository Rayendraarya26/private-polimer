import clsx from "clsx"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { Edit, Home, Icon, Send, FileText, CreditCard} from "react-feather"
import { useSelector } from "react-redux"
import { Link, useLocation } from "react-router-dom"
import styled from "styled-components"
import { RootState } from "../../../store"
import { useDispatch } from "react-redux"
import { TAB_SIZE } from "../../../constants/common"
import { setShowSidebar } from "../../../store/common"

const SidebarContainer = styled.div`
  min-height: 100dvh;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding-top: 2.5rem;

  @media screen and (min-width: 768px) {
    padding-top: 0;
  }
`

const LogoImage = styled.img`
  height: 3rem;
  object-fit: cover;
  object-position: center;
`

const MenuItem = styled(Link)`
  display: block;
  text-decoration: none;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
  border-radius: 1.25rem 0 0 1.25rem;
  padding: 0.85rem 1.25rem;
  &.active {
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  }
  &:not(.active):hover {
    background-color: #dedcdc !important;
  }

  .menu-item-title {
    white-space: nowrap;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
  }
`

const Sidebar: React.FC = () => {
  const { pathname } = useLocation()
  const { isShowSidebar, windowWidth } = useSelector(({ common }: RootState) => common)
  const dispatch = useDispatch()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const toggleMenu = (href: string) => {
  setOpenMenu(prev => prev === href ? null : href)
}

  useEffect(() => {
    dispatch(setShowSidebar(windowWidth >= TAB_SIZE))
  }, [windowWidth])

  const menus = useMemo<Array<{
    href: string
    name: string
    is_active: boolean
    icon: Icon
    children?: { href: string; name: string; icon: Icon }[]
  }>>(() => {
    return [
      {
        href: '/dashboard',
        name: 'Dashboard Layanan',
        is_active: pathname.startsWith('/dashboard'),
        icon: Home
      },
      // {
      //   href: '/payment-history',
      //   name: 'Riwayat Pembayaran',
      //   is_active: pathname.startsWith('/payment-history'),
      //   icon: Clock
      // },
      {
        href: '/service-requests',
        name: 'Permohonan Layanan',
        is_active: pathname.startsWith('/service-requests'),
        icon: FileText,
        children:[
          { href: '/permohonan', name:'Permohonan', icon: FileText},
          { href: '/pembayaran', name:'Pembayaran', icon: CreditCard},
        ]
      },
      {
        href: '/feedbacks',
        name: 'Survey Kepuasan',
        is_active: pathname.startsWith('/feedbacks'),
        icon: Edit
      },
      {
        href: '/ask-questions',
        name: 'Ajukan Pertanyaan',
        is_active: pathname.startsWith('/ask-questions'),
        icon: Send
      },
    ]
  }, [pathname])
 
  const onMenuItemClick = useCallback(() => {
    if (windowWidth < TAB_SIZE) dispatch(setShowSidebar(false))
  }, [windowWidth])

  return (
    <SidebarContainer className="bg-light">
      <div className="w-100 px-4 py-4 d-flex justify-content-center">
        <LogoImage
          draggable='false'
          className="d-none d-md-block"
          src={`/assets/media/logos/logo-${isShowSidebar ? 'polimer' : 'only'}.png`}
        />
      </div>
<div className="w-100 ps-2 ps-md-4">


  {menus.map(menu => (
    <div key={menu.href}>


      {/* MENU INDUK */}
      <MenuItem
        to={menu.href}
        onClick={(e) => {
          if (menu.children) {
            e.preventDefault()
            toggleMenu(menu.href)
          } else {
            onMenuItemClick()
          }
        }}
        className={clsx(
          "w-100 fw-medium d-inline-flex align-items-center justify-content-between gap-3",
          menu.is_active ? 'active bg-primary text-white' : 'bg-transparent text-dark'
        )}
      >
        <div className="d-flex align-items-center gap-3">
          <menu.icon style={{ minWidth: '1.5rem', minHeight: '1.5rem' }} />
          <div className="menu-item-title">{menu.name}</div>
        </div>


        {/* Panah */}
        {menu.children && (
          <span
            style={{
              display: "inline-block",
              transition: "transform 0.3s",
              transform: openMenu === menu.href ? "rotate(90deg)" : "rotate(0deg)"
            }}
          >
            ▶
          </span>
        )}
      </MenuItem>


      {/* SUBMENU */}
      {menu.children && (
        <div
          style={{
            maxHeight: openMenu === menu.href ? "500px" : "0px",
            overflow: "hidden",
            transition: "max-height 0.3s ease"
          }}
        >
          {menu.children.map(child => (
            <MenuItem
              key={child.href}
              to={child.href}
              onClick={onMenuItemClick}
              className={clsx(
                "w-100 d-inline-flex align-items-center gap-3",
                pathname.startsWith(child.href)
                  ? "active bg-primary text-white"
                  : "bg-transparent text-dark"
              )}
              style={{
                paddingLeft: "3.5rem",
                fontSize: "0.9rem",
                borderRadius: "1rem 0 0 1rem"
              }}
            >
              {/* ICON SUBMENU */}
              <child.icon size={16} style={{ opacity: 0.7 }} />
              <div className="menu-item-title">{child.name}</div>
            </MenuItem>
          ))}
        </div>
      )}


    </div>
  ))}


</div>
    </SidebarContainer>
  )
}

export default memo(Sidebar)