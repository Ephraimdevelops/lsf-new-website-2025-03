import { useEffect, useState } from 'react';
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { useConvexAuth, useQuery } from 'convex/react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { api } from '../../../convex/_generated/api';
import { dashboardPath } from './dashboardPath';

const appearance = {
  elements: {
    rootBox: 'w-full',
    cardBox: 'w-full shadow-none',
    card: 'w-full shadow-none border-0 bg-transparent p-0',
    headerTitle: 'text-2xl font-bold text-gray-900',
    headerSubtitle: 'text-gray-600',
    formButtonPrimary: 'bg-primary hover:bg-primary/90 rounded-xl py-3 text-sm font-semibold shadow-none',
    formFieldInput: 'rounded-xl border-gray-200 py-3 focus:ring-primary/20',
    footerAction: 'hidden',
  },
};

export default function AuthPage({ signup = false, professional = false }: { signup?: boolean; professional?: boolean }) {
  const { isLoaded, isSignedIn } = useAuth();
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  useEffect(() => {
    if (isLoaded) return;
    const timer = window.setTimeout(() => setLoadTimedOut(true), 15000);
    return () => window.clearTimeout(timer);
  }, [isLoaded]);
  const { isAuthenticated } = useConvexAuth();
  const access = useQuery(api.users.currentAccess, isAuthenticated ? {} : 'skip');
  const loginPath = professional ? '/paralegal-login' : '/login';
  const signupPath = professional ? '/paralegal-signup' : '/signup';

  if (isSignedIn && access) {
    return <Navigate to={professional && signup ? '/become-a-paralegal' : signup ? '/join' : dashboardPath(access.roles)} replace />;
  }

  return (
    <Layout>
      <section className="bg-gray-50 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-md">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Haki Yangu · Legal Services Facility</p>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">{signup ? (professional ? 'Join the paralegal network' : 'Create your account') : 'Welcome back'}</h1>
            <p className="mb-6 text-sm leading-6 text-gray-600">
              {professional ? 'Use your Haki Yangu account. Paralegal access requires an approved application.' : 'Access your legal help, cases and saved progress.'}
            </p>
            {!isLoaded && loadTimedOut ? (
              <div role="alert" className="space-y-3 text-sm text-gray-600">
                <p>Secure sign-in could not load. Check your connection and try again.</p>
                <button onClick={() => window.location.reload()} className="font-semibold text-primary">Retry</button>
              </div>
            ) : !isLoaded || (isSignedIn && access === undefined && isAuthenticated) ? (
              <p role="status" className="py-8 text-center text-sm text-gray-600">Preparing your secure account…</p>
            ) : isSignedIn ? (
              <Navigate to={professional && signup ? '/become-a-paralegal' : signup ? '/join' : access ? dashboardPath(access.roles) : '/join'} replace />
            ) : signup ? (
              <SignUp path={signupPath} routing="path" signInUrl={loginPath} forceRedirectUrl={professional ? '/become-a-paralegal' : '/join'} appearance={appearance} />
            ) : (
              <SignIn path={loginPath} routing="path" signUpUrl={signupPath} forceRedirectUrl="/login" appearance={appearance} />
            )}
            {!isSignedIn && <p className="mt-6 text-center text-sm text-gray-600">
              {signup ? 'Already have an account? ' : 'New to Haki Yangu? '}
              <Link to={signup ? loginPath : signupPath} className="font-semibold text-primary hover:underline">{signup ? 'Log in' : 'Sign up'}</Link>
            </p>}
            {!professional && <Link to={signup ? '/paralegal-signup' : '/paralegal-login'} className="mt-4 block text-center text-sm font-medium text-primary hover:underline">{signup ? 'Apply as a paralegal' : 'Paralegal portal'}</Link>}
            <p className="mt-6 border-t border-gray-100 pt-4 text-center text-xs leading-5 text-gray-500">
              <Link to="/privacy" className="hover:underline">Privacy policy</Link> · <Link to="/terms" className="hover:underline">Terms of use</Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
