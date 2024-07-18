import React, { lazy, memo } from "react"
import { Routes, Route } from "react-router-dom"

// layouts
const PrivateLayout = lazy(() => import('./layouts/PrivateLayout'))

// pages
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'))

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<PrivateLayout/>}>
        <Route path='/dashboard' element={<DashboardPage/>}/>
        <Route path='/payment-history' element={<DashboardPage/>}/>
      </Route>
    </Routes>
  )
}

export default memo(AppRoutes)