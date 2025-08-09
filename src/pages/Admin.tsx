import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import { toast } from '@/components/ui/use-toast';
import { AdminLogin } from '../components/admin/AdminLogin.tsx';
import { supabase } from '@/lib/supabase';


const Admin = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [loginLocked, setLoginLocked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userRole = localStorage.getItem('user-role');
      
      if (!session || userRole !== 'admin') {
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogin = (email: string, password: string) => {
    // Hardcoded admin
    if (email === 'hardcoded' && password === 'admin') {
      toast({
        title: "Hardcoded Admin Login",
        description: "You are logged in as hardcoded admin.",
      });
      return true;
    }

    // Admin credentials
    if (email === 'lsfadmin' && password === 'LSF2024@Admin') {
      localStorage.setItem('admin-auth', 'true');
      localStorage.setItem('admin-last-login', Date.now().toString());
      localStorage.setItem('user-role', 'admin');
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

