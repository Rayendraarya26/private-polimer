import { memo } from "react"
import { Helmet } from "react-helmet"

type Props = {
  title: string
}

const Head: React.FC<Props> = ({ title }) => {
  return (
    <Helmet>
      <title>Polimer :: {title}</title>
    </Helmet>
  )
}

export default memo(Head)