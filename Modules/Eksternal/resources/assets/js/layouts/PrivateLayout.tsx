import React, { memo } from "react"
import { Outlet } from "react-router-dom"

const PrivateLayout: React.FC = () => {
  return (
    <div>
      [private layout]
      <Outlet/>
    </div>
  )
}

export default memo(PrivateLayout)