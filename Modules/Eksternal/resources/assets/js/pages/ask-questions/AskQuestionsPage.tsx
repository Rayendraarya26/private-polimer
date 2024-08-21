import { format } from "date-fns"
import { id } from "date-fns/locale/id"
import React, { memo, useCallback, useEffect } from "react"
import { Button, Card, Form, InputGroup, Spinner, Table } from "react-bootstrap"
import { Calendar, MessageCircle, Search } from "react-feather"
import styled from "styled-components"
import NewQuestoin from "../../components/ask-questions/NewQuestoin"
import QuestionDetail from "../../components/ask-questions/QuestionDetail"
import { useLocation, useNavigate } from "react-router-dom"
import useQuestions from "../../hooks/ask-questions/useQuestions"

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

const QuestionItem = styled.div`
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;

  &:hover {
    background-color: #dddddd !important;
    cursor: pointer;
  }
`

const AskQuestionsPage: React.FC = () => {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const detailId = new URLSearchParams(search).get('id')

  const { loading, data, page, total, totalPages, getQuestions, changeSearch, setPage, search: query, debouncedSearch } = useQuestions({ useLoadMore: true })

  useEffect(() => {
    getQuestions()
  }, [debouncedSearch, page])

  return (
    <div className="w-100">
      <Card>
        <Card.Header className="bg-transparent">
          <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 py-2">
            <Card.Title className="pt-2">Ajukan Pertanyaan</Card.Title>
            <StyledInputGroupSearch>
              <Form.Control
                placeholder="Cari pertanyaan"
                aria-describedby="search-pertanyaan"
                value={query}
                onChange={e => changeSearch(e.target.value)}
              />
              <InputGroup.Text id="search-pertanyaan">
                <Search/>
              </InputGroup.Text>
            </StyledInputGroupSearch>
          </div>
        </Card.Header>
        <Card.Body>
          <ScroallbleList className="w-100 d-flex flex-column gap-3 position-relative">
            {data.map(r => (
              <QuestionItem 
                key={r.id}
                onClick={() => navigate(`${pathname}?id=${r.id}`)}
                className="w-100 border rounded p-3 bg-light"
              >
                <div 
                  style={{ fontSize: '0.85rem' }}
                  className="mb-2"
                >
                  Topik: {r.topik}
                </div>
                <div className="w-100 fw-semibold">
                  {r.pertanyaan}
                </div>
                <div 
                  style={{ fontSize: '0.75rem' }}
                  className="d-inline-flex align-items-center gap-5 pt-3"
                >
                  <div className="d-inline-flex align-items-center gap-2">
                    <Calendar size={12}/>
                    <div>
                      {format(new Date(r.created_at), 'dd MMMM yyyy, HH:mm', { locale: id })}
                    </div>
                  </div>
                  <div className="d-inline-flex align-items-center gap-2">
                    <MessageCircle size={12}/>
                    <div>{r.total_pesan}</div>
                  </div>
                </div>
              </QuestionItem>
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
            <NewQuestoin
              onAfterAdded={useCallback(() => {
                if (page === 1) {
                  getQuestions()
                } else {
                  setPage(1)
                }
              }, [page])}
            />
          </ScroallbleList>
        </Card.Body>
      </Card>
      <QuestionDetail
        show={!!detailId}
        id={detailId as string}
        onClose={() => navigate(-1)}
      />
    </div>
  )
}

export default memo(AskQuestionsPage)