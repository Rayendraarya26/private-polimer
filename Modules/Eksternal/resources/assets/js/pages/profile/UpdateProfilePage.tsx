import { lazy, memo, Suspense } from "react"
import useProfile from "../../hooks/useProfile"
import { Card, Spinner } from "react-bootstrap"
import { ProfileClientType } from "../../types/profile"
import styled from "styled-components"

const FallbackContainer = styled.div`
  width: 100%;
  height: 85dvh;
  display: grid;
  place-items: center;
`

const FormInstansi = lazy(() => import("../../components/update-profile/FormInstansi"))
const FormPerusahaan = lazy(() => import("../../components/update-profile/FormPerusahaan"))
const FormPerorangan = lazy(() => import("../../components/update-profile/FormPerorangan"))

const UpdateProfilePage: React.FC = () => {
  const { cleintType } = useProfile()
  return (
    <div className="w-100">
      <Card>
        <Card.Header className="bg-transparent">
          <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 py-2">
            <Card.Title className="pt-2">Edit Profile</Card.Title>
          </div>
        </Card.Header>
        <Card.Body>
          <Suspense
            fallback={(
              <FallbackContainer>
                <Spinner 
                  animation="border"
                  variant="primary"
                />
              </FallbackContainer>
            )}
          >
            {cleintType === ProfileClientType.BADAN_USAHA && <FormPerusahaan/>}
            {cleintType === ProfileClientType.INSTANSI_PEMERINTAH && <FormInstansi/>}
            {cleintType === ProfileClientType.PERORANGAN && <FormPerorangan/>}
          </Suspense>
        </Card.Body>
      </Card>
    </div>
  )
}

export default memo(UpdateProfilePage)