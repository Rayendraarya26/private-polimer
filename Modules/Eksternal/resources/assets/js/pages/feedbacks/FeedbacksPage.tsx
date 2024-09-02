import { format } from "date-fns"
import { id } from "date-fns/locale/id"
import React, { memo, useEffect } from "react"
import { Badge, Button, Card, Form, InputGroup, Spinner } from "react-bootstrap"
import { Calendar, Search } from "react-feather"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import useFeedbacks from "../../hooks/feedback/useFeedbacks"
import { FeedbackItemStatusOrder } from "../../types/feedbacks"

const StyledInputGroupSearch = styled(InputGroup)`
  width: 100%;
  @media screen and (min-width: 768px) {
    width: 26rem;  
  }
`

const ScroallbleList = styled.div`
  height: calc(100dvh - 15rem);
  overflow-y: auto;
`

const FeedbackItem = styled.div`
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;

  &:hover {
    background-color: #dddddd !important;
    cursor: pointer;
  }
`

const FeedbacksPage: React.FC = () => {
  const navigate = useNavigate()

  const { 
    loading,
    data,
    page,
    total,
    totalPages,
    getFeedbacks,
    changeSearch,
    setPage,
    search: query,
    debouncedSearch
  } = useFeedbacks({ useLoadMore: true })

  useEffect(() => {
    getFeedbacks()
  }, [debouncedSearch, page])

  return (
    <div className="w-100">
      <Card>
        <Card.Header className="bg-transparent">
          <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 py-2">
            <Card.Title className="pt-2">Permintaan Feedback</Card.Title>
            <StyledInputGroupSearch>
              <Form.Control
                placeholder="Cari feedback"
                aria-describedby="search-feedback"
                value={query}
                onChange={e => changeSearch(e.target.value)}
              />
              <InputGroup.Text id="search-feedback">
                <Search/>
              </InputGroup.Text>
            </StyledInputGroupSearch>
          </div>
        </Card.Header>
        <Card.Body>
          <ScroallbleList className="w-100 d-flex flex-column gap-3 position-relative">
            {data.map(r => (
              <FeedbackItem 
                key={r.id}
                id={`feedback-${r.id}`}
                onClick={() => navigate(`/feedbacks/${r.id}`)}
                className="w-100 border rounded p-3 bg-light"
              >
                <div className="w-100 d-flex justify-content-between align-items-start gap-3">
                  <div className="mb-2 fw-semibold">
                    Kode: {r.kode_order || '-'}
                  </div>
                  {r.status_order === FeedbackItemStatusOrder.PERMOHONAN && <Badge bg="secondary">Permohonan</Badge>}
                  {r.status_order === FeedbackItemStatusOrder.PEMBAYARAN && <Badge bg="info">Pembayaran</Badge>}
                  {r.status_order === FeedbackItemStatusOrder.PROCESS && <Badge bg="warning">Dalam proses</Badge>}
                  {r.status_order === FeedbackItemStatusOrder.IN_REVIEW && <Badge bg="primary">Dalam Review</Badge>}
                  {r.status_order === FeedbackItemStatusOrder.DONE && <Badge bg="success">Selesai</Badge>}
                </div>
                <div 
                  style={{ fontSize: '0.85rem' }}
                  className="mb-2 fw-light"
                >
                  Layanan: {r.layanan || '-'}
                </div>
                <div 
                  style={{ fontSize: '0.75rem' }}
                  className="d-inline-flex align-items-center gap-5 pt-3 mb-2"
                >
                  <div className="d-inline-flex align-items-center gap-2">
                    <Calendar size={12}/>
                    <div>
                      {format(new Date(r.created_at), 'dd MMMM yyyy, HH:mm', { locale: id })}
                    </div>
                  </div>
                </div>
                {!r.is_given_feedback && (
                  <div className="w-100 d-flex justify-content-end">
                    <Button 
                      size="sm"
                      type="button"
                      variant="outline-primary"
                      onClick={e => {
                        e.stopPropagation()
                      }}
                    >
                      Beri Penilaian & Feedback
                    </Button>
                  </div>
                )}
              </FeedbackItem>
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
          </ScroallbleList>
        </Card.Body>
      </Card>
    </div>
  )
}

export default memo(FeedbacksPage)