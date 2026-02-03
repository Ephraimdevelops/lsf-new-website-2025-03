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

// Eager load critical components
import Index from "./pages/Index";

// Lazy load all other routes for code splitting
const About = lazy(() => import("./pages/About"));
const WhatWeDo = lazy(() => import("./pages/WhatWeDo"));
const Programs = lazy(() => import("./pages/Programs"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const Team = lazy(() => import("./pages/Team"));
const Partners = lazy(() => import("./pages/Partners"));
const Opportunities = lazy(() => import("./pages/Opportunities"));
const Donate = lazy(() => import("./pages/Donate"));
const Heroes = lazy(() => import("./pages/Heroes"));
const News = lazy(() => import("./pages/News"));
const Publications = lazy(() => import("./pages/Publications"));
const Resources = lazy(() => import("./pages/Resources"));
const LegalHelp = lazy(() => import("./pages/LegalHelp"));
const Impact = lazy(() => import("./pages/Impact"));
const GrantMaking = lazy(() => import("./pages/GrantMaking"));
const CapacityBuilding = lazy(() => import("./pages/CapacityBuilding"));
const LearningResearch = lazy(() => import("./pages/LearningResearch"));
const PartnershipsNetworking = lazy(() => import("./pages/PartnershipsNetworking"));
const AccessibleLegalAid = lazy(() => import("./pages/AccessibleLegalAid"));
const EmpoweredCommunities = lazy(() => import("./pages/EmpoweredCommunities"));
const ConduciveEnvironment = lazy(() => import("./pages/ConduciveEnvironment"));
const InstitutionalDevelopment = lazy(() => import("./pages/InstitutionalDevelopment"));
const FocusAreaDetail = lazy(() => import("./pages/FocusAreaDetail"));
const ClimateJusticeResources = lazy(() => import("./pages/ClimateJusticeResources"));
const GenderJusticeResources = lazy(() => import("./pages/GenderJusticeResources"));
const LegalEmpowermentResources = lazy(() => import("./pages/LegalEmpowermentResources"));
const ClimateJustice = lazy(() => import("./pages/ClimateJustice"));
const DigitalTransformation = lazy(() => import("./pages/DigitalTransformation"));
const DirectImplementation = lazy(() => import("./pages/DirectImplementation"));
const AdvocacyPolicy = lazy(() => import("./pages/AdvocacyPolicy"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const PublicationDetail = lazy(() => import("./pages/PublicationDetail"));
const ProgramDetail = lazy(() => import("./pages/ProgramDetail"));
const OpportunityDetail = lazy(() => import("./pages/OpportunityDetail"));
const TeamDetail = lazy(() => import("./pages/TeamDetail"));
const HeroDetail = lazy(() => import("./pages/HeroDetail"));
const StoryDetail = lazy(() => import("./pages/StoryDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const StrategicFocuses = lazy(() => import("./pages/StrategicFocuses"));
const Approaches = lazy(() => import("./pages/Approaches"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const SuccessStories = lazy(() => import("./pages/SuccessStories"));
const Whistleblower = lazy(() => import("./pages/Whistleblower"));
const FAQ = lazy(() => import("./pages/FAQ"));
const HakiYangu = lazy(() => import("./pages/HakiYangu"));
const SaraAI = lazy(() => import("./pages/SaraAI"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const StaffDashboard = lazy(() => import("./pages/StaffDashboard"));
const ParalegalDashboard = lazy(() => import("./pages/ParalegalDashboard"));
const ParalegalSignup = lazy(() => import("./pages/ParalegalSignup"));
const ParalegalLogin = lazy(() => import("./pages/ParalegalLogin"));
const ParalegalSignupAuth = lazy(() => import("./pages/ParalegalSignupAuth"));
const StakeholderDashboard = lazy(() => import("./pages/StakeholderDashboard"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const ProfileSettings = lazy(() => import("./pages/ProfileSettings"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const LSFChatbotFullPage = lazy(() => import("./components/shared/chatbot/LSFChatbotFullPage"));
const Connect = lazy(() => import("./pages/Connect"));
const LinksManager = lazy(() => import("./pages/admin/LinksManager"));
const SaraTrain = lazy(() => import("./pages/SaraTrain"));

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
                      <Route path="/admin/quick-links" element={<LinksManager />} />
                      <Route path="/dashboard/staff" element={
                        <ProtectedRoute allowedRoles={["staff"]}>
                          <StaffDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/paralegal" element={
                        <ProtectedRoute allowedRoles={["paralegal"]}>
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
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/paralegal-login" element={<ParalegalLogin />} />
                      <Route path="/paralegal-signup" element={<ParalegalSignupAuth />} />
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
