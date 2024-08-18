import { forwardRef, memo } from "react"
import { Dropdown } from "react-bootstrap"
import styled from "styled-components"
import useProfile from "../../../hooks/useProfile"
import { getAvatar } from "../../../utils/avatar"
import { Link } from "react-router-dom"

const AvatarImage = styled.img`
  width: 2.25rem;
  aspect-ratio: 1/1;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
`

const UserProfileToggle = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(({ onClick }, ref) => {
  const { profile } = useProfile()
  return (
    <div 
      ref={ref}
      style={{ cursor: 'pointer' }}
      onClick={(e) => {
        e.preventDefault()
        onClick?.(e)
      }}
    >
      <div className="d-flex align-items-center gap-2">
        <AvatarImage 
          draggable='false'
          src={getAvatar(profile?.picture, profile?.name)}
          onError={e => {
            (e.target as HTMLImageElement).src = getAvatar(null, profile?.name)
          }}
        />
        <div className="d-none d-md-block">
          <div className="fw-semibold">
            {profile?.name}
          </div>
        </div>
      </div>
    </div>
  )
})

const UserProfile: React.FC = () => {
  const onLogout = () => {
    window.location.href = window.origin + '/auth/logout'
  }
  
  return (
    <>
      <Dropdown>
        <Dropdown.Toggle as={UserProfileToggle}/>
        <Dropdown.Menu align="end" className="mt-2">
          <Dropdown.Item
            as={Link}
            to='/profile/update'
          >
            Edit Profile
          </Dropdown.Item>
          <Dropdown.Item 
            as={Link}
            to='/profile/change-password'
          >
            Ubah Kata Sandi
          </Dropdown.Item>
          <Dropdown.Divider/>
          <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}

export default memo(UserProfile)