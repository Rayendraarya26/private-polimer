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
const DetailPermohonanPage = lazy(() => import('./pages/service-requests/DetailPermohonanPage'))
const SertifikasiPage = lazy(() => import('./pages/service-requests/SertifikasiPage'))
const KalibrasiPage = lazy(() => import('./pages/service-requests/KalibrasiPage'))
const GrkPage = lazy(() => import('./pages/service-requests/GrkPage'))
const ProfisiensiPage = lazy(() => import('./pages/service-requests/ProfisiensiPage'))
const PengujianPage = lazy(() => import('./pages/service-requests/PengujianPage'))
const GrkVerifikasiPage = lazy(() => import('./pages/service-requests/grk/GrkVerifikasiPage'))
const GrkValidasiPage = lazy(() => import('./pages/service-requests/grk/GrkValidasiPage'))
const InspeksiPage = lazy(() => import('./pages/service-requests/InspeksiPage'))
const HalalPage = lazy(() => import('./pages/service-requests/HalalPage'))

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<PrivateLayout />}>
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/notifications' element={<NotificationsPage />} />

        {/* Pembayaran & Tagihan */}
        <Route path='/pembayaran' element={<PembayaranPage />} />
        <Route path='/payment-history' element={<PembayaranPage />} />
        <Route path='/payments/history' element={<PembayaranPage />} />

        {/* Survey & Feedback */}
        <Route path='/feedbacks'>
          <Route index element={<FeedbacksPage />} />
          <Route path=':uuid' element={<FeedbackDetailPage />} />
        </Route>

        {/* Permohonan Layanan */}
        <Route path="/permohonan">
          <Route index element={<PermohonanPage />} />
          <Route path="pelatihan" element={<PelatihanPage />} />
          <Route path="sertifikasi" element={<SertifikasiPage />} />
          <Route path="kalibrasi" element={<KalibrasiPage />} />
          <Route path="inspeksi" element={<InspeksiPage />} />
          <Route path="halal" element={<HalalPage />} />
          <Route path="profisiensi" element={<ProfisiensiPage />} />
          <Route path="pengujian" element={<PengujianPage />} />
          <Route path="sertifikasi-industri" element={<SertifikasiPage />} />
          <Route path="sertifikasi-profesi" element={<SertifikasiProfesiPage />} />
          <Route path="detail/:id" element={<DetailPermohonanPage />} />
          <Route path="edit/:id" element={<EditFormRouter />} />
          <Route path="grk">
            <Route index element={<GrkPage />} />
            <Route path="verifikasi" element={<GrkVerifikasiPage />} />
            <Route path="validasi" element={<GrkValidasiPage />} />
          </Route>
        </Route>
        <Route path="/service-requests">
          <Route index element={<PermohonanPage />} />
          <Route path="input" element={<PermohonanPage />} />
          <Route path="pelatihan" element={<PelatihanPage />} />
          <Route path="sertifikasi" element={<SertifikasiPage />} />
          <Route path="sertifikasi-industri" element={<SertifikasiPage />} />
          <Route path="sertifikasi-profesi" element={<SertifikasiProfesiPage />} />
          <Route path="kalibrasi" element={<KalibrasiPage />} />
          <Route path="inspeksi" element={<InspeksiPage />} />
          <Route path="halal" element={<HalalPage />} />
          <Route path=":id" element={<DetailPermohonanPage />} />
        </Route>

        {/* Tanya Jawab */}
        <Route path='/ask-questions' element={<AskQuestionsPage />} />

        {/* Profil & Keamanan */}
        <Route path='/profile'>
          <Route index element={<UpdateProfilePage />} />
          <Route path="update" element={<UpdateProfilePage />} />
          <Route path="change-account-and-password" element={<ChangeAccountAndPasswordPage />} />
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