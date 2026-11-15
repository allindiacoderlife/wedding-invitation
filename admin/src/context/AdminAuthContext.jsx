import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem('wedding_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('wedding_admin_token') || null;
  });

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('wedding_admin_user', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('wedding_admin_user');
    }
  }, [adminUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('wedding_admin_token', token);
    } else {
      localStorage.removeItem('wedding_admin_token');
    }
  }, [token]);

  const login = (userData, authToken) => {
    setAdminUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    setAdminUser(null);
    setToken(null);
    localStorage.removeItem('wedding_admin_user');
    localStorage.removeItem('wedding_admin_token');
  };

  const isAuthenticated = Boolean(adminUser && token);

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
