import { memo } from "react"
import { Nav, Navbar } from "react-bootstrap"
import { Menu } from "react-feather"
import { useSelector } from "react-redux"
import styled from "styled-components"
import { RootState } from "../../../store"
import { useDispatch } from "react-redux"
import { setShowSidebar } from "../../../store/common"
import Notifications from './Notifications'
import UserProfile from "./UserProfile"

const StyledNavbar = styled(Navbar)`
  z-index: 10;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
`

const LogoImage = styled.img`
  height: 1.75rem;
  display: block;
  @media screen and (min-width: 768px) {
    display: none;
  }
`

const NavBar: React.FC = () => {
  const isShowSidebar = useSelector(({ common }: RootState) => common.isShowSidebar)
  const dispatch = useDispatch()

  return (
    <StyledNavbar expand="lg" className="bg-body-tertiary position-sticky top-0 py-0">
      <div className="w-100 px-3 px-md-4 py-2 d-flex align-items-center justify-content-between">
        <Navbar.Brand className="d-inline-flex align-items-center gap-3">
          <Menu
            style={{ cursor: 'pointer' }}
            onClick={() => dispatch(setShowSidebar(!isShowSidebar))}
          />
          <LogoImage
            alt=""
            draggable="false"
            src={"/assets/media/logos/logo-polimer.png"}
          />
        </Navbar.Brand>
        <Navbar>
          <Nav className="ms-auto" style={{ gap: '1.25rem' }}>
            <Nav.Link href="/" className="d-none d-md-block">JIS</Nav.Link>
            <Nav.Link href={window.location.origin + '/tte/verify'} className="d-none d-md-block">TTE</Nav.Link>
            <Nav.Link
              href={window.location.origin + '/faq'}
              className="d-none d-md-block"
            >
              FAQ
            </Nav.Link>
            <Nav.Item className="align-self-center">
              <Notifications/>
            </Nav.Item>
            <Nav.Item className="align-self-center">
              <UserProfile/>
            </Nav.Item>
          </Nav>
        </Navbar>
      </div>
    </StyledNavbar>
  )
}

export default memo(NavBar)
