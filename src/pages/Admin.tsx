
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const user = useQuery(api.users.current);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/login');
    }
  }, [isLoaded, isSignedIn, navigate]);

  useEffect(() => {
    if (isLoaded && isSignedIn && user !== undefined) {
      // user is undefined while loading, null if not found/auth
      if (user === null || user.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You do not have permission to access the admin panel.",
          variant: "destructive"
        });
        navigate('/');
      }
    }
  }, [isLoaded, isSignedIn, user, navigate, toast]);

  if (!isLoaded || user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn || user?.role !== 'admin') {
    return null;
  }

  return <AdminDashboard onLogout={() => signOut()} />;
};

export default Admin;

