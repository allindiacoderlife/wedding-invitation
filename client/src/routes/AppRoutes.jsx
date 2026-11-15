import { Routes, Route } from 'react-router-dom';
import { ClientLayout } from '../components/layouts/ClientLayout';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

import { HomePage } from '../pages/client/HomePage';
import { LoginPage } from '../pages/client/LoginPage';
import { RegisterPage } from '../pages/client/RegisterPage';
import { VerifyOtpPage } from '../pages/client/VerifyOtpPage';

import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminGuests } from '../pages/admin/AdminGuests';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Client Public Routes */}
      <Route element={<ClientLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
      </Route>

      {/* Admin Role-Protected Routes */}
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

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
