import React, { lazy, memo } from "react"
import { Routes, Route, Navigate } from "react-router-dom"

// layouts
import PrivateLayout from './layouts/PrivateLayout'

// pages
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'))
const PaymentHistoryPage = lazy(() => import('./pages/payment-history/PaymentHistoryPage'))
const SatisfactionSurveyPage = lazy(() => import('./pages/satisfaction-survey/SatisfactionSurveyPage'))
const ComplaintPage = lazy(() => import('./pages/complaint/ComplaintPage'))
const AskQuestionsPage = lazy(() => import('./pages/ask-questions/AskQuestionsPage'))
const ChangePasswordPage = lazy(() => import('./pages/profile/ChangePasswordPage'))
const UpdateProfilePage = lazy(() => import('./pages/profile/UpdateProfilePage'))

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<PrivateLayout/>}>
        <Route path='/dashboard'>
          <Route index element={<DashboardPage/>}/>
        </Route>
        <Route path='/payment-history'>
          <Route index element={<PaymentHistoryPage/>}/>
        </Route>
        <Route path='/satisfaction-survey'>
          <Route index element={<SatisfactionSurveyPage/>}/>
        </Route>
        <Route path='/complaint'>
          <Route index element={<ComplaintPage/>}/>
        </Route>
        <Route path='/ask-questions'>
          <Route index element={<AskQuestionsPage/>}/>
        </Route>
        <Route path='/profile'>
          <Route path="change-password" element={<ChangePasswordPage/>}/>
          <Route path="update" element={<UpdateProfilePage/>}/>
        </Route>
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Route>
    </Routes>
  )
}

export default memo(AppRoutes)