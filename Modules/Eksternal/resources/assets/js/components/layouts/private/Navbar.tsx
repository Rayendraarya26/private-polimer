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
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
`

// const LogoImage = styled.img`
//   width: 2rem;
//   object-fit: cover;
//   object-position: center;
// `

const NavBar: React.FC = () => {
  const isShowSidebar = useSelector(({ common }: RootState) => common.isShowSidebar)
  const dispatch = useDispatch()

  return (
    <StyledNavbar expand="lg" className="bg-body-tertiary position-sticky top-0 py-0">
      <div className="w-100 px-3 px-md-4 py-2 d-flex align-items-center justify-content-between">
        <Navbar.Brand>
          <Menu 
            style={{ cursor: 'pointer' }}
            onClick={() => dispatch(setShowSidebar(!isShowSidebar))}
          />
        </Navbar.Brand>
        <Navbar>
          <Nav className="ms-auto" style={{ gap: '1.25rem' }}>
            <Nav.Link href="#home" className="d-none d-md-block">Panduan</Nav.Link>
            <Nav.Link href="#link" className="d-none d-md-block">FAQ</Nav.Link>
            <Nav.Link href="#about" className="d-none d-md-block">About</Nav.Link>
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