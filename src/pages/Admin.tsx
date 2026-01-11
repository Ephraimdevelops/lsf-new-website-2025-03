
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

// Demo mode secret key - allows reviewers to access admin without authentication
// Access via: /admin?demo=LSF2026
const DEMO_KEY = 'LSF2026';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user: clerkUser } = useUser();
  const convexUser = useQuery(api.users.current);
  const [searchParams] = useSearchParams();

  // Check for demo mode
  const isDemoMode = searchParams.get('demo') === DEMO_KEY;
  const [showDemoBanner, setShowDemoBanner] = useState(isDemoMode);

  // Check admin access: try Convex first, fallback to email check, or demo mode
  const isAdmin = isDemoMode || convexUser?.role === 'admin' ||
    (clerkUser?.primaryEmailAddress?.emailAddress &&
      ADMIN_EMAILS.includes(clerkUser.primaryEmailAddress.emailAddress));

  useEffect(() => {
    // Skip auth redirect in demo mode
    if (isDemoMode) return;

    if (isLoaded && !isSignedIn) {
      navigate('/login');
    }
  }, [isLoaded, isSignedIn, navigate, isDemoMode]);

  useEffect(() => {
    // Skip access check in demo mode
    if (isDemoMode) return;

    // DEBUG: Remove after fixing
    console.log('Admin.tsx DEBUG:', {
      convexUser,
      clerkEmail: clerkUser?.primaryEmailAddress?.emailAddress,
      isAdmin,
      isDemoMode
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
  }, [isLoaded, isSignedIn, convexUser, clerkUser, isAdmin, navigate, toast, isDemoMode]);

  // Demo mode - show admin directly with banner
  if (isDemoMode) {
    return (
      <div>
        {/* Demo Mode Banner */}
        {showDemoBanner && (
          <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white px-4 py-2 z-[100] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">🔍 DEMO MODE</span>
              <span className="text-sm">This is a preview of the admin panel for review purposes. Changes will not be saved without authentication.</span>
            </div>
            <button
              onClick={() => setShowDemoBanner(false)}
              className="text-white hover:text-amber-100 font-bold px-2"
            >
              ✕
            </button>
          </div>
        )}
        <div className={showDemoBanner ? 'pt-10' : ''}>
          <AdminDashboard onLogout={() => navigate('/')} />
        </div>
      </div>
    );
  }

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
