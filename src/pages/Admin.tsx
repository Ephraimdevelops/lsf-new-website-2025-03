
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    // Check if token exists in localStorage
    !!localStorage.getItem('admin-token')
  );

  const handleLogin = (username: string, password: string) => {
    // In a real application, this would validate credentials with the backend
    // This is just a simple example for demonstration
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('admin-token', 'demo-token-12345');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    setIsAuthenticated(false);
  };

  // Redirect non-admin users
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
};

export default Admin;
