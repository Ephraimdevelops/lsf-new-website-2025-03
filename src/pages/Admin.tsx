
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import { useAuth, useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user: clerkUser } = useUser();
  const access = useQuery(api.users.currentAccess);

  // Admin access requires BOTH Clerk authentication AND server-side Convex role
  const isAdmin = access?.roles.includes('admin') ?? false;

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/login');
    }
  }, [isLoaded, isSignedIn, navigate]);

  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      if (access !== undefined && !isAdmin) {
        toast({
          title: "Access Denied",
          description: "You do not have permission to access the admin panel.",
          variant: "destructive"
        });
        navigate('/');
      }
    }
  }, [isLoaded, isSignedIn, access, clerkUser, isAdmin, navigate, toast]);

  if (!isLoaded || (access === undefined && !clerkUser)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn || !isAdmin) {
    return null;
  }

  return <AdminDashboard onLogout={() => signOut()} />;
};

export default Admin;
