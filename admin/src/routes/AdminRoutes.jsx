import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AdminLayout } from '../components/AdminLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { GuestsPage } from '../pages/GuestsPage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/guests" element={<GuestsPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
