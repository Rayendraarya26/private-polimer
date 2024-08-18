import { format } from "date-fns"
import { id } from "date-fns/locale/id"
import React, { memo } from "react"
import { Card, Form, InputGroup, Table } from "react-bootstrap"
import { Calendar, MessageCircle, Search } from "react-feather"
import styled from "styled-components"
import NewQuestoin from "../../components/ask-questions/NewQuestoin"
import QuestionDetail from "../../components/ask-questions/QuestionDetail"
import { useLocation, useNavigate } from "react-router-dom"

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
              />
              <InputGroup.Text id="search-pertanyaan">
                <Search/>
              </InputGroup.Text>
            </StyledInputGroupSearch>
          </div>
        </Card.Header>
        <Card.Body>
          <ScroallbleList className="w-100 d-flex flex-column gap-3 position-relative">
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <QuestionItem 
                key={n}
                onClick={() => navigate(`${pathname}?id=${n}`)}
                className="w-100 border rounded p-3 bg-light"
              >
                <div className="w-100 fw-medium">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi perferendis expedita unde optio voluptatibus aliquid ipsum porro dolore, libero, vero quasi iusto suscipit pariatur molestias reprehenderit velit voluptatem in. Doloribus?
                </div>
                <div className="d-inline-flex align-items-center gap-5 pt-3">
                  <div className="d-inline-flex align-items-center gap-2">
                    <Calendar/>
                    <div>
                      {format(new Date(), 'dd MMMM yyyy, HH:mm', { locale: id })}
                    </div>
                  </div>
                  <div className="d-inline-flex align-items-center gap-2">
                    <MessageCircle/>
                    <div>3</div>
                  </div>
                </div>
              </QuestionItem>
            ))}
            <NewQuestoin/>
          </ScroallbleList>
        </Card.Body>
      </Card>
      <QuestionDetail
        show={!!detailId}
        onClose={() => navigate(-1)}
      />
    </div>
  )
}

export default memo(AskQuestionsPage)