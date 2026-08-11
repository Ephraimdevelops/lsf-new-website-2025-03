import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ErrorBoundary from '@/components/ErrorBoundary';
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useStoreUserEffect } from "@/hooks/useStoreUserEffect";
import CookieConsent from "@/components/CookieConsent";

import { lazyWithRetry } from "./utils/lazyRetry";

// Eager load critical components
import Index from "./pages/Index";

// Lazy load all other routes with retry logic for ChunkLoadErrors
const About = lazyWithRetry(() => import("./pages/About"));
const WhatWeDo = lazyWithRetry(() => import("./pages/WhatWeDo"));
const Programs = lazyWithRetry(() => import("./pages/Programs"));
const Contact = lazyWithRetry(() => import("./pages/Contact"));
const Admin = lazyWithRetry(() => import("./pages/Admin"));
const Team = lazyWithRetry(() => import("./pages/Team"));
const Partners = lazyWithRetry(() => import("./pages/Partners"));
const Opportunities = lazyWithRetry(() => import("./pages/Opportunities"));
const Donate = lazyWithRetry(() => import("./pages/Donate"));
const Heroes = lazyWithRetry(() => import("./pages/Heroes"));
const News = lazyWithRetry(() => import("./pages/News"));
const Publications = lazyWithRetry(() => import("./pages/Publications"));
const Resources = lazyWithRetry(() => import("./pages/Resources"));
const LegalHelp = lazyWithRetry(() => import("./pages/LegalHelp"));
const Impact = lazyWithRetry(() => import("./pages/Impact"));
const GrantMaking = lazyWithRetry(() => import("./pages/GrantMaking"));
const CapacityBuilding = lazyWithRetry(() => import("./pages/CapacityBuilding"));
const LearningResearch = lazyWithRetry(() => import("./pages/LearningResearch"));
const PartnershipsNetworking = lazyWithRetry(() => import("./pages/PartnershipsNetworking"));
const AccessibleLegalAid = lazyWithRetry(() => import("./pages/AccessibleLegalAid"));
const EmpoweredCommunities = lazyWithRetry(() => import("./pages/EmpoweredCommunities"));
const ConduciveEnvironment = lazyWithRetry(() => import("./pages/ConduciveEnvironment"));
const InstitutionalDevelopment = lazyWithRetry(() => import("./pages/InstitutionalDevelopment"));
const FocusAreaDetail = lazyWithRetry(() => import("./pages/FocusAreaDetail"));
const ClimateJusticeResources = lazyWithRetry(() => import("./pages/ClimateJusticeResources"));
const GenderJusticeResources = lazyWithRetry(() => import("./pages/GenderJusticeResources"));
const LegalEmpowermentResources = lazyWithRetry(() => import("./pages/LegalEmpowermentResources"));
const ClimateJustice = lazyWithRetry(() => import("./pages/ClimateJustice"));
const DigitalTransformation = lazyWithRetry(() => import("./pages/DigitalTransformation"));
const DirectImplementation = lazyWithRetry(() => import("./pages/DirectImplementation"));
const AdvocacyPolicy = lazyWithRetry(() => import("./pages/AdvocacyPolicy"));
const NewsDetail = lazyWithRetry(() => import("./pages/NewsDetail"));
const PublicationDetail = lazyWithRetry(() => import("./pages/PublicationDetail"));
const ProgramDetail = lazyWithRetry(() => import("./pages/ProgramDetail"));
const OpportunityDetail = lazyWithRetry(() => import("./pages/OpportunityDetail"));
const TeamDetail = lazyWithRetry(() => import("./pages/TeamDetail"));
const HeroDetail = lazyWithRetry(() => import("./pages/HeroDetail"));
const StoryDetail = lazyWithRetry(() => import("./pages/StoryDetail"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));
const StrategicFocuses = lazyWithRetry(() => import("./pages/StrategicFocuses"));
const Approaches = lazyWithRetry(() => import("./pages/Approaches"));
const Bookmarks = lazyWithRetry(() => import("./pages/Bookmarks"));
const SuccessStories = lazyWithRetry(() => import("./pages/SuccessStories"));
const Whistleblower = lazyWithRetry(() => import("./pages/Whistleblower"));
const FAQ = lazyWithRetry(() => import("./pages/FAQ"));
const HakiYangu = lazyWithRetry(() => import("./pages/HakiYangu"));
const SaraAI = lazyWithRetry(() => import("./pages/SaraAI"));
const Privacy = lazyWithRetry(() => import("./pages/Privacy"));
const Terms = lazyWithRetry(() => import("./pages/Terms"));
const Cookies = lazyWithRetry(() => import("./pages/Cookies"));
const Accessibility = lazyWithRetry(() => import("./pages/Accessibility"));
const StaffDashboard = lazyWithRetry(() => import("./pages/StaffDashboard"));
const ParalegalDashboard = lazyWithRetry(() => import("./pages/ParalegalDashboard"));
const ParalegalSignup = lazyWithRetry(() => import("./pages/ParalegalSignup"));
const ParalegalLogin = lazyWithRetry(() => import("./pages/ParalegalLogin"));
const ParalegalSignupAuth = lazyWithRetry(() => import("./pages/ParalegalSignupAuth"));
const StakeholderDashboard = lazyWithRetry(() => import("./pages/StakeholderDashboard"));
const UserDashboard = lazyWithRetry(() => import("./pages/UserDashboard"));
const ProfileSettings = lazyWithRetry(() => import("./pages/ProfileSettings"));
const Signup = lazyWithRetry(() => import("./pages/Signup"));
const Login = lazyWithRetry(() => import("./pages/Login"));
const LSFChatbotFullPage = lazyWithRetry(() => import("./components/shared/chatbot/LSFChatbotFullPage"));
const Connect = lazyWithRetry(() => import("./pages/Connect"));
const LinksManager = lazyWithRetry(() => import("./pages/admin/LinksManager"));
const SaraTrain = lazyWithRetry(() => import("./pages/SaraTrain"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
      <p className="text-neutral-600">Loading...</p>
    </div>
  </div>
);

// Auth sync wrapper - syncs Clerk users to Convex
const AuthSync = ({ children }: { children: React.ReactNode }) => {
  useStoreUserEffect();
  return <>{children}</>;
};

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthSync>
            <Router>
              <div className="min-h-screen bg-white">
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/what-we-do" element={<WhatWeDo />} />
                      <Route path="/strategic-focuses" element={<StrategicFocuses />} />
                      <Route path="/approaches" element={<Approaches />} />
                      <Route path="/what-we-do/grant-making" element={<GrantMaking />} />
                      <Route path="/what-we-do/direct-implementation" element={<DirectImplementation />} />
                      <Route path="/what-we-do/advocacy-policy" element={<AdvocacyPolicy />} />
                      <Route path="/what-we-do/capacity-building" element={<CapacityBuilding />} />
                      <Route path="/what-we-do/learning-research" element={<LearningResearch />} />
                      <Route path="/what-we-do/partnerships-networking" element={<PartnershipsNetworking />} />
                      <Route path="/focus-areas/accessible-legal-aid" element={<AccessibleLegalAid />} />
                      <Route path="/focus-areas/empowered-communities" element={<EmpoweredCommunities />} />
                      <Route path="/focus-areas/conducive-environment" element={<ConduciveEnvironment />} />
                      <Route path="/focus-areas/institutional-development" element={<InstitutionalDevelopment />} />
                      <Route path="/focus-areas/climate-justice" element={<ClimateJustice />} />
                      <Route path="/focus-areas/digital-transformation" element={<DigitalTransformation />} />
                      <Route path="/focus-areas/:slug" element={<FocusAreaDetail />} />
                      <Route path="/programs" element={<Programs />} />
                      <Route path="/programs/:id" element={<ProgramDetail />} />
                      <Route path="/legal-help" element={<LegalHelp />} />
                      <Route path="/impact" element={<Impact />} />
                      <Route path="/heroes" element={<Heroes />} />
                      <Route path="/heroes/:id" element={<HeroDetail />} />
                      <Route path="/stories/:storyId" element={<StoryDetail />} />
                      <Route path="/success-stories" element={<SuccessStories />} />
                      <Route path="/news" element={<News />} />
                      <Route path="/news/:id" element={<NewsDetail />} />
                      <Route path="/publications" element={<Publications />} />
                      <Route path="/publications/:id" element={<PublicationDetail />} />
                      <Route path="/resources" element={<Resources />} />
                      <Route path="/resources/climate-justice" element={<ClimateJusticeResources />} />
                      <Route path="/resources/gender-justice" element={<GenderJusticeResources />} />
                      <Route path="/resources/legal-empowerment" element={<LegalEmpowermentResources />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/team" element={<Team />} />
                      <Route path="/team/:id" element={<TeamDetail />} />
                      <Route path="/partners" element={<Partners />} />
                      <Route path="/opportunities" element={<Opportunities />} />
                      <Route path="/opportunities/:id" element={<OpportunityDetail />} />
                      <Route path="/donate" element={<Donate />} />
                      <Route path="/admin/*" element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                          <Admin />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/quick-links" element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                          <LinksManager />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/staff" element={
                        <ProtectedRoute allowedRoles={["admin", "supervisor", "staff"]}>
                          <StaffDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/paralegal" element={
                        <ProtectedRoute allowedRoles={["paralegal", "provider_staff"]}>
                          <ParalegalDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/stakeholder" element={
                        <ProtectedRoute allowedRoles={["stakeholder"]}>
                          <StakeholderDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/user" element={
                        <ProtectedRoute allowedRoles={["user"]}>
                          <UserDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/profile" element={<ProfileSettings />} />
                      <Route path="/bookmarks" element={<Bookmarks />} />
                      <Route path="/become-a-paralegal" element={<ParalegalSignup />} />
                      <Route path="/whistleblower" element={<Whistleblower />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/haki-yangu" element={<HakiYangu />} />
                      <Route path="/sara-ai" element={<SaraAI />} />
                      <Route path="/sara" element={<SaraAI />} />
                      <Route path="/sara/train" element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                          <SaraTrain />
                        </ProtectedRoute>
                      } />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/cookies" element={<Cookies />} />
                      <Route path="/accessibility" element={<Accessibility />} />
                      <Route path="/signup/*" element={<Signup />} />
                      <Route path="/login/*" element={<Login />} />
                      <Route path="/paralegal-login/*" element={<ParalegalLogin />} />
                      <Route path="/paralegal-signup/*" element={<ParalegalSignupAuth />} />
                      <Route path="/lsfchatbot" element={<LSFChatbotFullPage />} />
                      <Route path="/connect" element={<Connect />} />
                      {/* Catch all route for 404 pages */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
              </div>
            </Router>
          </AuthSync>
          <Toaster />
          <Sonner />
          <CookieConsent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
