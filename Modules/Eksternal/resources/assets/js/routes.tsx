import React, { lazy, memo } from "react"
import { Routes, Route, Navigate } from "react-router-dom"

// layouts
import PrivateLayout from './layouts/PrivateLayout'

// pages
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'))
const PaymentHistoryPage = lazy(() => import('./pages/payment-history/PaymentHistoryPage'))
const FeedbacksPage = lazy(() => import('./pages/feedbacks/FeedbacksPage'))
const FeedbackDetailPage = lazy(() => import('./pages/feedbacks/FeedbackDetailPage'))
const AskQuestionsPage = lazy(() => import('./pages/ask-questions/AskQuestionsPage'))
const ChangeAccountAndPasswordPage = lazy(() => import('./pages/profile/ChangeAccountAndPasswordPage'))
const UpdateProfilePage = lazy(() => import('./pages/profile/UpdateProfilePage'))
const NotificationsPage = lazy(() => import('./pages/notifications/NotificationsPage'))
const PermohonanPage = lazy(() => import('./pages/service-requests/PermohonanPage'))
const PembayaranPage = lazy(() => import('./pages/service-requests/PembayaranPage'))
const PelatihanPage = lazy(() => import('./pages/service-requests/PelatihanPage'))
const EditFormRouter = lazy(() => import('./components/input-service-requests/EditFormRouter'))
const SertifikasiProfesiPage = lazy(() => import('./pages/service-requests/LSPPage'))

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<PrivateLayout/>}>
        <Route path='/dashboard' element={<DashboardPage/>}/>
        <Route path='/notifications' element={<NotificationsPage/>}/>
        
        {/* Pembayaran & Tagihan */}
        <Route path='/pembayaran' element={<PembayaranPage/>}/>
        <Route path='/payment-history' element={<PembayaranPage/>}/>
        <Route path='/payments/history' element={<PembayaranPage/>}/>

        {/* Survey & Feedback */}
        <Route path='/feedbacks'>
          <Route index element={<FeedbacksPage/>}/>
          <Route path=':uuid' element={<FeedbackDetailPage/>}/>
        </Route>

        {/* Permohonan Layanan */}
        <Route path="/permohonan">
          <Route index element={<PermohonanPage/>}/>
          <Route path="pelatihan" element={<PelatihanPage/>}/>
          <Route path="sertifikasi-profesi" element={<SertifikasiProfesiPage/>}/>
          <Route path="edit/:id" element={<EditFormRouter/>}/>
        </Route>
        <Route path="/service-requests">
          <Route index element={<PermohonanPage/>}/>
          <Route path="input" element={<PermohonanPage/>}/>
          <Route path="pelatihan" element={<PelatihanPage/>}/>
          <Route path="sertifikasi-profesi" element={<SertifikasiProfesiPage/>}/>
          <Route path=":id" element={<DashboardPage/>}/>
        </Route>

        {/* Tanya Jawab */}
        <Route path='/ask-questions' element={<AskQuestionsPage/>}/>

        {/* Profil & Keamanan */}
        <Route path='/profile'>
          <Route index element={<UpdateProfilePage/>}/>
          <Route path="update" element={<UpdateProfilePage/>}/>
          <Route path="change-account-and-password" element={<ChangeAccountAndPasswordPage/>}/>
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