
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import { useToast } from '@/hooks/use-toast';

const HARDCODED_ADMIN_EMAIL = "admin@lsf.local";
const HARDCODED_ADMIN_PASSWORD = "LSF2024@Admin";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedAuth = localStorage.getItem('admin-auth');
    return savedAuth === 'true';
  });
  
  const [loginLocked, setLoginLocked] = useState(() => {
    const lockUntil = localStorage.getItem('admin-login-locked-until');
    if (lockUntil) {
      const lockUntilTime = parseInt(lockUntil);
      if (lockUntilTime > Date.now()) {
        return true;
      } else {
        localStorage.removeItem('admin-login-locked-until');
        return false;
      }
    }
    return false;
  });
  
  const [failedAttempts, setFailedAttempts] = useState(0);
  const { toast } = useToast();
  
  const handleLogin = (email: string, password: string) => {
    // Hardcoded admin fallback
    if (email === HARDCODED_ADMIN_EMAIL && password === HARDCODED_ADMIN_PASSWORD) {
      localStorage.setItem('admin-auth', 'true');
      localStorage.setItem('user-role', 'admin');
      setIsLoggedIn(true);
      setFailedAttempts(0);
      toast({ title: "Hardcoded Admin Login", description: "You are logged in as hardcoded admin.", });
      return true;
    }
    // Admin credentials
    if (email === 'lsfadmin' && password === 'LSF2024@Admin') {
      localStorage.setItem('admin-auth', 'true');
      localStorage.setItem('admin-last-login', Date.now().toString());
      setIsLoggedIn(true);
      setFailedAttempts(0);
      return true;
    } else {
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      
      if (newFailedAttempts >= 5) {
        const lockUntil = Date.now() + 15 * 60 * 1000;
        localStorage.setItem('admin-login-locked-until', lockUntil.toString());
        setLoginLocked(true);
        toast({
          title: "Login Locked",
          description: "Too many failed attempts. Try again in 15 minutes.",
          variant: "destructive",
        });
      }
      return false;
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    localStorage.removeItem('user-role');
    setIsLoggedIn(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };
  
  return isLoggedIn ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin onLogin={handleLogin} isLocked={loginLocked} />
  );
};

export default Admin;
