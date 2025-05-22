
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import { useToast } from '@/hooks/use-toast';

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
  
  const handleLogin = (username: string, password: string) => {
    // In a real app, this would validate against a backend API
    // For demo purposes, we're using hardcoded credentials
    if (username === 'admin' && password === 'lsfadmin2024') {
      localStorage.setItem('admin-auth', 'true');
      localStorage.setItem('admin-last-login', Date.now().toString());
      setIsLoggedIn(true);
      setFailedAttempts(0);
      return true;
    } else {
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      
      // Lock login after 5 failed attempts
      if (newFailedAttempts >= 5) {
        const lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
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
