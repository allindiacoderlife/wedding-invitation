import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ requiredRole, children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-rose-100">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h2 className="text-2xl font-serif text-stone-800 mb-2">Access Denied</h2>
          <p className="text-stone-600 mb-6 text-sm">
            You need <strong>{requiredRole}</strong> privileges to access this area. Your current role is <strong>{user?.role || 'Guest'}</strong>.
          </p>
          <a
            href="/"
            className="inline-block px-5 py-2.5 rounded-lg bg-rose-700 text-white font-medium hover:bg-rose-800 transition"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return children ? children : <Outlet />;
};
