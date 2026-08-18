import React, { lazy, memo } from "react"
import { Routes, Route, Navigate } from "react-router-dom"

// layouts
import PrivateLayout from './layouts/PrivateLayout'
import AdminShell from './components/layouts/AdminShell'

// customer portal pages
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
const ExternalAppsPage = lazy(() => import('./pages/sso-hub/ExternalAppsPage'))

// admin portal pages (sprint 4)
const AdminDashboardPage = lazy(() => import('./pages/admin/dashboard/AdminDashboardPage'))
const AdminPermohonanListPage = lazy(() => import('./pages/admin/permohonan/AdminPermohonanListPage'))
const AdminPermohonanDetailPage = lazy(() => import('./pages/admin/permohonan/AdminPermohonanDetailPage'))
const AdminInvoiceManagementPage = lazy(() => import('./pages/admin/finance/AdminInvoiceManagementPage'))
const AdminPembayaranManagementPage = lazy(() => import('./pages/admin/finance/AdminPembayaranManagementPage'))
const AdminHasilUjiPage = lazy(() => import('./pages/admin/sertifikasi/AdminHasilUjiPage'))
const AdminPertanyaanPage = lazy(() => import('./pages/admin/helpdesk/AdminPertanyaanPage'))
const AdminMasterFaqPage = lazy(() => import('./pages/admin/helpdesk/AdminMasterFaqPage'))
const AdminContactUsPage = lazy(() => import('./pages/admin/helpdesk/AdminContactUsPage'))
const AdminMasterLayananPage = lazy(() => import('./pages/admin/master/AdminMasterLayananPage'))
const AdminMasterLokasiPage = lazy(() => import('./pages/admin/master/AdminMasterLokasiPage'))
const AdminBannerHomepagePage = lazy(() => import('./pages/admin/master/AdminBannerHomepagePage'))
const AdminIntegrasiSsoPage = lazy(() => import('./pages/admin/master/AdminIntegrasiSsoPage'))
const AdminManageUsersPage = lazy(() => import('./pages/admin/system/AdminManageUsersPage'))
const AdminManageGroupsPage = lazy(() => import('./pages/admin/system/AdminManageGroupsPage'))
const AdminManageMenuPage = lazy(() => import('./pages/admin/system/AdminManageMenuPage'))

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ========================================================
          ADMIN & INTERNAL BALAI PORTAL (6 PILAR MODUL)
          ======================================================== */}
      <Route path="/admin" element={<AdminShell />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />

        {/* Pilar 2: Permohonan & Verifikasi */}
        <Route path="permohonan" element={<AdminPermohonanListPage />} />
        <Route path="permohonan/detail/:id" element={<AdminPermohonanDetailPage />} />

        {/* Pilar 3: Keuangan & Hasil Uji TTE */}
        <Route path="finance/invoice" element={<AdminInvoiceManagementPage />} />
        <Route path="finance/pembayaran" element={<AdminPembayaranManagementPage />} />
        <Route path="sertifikasi/hasil-uji" element={<AdminHasilUjiPage />} />

        {/* Pilar 4: Helpdesk & Komunikasi */}
        <Route path="helpdesk/pertanyaan" element={<AdminPertanyaanPage />} />
        <Route path="helpdesk/faq" element={<AdminMasterFaqPage />} />
        <Route path="helpdesk/contact-us" element={<AdminContactUsPage />} />

        {/* Pilar 5: Master Data & Integrasi SSO */}
        <Route path="master/layanan" element={<AdminMasterLayananPage />} />
        <Route path="master/lokasi" element={<AdminMasterLokasiPage />} />
        <Route path="master/banner" element={<AdminBannerHomepagePage />} />
        <Route path="master/integrasi-sso" element={<AdminIntegrasiSsoPage />} />
        <Route path="ekosistem-aplikasi" element={<ExternalAppsPage />} />

        {/* Pilar 6: Sistem & Hak Akses (RBAC) */}
        <Route path="system/users" element={<AdminManageUsersPage />} />
        <Route path="system/groups" element={<AdminManageGroupsPage />} />
        <Route path="system/menu" element={<AdminManageMenuPage />} />
      </Route>

      {/* ========================================================
          CUSTOMER PORTAL
          ======================================================== */}
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

        {/* Ekosistem Aplikasi BBKKP */}
        <Route path='/ekosistem-aplikasi' element={<ExternalAppsPage/>}/>

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