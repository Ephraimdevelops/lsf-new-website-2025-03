
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';

// Admin credentials - in a real app, these would be stored securely on a backend
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'password'
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    // Check if token exists in localStorage
    !!localStorage.getItem('admin-token')
  );
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLoginLocked, setIsLoginLocked] = useState(false);

  // Check if login is locked
  useEffect(() => {
    const lockUntil = localStorage.getItem('admin-login-locked-until');
    if (lockUntil && parseInt(lockUntil) > Date.now()) {
      setIsLoginLocked(true);
      
      // Set timer to unlock
      const unlockTimer = setTimeout(() => {
        setIsLoginLocked(false);
        localStorage.removeItem('admin-login-locked-until');
        setLoginAttempts(0);
      }, parseInt(lockUntil) - Date.now());
      
      return () => clearTimeout(unlockTimer);
    }
  }, []);

  const handleLogin = (username: string, password: string) => {
    // Check if login is locked
    if (isLoginLocked) return false;
    
    // Validate credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('admin-token', `demo-token-${Date.now()}`);
      localStorage.setItem('admin-last-login', new Date().toISOString());
      setIsAuthenticated(true);
      setLoginAttempts(0);
      return true;
    }
    
    // Track failed login attempts
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    
    // Lock login after 5 failed attempts
    if (newAttempts >= 5) {
      const lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
      localStorage.setItem('admin-login-locked-until', lockUntil.toString());
      setIsLoginLocked(true);
    }
    
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    setIsAuthenticated(false);
  };

  // Redirect non-admin users
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} isLocked={isLoginLocked} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
};

export default Admin;
