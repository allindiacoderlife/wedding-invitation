import { Routes, Route, Navigate } from 'react-router-dom';
import { ClientLayout } from '../components/layouts/ClientLayout';
import { CreateInvitationPage } from '../pages/client/CreateInvitationPage';

// ============================================================================
// TEMPORARILY DISABLED ROUTES (Code preserved - uncomment when needed)
// ============================================================================
// import { AdminLayout } from '../components/layouts/AdminLayout';
// import { ProtectedRoute } from '../components/common/ProtectedRoute';
// import { HomePage } from '../pages/client/HomePage';
// import { LoginPage } from '../pages/client/LoginPage';
// import { RegisterPage } from '../pages/client/RegisterPage';
// import { VerifyOtpPage } from '../pages/client/VerifyOtpPage';
// import { TrackOrderPage } from '../pages/client/TrackOrderPage';
// import { AdminDashboard } from '../pages/admin/AdminDashboard';
// import { AdminGuests } from '../pages/admin/AdminGuests';
// import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Client Active Route: Create Invitation Only */}
      <Route element={<ClientLayout />}>
        <Route path="/" element={<CreateInvitationPage />} />
        <Route path="/create-invitation" element={<CreateInvitationPage />} />

        {/* Redirect any other path directly to /create-invitation */}
        <Route path="*" element={<Navigate to="/create-invitation" replace />} />
      </Route>

      {/* 
      ============================================================================
      FULL PREVIOUS ROUTES (Uncomment below to restore full multi-page application)
      ============================================================================
      <Route element={<ClientLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-invitation" element={<CreateInvitationPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="guests" element={<AdminGuests />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
      ============================================================================
      */}
    </Routes>
  );
};
