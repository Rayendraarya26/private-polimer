import { forwardRef, memo } from "react"
import { Dropdown } from "react-bootstrap"
import styled from "styled-components"

const AvatarImage = styled.img`
  width: 2.25rem;
  aspect-ratio: 1/1;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
`

const UserProfileToggle = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(({ onClick }, ref) => {
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
          src="https://placehold.co/400x400"
        />
        <div className="d-none d-md-block">
          <div className="fw-semibold">User Fullname</div>
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
          <Dropdown.Item>Edit Profile</Dropdown.Item>
          <Dropdown.Item>Ubah Kata Sandi</Dropdown.Item>
          <Dropdown.Divider/>
          <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}

export default memo(UserProfile)