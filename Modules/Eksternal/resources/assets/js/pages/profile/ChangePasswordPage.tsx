import { memo, useCallback, useState } from "react"
import { Button, Card, Form, InputGroup } from "react-bootstrap"
import { Eye, EyeOff } from "react-feather"
import styled from "styled-components"
import useChangePassword from "../../hooks/profile/useChangePassword"
import Head from "../../components/common/Head"

const StyledForm = styled.form`
  width: 100%;
  max-width: 512px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const ChangePasswordPage: React.FC = () => {
  const { rhf, errors, submitting, onSavePassword } = useChangePassword()
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({
    old_password: false,
    new_password: false,
    new_password_confirmation: false,
  })

  const onShowPassword = useCallback((key: string) => {
    setShowPassword(current => ({
      ...current,
      [key]: !current[key]
    }))
  }, [])

  return (
    <div className="w-100">
      <Head title="Ubah Kata Sandi"/>
      <Card>
        <Card.Header className="bg-transparent">
          <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 py-2">
            <Card.Title className="pt-2">Ubah Kata Sandi</Card.Title>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="w-100 d-flex justify-content-center py-5">
            <StyledForm onSubmit={onSavePassword}>
              <div className="w-100 d-flex flex-column">
                <Form.Label htmlFor="old_password">
                  Kata Sandi Saat Ini
                </Form.Label>
                <InputGroup className="mb-1">
                  <Form.Control 
                    id="old_password"
                    type={showPassword.old_password ? 'text' : 'password'}
                    disabled={submitting}
                    {...rhf.register('old_password')}
                  />
                  <InputGroup.Text onClick={() => onShowPassword('old_password')}>
                    {showPassword.old_password ? <Eye/> : <EyeOff/>}
                  </InputGroup.Text>
                </InputGroup>
                <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                  {errors?.old_password?.message || ''}
                </div>
              </div>
              <div className="w-100 d-flex flex-column">
                <Form.Label htmlFor="new_password">
                  Kata Sandi Baru
                </Form.Label>
                <InputGroup className="mb-1">
                  <Form.Control 
                    id="new_password"
                    type={showPassword.new_password ? 'text' : 'password'}
                    disabled={submitting}
                    {...rhf.register('new_password')}
                  />
                  <InputGroup.Text onClick={() => onShowPassword('new_password')}>
                    {showPassword.new_password ? <Eye/> : <EyeOff/>}
                  </InputGroup.Text>
                </InputGroup>
                <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                  {errors?.new_password?.message || ''}
                </div>
              </div>
              <div className="w-100 d-flex flex-column">
                <Form.Label htmlFor="new_password_confirmation">
                  Konfirmasi Kata Sandi Baru
                </Form.Label>
                <InputGroup className="mb-1">
                  <Form.Control 
                    id="new_password_confirmation"
                    type={showPassword.new_password_confirmation ? 'text' : 'password'}
                    disabled={submitting}
                    {...rhf.register('new_password_confirmation')}
                  />
                  <InputGroup.Text onClick={() => onShowPassword('new_password_confirmation')}>
                    {showPassword.new_password_confirmation ? <Eye/> : <EyeOff/>}
                  </InputGroup.Text>
                </InputGroup>
                <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                  {errors?.new_password_confirmation?.message || ''}
                </div>
              </div>
              <Button
                type="submit"
                disabled={submitting}
                variant="primary"
                className="w-100 py-2"
              >
                Simpan
              </Button>
            </StyledForm>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default memo(ChangePasswordPage)