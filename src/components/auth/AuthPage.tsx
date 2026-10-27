import BrandLoading from '@/components/shared/BrandLoading';
import { useCopy } from "@/i18n/useCopy";
import { useEffect, useState } from 'react';
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { useConvexAuth, useQuery } from 'convex/react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, BookOpenText, MessageCircleMore, ShieldCheck } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { api } from '../../../convex/_generated/api';
import { dashboardPath } from './dashboardPath';
import { useAccountSync } from '@/hooks/useStoreUserEffect';

const appearance = {
  elements: {
    rootBox: 'w-full',
    cardBox: 'w-full shadow-none',
    card: 'w-full shadow-none border-0 bg-transparent p-0',
    headerTitle: 'text-2xl font-bold text-[#191719]',
    headerSubtitle: 'text-[#686168]',
    formButtonPrimary: 'bg-primary hover:bg-primary/90 rounded-full py-3 text-sm font-semibold shadow-none',
    formFieldInput: 'rounded-2xl border-[#E8E2E5] py-3 focus:ring-primary/20',
    footerAction: 'hidden',
  },
};

export default function AuthPage({ signup = false, professional = false }: { signup?: boolean; professional?: boolean }) {
  const c = useCopy();
  const [searchParams] = useSearchParams();
  const requestedReturn = searchParams.get('returnTo');
  const safeReturn = !professional && requestedReturn && /^\/(notifications|request-help|find-help(?:\/[A-Za-z0-9_-]+)?|know-your-rights(?:\/[A-Za-z0-9_-]+)?)$/.test(requestedReturn) ? requestedReturn : null;
  const { isLoaded, isSignedIn } = useAuth();
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  useEffect(() => {
    if (isLoaded) return;
    const timer = window.setTimeout(() => setLoadTimedOut(true), 15000);
    return () => window.clearTimeout(timer);
  }, [isLoaded]);
  const { isAuthenticated } = useConvexAuth();
  const { status: accountStatus, retry } = useAccountSync();
  const access = useQuery(api.users.currentAccess, isAuthenticated ? {} : 'skip');
  const [accountTimedOut, setAccountTimedOut] = useState(false);
  useEffect(() => {
    if (!isSignedIn || (accountStatus === 'ready' && !!access)) {
      setAccountTimedOut(false);
      return;
    }
    const timer = window.setTimeout(() => setAccountTimedOut(true), 15000);
    return () => window.clearTimeout(timer);
  }, [isSignedIn, accountStatus, access]);
  const loginPath = professional ? '/paralegal-login' : '/login';
  const signupPath = professional ? '/paralegal-signup' : '/signup';

  if (isSignedIn && accountStatus === 'ready' && access) {
    return <Navigate to={professional && signup ? '/become-a-paralegal' : signup ? '/join' : safeReturn ?? dashboardPath(access.roles)} replace />;
  }

  return (
    <Layout>
      <section className="bg-white px-5 py-10 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm text-[#686168] hover:text-primary">
            <ArrowLeft className="h-4 w-4" />{c(" Back to home")}</Link>
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)] lg:gap-20">
          <div className="max-w-xl py-3 lg:py-10">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-[22px] bg-primary text-white shadow-[0_12px_28px_rgba(138,21,56,0.16)]"><ShieldCheck className="h-8 w-8" /></div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">Haki Yangu · LSF</p>
            <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-[#191719] sm:text-5xl">{signup ? (professional ? c("Join the paralegal network") : c("Your rights, in your hands")) : c("Welcome back to Haki Yangu")}</h1>
            <p className="max-w-lg text-base leading-7 text-[#686168]">
              {professional ? c("Use your Haki Yangu account. Paralegal access requires an approved application.") : c("Access your legal help, cases and saved progress.")}
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex items-start gap-4 rounded-[22px] border border-[#E8E2E5] bg-white p-4"><span className="rounded-2xl bg-[#E1F3F2] p-3 text-[#238C8C]"><MessageCircleMore className="h-6 w-6" /></span><span><strong className="block text-[#191719]">{c("Ask for help")}</strong><span className="text-sm text-[#686168]">{c("Get clear guidance on your next step.")}</span></span></div>
              <div className="flex items-start gap-4 rounded-[22px] border border-[#E8E2E5] bg-white p-4"><span className="rounded-2xl bg-[#FFF7DA] p-3 text-[#A55B13]"><BookOpenText className="h-6 w-6" /></span><span><strong className="block text-[#191719]">{c("Keep track")}</strong><span className="text-sm text-[#686168]">{c("Your requests stay with your account.")}</span></span></div>
            </div>
          </div>
          <div className="rounded-[28px] border border-[#E8E2E5] bg-white p-6 shadow-[0_20px_55px_rgba(61,23,37,0.07)] sm:p-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">{c("One account for web and mobile")}</p>
            <h2 className="mb-2 text-2xl font-bold text-[#191719]">{signup ? c("Create your account") : c("Sign in")}</h2>
            <p className="mb-6 text-sm leading-6 text-[#686168]">{signup ? c("Start with email and a password. We will ask for your name and role next.") : c("Use the account you use in the Haki Yangu app.")}</p>
            {!isLoaded && loadTimedOut ? (
              <div role="alert" className="space-y-3 text-sm text-gray-600">
                <p>{c("Secure sign-in could not load. Check your connection and try again.")}</p>
                <button onClick={() => window.location.reload()} className="font-semibold text-primary">{c("Retry")}</button>
              </div>
            ) : isSignedIn && (accountStatus === 'error' || accountTimedOut) ? (
              <div role="alert" className="space-y-3 py-6 text-sm text-gray-600">
                <p>{c("Your sign-in worked, but your Haki Yangu account could not be connected. Retry or contact LSF support if your profile was deactivated.")}</p>
                <button type="button" onClick={() => { setAccountTimedOut(false); retry(); }} className="font-semibold text-primary">{c("Retry account connection")}</button>
                <button type="button" onClick={() => window.location.reload()} className="ml-4 font-semibold text-primary">{c("Reload app")}</button>
              </div>
            ) : !isLoaded || isSignedIn ? (
              <BrandLoading task="account"/>
            ) : signup ? (
              <SignUp path={signupPath} routing="path" signInUrl={loginPath} forceRedirectUrl={professional ? '/become-a-paralegal' : '/join'} appearance={appearance} />
            ) : (
              <SignIn path={loginPath} routing="path" signUpUrl={signupPath} forceRedirectUrl={safeReturn ? `${loginPath}?returnTo=${encodeURIComponent(safeReturn)}` : loginPath} appearance={appearance} />
            )}
            {!isSignedIn && <p className="mt-6 text-center text-sm text-gray-600">
              {signup ? c("Already have an account? ") : c("New to Haki Yangu? ")}
              <Link to={signup ? loginPath : signupPath} className="font-semibold text-primary hover:underline">{signup ? c("Log in") : c("Sign up")}</Link>
            </p>}
            {!professional && <Link to={signup ? '/paralegal-signup' : '/paralegal-login'} className="mt-4 block text-center text-sm font-medium text-primary hover:underline">{signup ? c("Apply as a paralegal") : c("Paralegal portal")}</Link>}
            <p className="mt-6 border-t border-gray-100 pt-4 text-center text-xs leading-5 text-gray-500">
              <Link to="/privacy" className="hover:underline">{c("Privacy policy")}</Link> · <Link to="/terms" className="hover:underline">{c("Terms of use")}</Link>
            </p>
          </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
