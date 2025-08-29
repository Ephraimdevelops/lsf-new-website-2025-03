import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          navigate('/login');
          return;
        }

        if (!session) {
          toast({
            title: "Authentication Required",
            description: "Please login to access the admin panel",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        // Get user details
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('User error:', userError);
          navigate('/login');
          return;
        }

        // Check if user has admin role
        const userRole = user.user_metadata?.role || user.app_metadata?.role;
        
        if (userRole !== 'admin') {
          toast({
            title: "Access Denied",
            description: "Admin privileges required to access this page",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        // User is authenticated and authorized
        setIsAuthorized(true);
        toast({
          title: "Welcome",
          description: `Logged in as ${user.email}`,
        });

      } catch (error) {
        console.error('Auth check error:', error);
        toast({
          title: "Authentication Error",
          description: "Please login again",
          variant: "destructive",
        });
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
      }

      // Clear local storage
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-role');
      localStorage.removeItem('user-email');
      localStorage.removeItem('admin-auth');
      localStorage.removeItem('admin-last-login');

      setIsAuthorized(false);
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "There was an error logging out",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <AdminDashboard onLogout={handleLogout} />;
};

export default Admin;

