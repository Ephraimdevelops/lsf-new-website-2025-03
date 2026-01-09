
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import { useAuth, useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from '@/hooks/use-toast';

// Temporary admin emails for bypass (remove in production after fixing auth)
const ADMIN_EMAILS = [
  'designable2022@gmail.com',
  'ephraba@gmail.com',
  'admin@lsftz.org'
];

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user: clerkUser } = useUser();
  const convexUser = useQuery(api.users.current);

  // Check admin access: try Convex first, fallback to email check
  const isAdmin = convexUser?.role === 'admin' ||
    (clerkUser?.primaryEmailAddress?.emailAddress &&
      ADMIN_EMAILS.includes(clerkUser.primaryEmailAddress.emailAddress));

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/login');
    }
  }, [isLoaded, isSignedIn, navigate]);

  useEffect(() => {
    // DEBUG: Remove after fixing
    console.log('Admin.tsx DEBUG:', {
      convexUser,
      clerkEmail: clerkUser?.primaryEmailAddress?.emailAddress,
      isAdmin
    });

    if (isLoaded && isSignedIn && clerkUser) {
      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You do not have permission to access the admin panel.",
          variant: "destructive"
        });
        navigate('/');
      }
    }
  }, [isLoaded, isSignedIn, convexUser, clerkUser, isAdmin, navigate, toast]);

  if (!isLoaded || (convexUser === undefined && !clerkUser)) {
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

