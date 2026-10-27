import BrandLoading from './components/shared/BrandLoading';
import { LanguagePreferenceSync } from "@/components/auth/LanguagePreferenceSync";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ErrorBoundary from '@/components/ErrorBoundary';
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AccountSyncProvider } from "@/hooks/useStoreUserEffect";
import CookieConsent from "@/components/CookieConsent";
import WorkspaceFrame from "@/components/dashboard/WorkspaceFrame";

import { lazyWithRetry } from "./utils/lazyRetry";

// Eager load critical components
import Index from "./pages/Index";

// Lazy load all other routes with retry logic for ChunkLoadErrors
const About = lazyWithRetry(() => import("./pages/About"));
const NewHomepage = lazyWithRetry(() => import("./pages/NewHomepage"));
const HomepageConcept = lazyWithRetry(() => import("./pages/HomepageConcept"));
const HomepageThree = lazyWithRetry(() => import("./pages/HomepageThree"));
const BeneficiaryCase = lazyWithRetry(() => import("./pages/BeneficiaryCase"));
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
const FindHelp = lazyWithRetry(() => import("./pages/FindHelp"));
const ServiceDetail = lazyWithRetry(() => import("./pages/ServiceDetail"));
const KnowYourRights = lazyWithRetry(() => import("./pages/KnowYourRights"));
const RequestHelp = lazyWithRetry(() => import("./pages/RequestHelp"));
const SavedHelp = lazyWithRetry(() => import("./pages/SavedHelp"));
const BeneficiaryDocuments = lazyWithRetry(() => import("./pages/BeneficiaryDocuments"));
const ReportingWorkspace = lazyWithRetry(() => import("./pages/ReportingWorkspace"));
const BeneficiaryRequest = lazyWithRetry(() => import("./pages/BeneficiaryRequest"));
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
const PlatformExplainer = lazyWithRetry(() => import("./pages/PlatformExplainer"));
const HakiYangu = lazyWithRetry(() => import("./pages/HakiYangu"));
const SaraAI = lazyWithRetry(() => import("./pages/SaraAI"));
const AccountDeletion = lazyWithRetry(() => import("./pages/AccountDeletion"));
const Privacy = lazyWithRetry(() => import("./pages/Privacy"));
const Terms = lazyWithRetry(() => import("./pages/Terms"));
const Cookies = lazyWithRetry(() => import("./pages/Cookies"));
const Accessibility = lazyWithRetry(() => import("./pages/Accessibility"));
const SupervisorCase = lazyWithRetry(() => import("./pages/SupervisorCase"));
const SupervisorDashboard = lazyWithRetry(() => import("./pages/SupervisorDashboard"));
const StaffDashboard = lazyWithRetry(() => import("./pages/StaffWorkspace"));
const ParalegalSetup = lazyWithRetry(() => import("./pages/ParalegalSetup"));
const ParalegalDashboard = lazyWithRetry(() => import("./pages/ParalegalDashboard"));
const ParalegalLearning = lazyWithRetry(() => import("./pages/ParalegalLearning"));
const TrainingManagement = lazyWithRetry(() => import("./pages/TrainingManagement"));
const SaadaEvaluations = lazyWithRetry(() => import("./pages/SaadaEvaluations"));
const ProviderOrganisation = lazyWithRetry(() => import("./pages/ProviderOrganisation"));
const ParalegalSignup = lazyWithRetry(() => import("./pages/ParalegalSignup"));
const ParalegalLogin = lazyWithRetry(() => import("./pages/ParalegalLogin"));
const ParalegalSignupAuth = lazyWithRetry(() => import("./pages/ParalegalSignupAuth"));
const StakeholderDashboard = lazyWithRetry(() => import("./pages/StakeholderDashboard"));
const UserDashboard = lazyWithRetry(() => import("./pages/UserDashboard"));
const ProfileSettings = lazyWithRetry(() => import("./pages/ProfileSettings"));
const NotificationCenter = lazyWithRetry(() => import("./pages/NotificationCenter"));
const Signup = lazyWithRetry(() => import("./pages/Signup"));
const Login = lazyWithRetry(() => import("./pages/Login"));
const WorkspacePreview = lazyWithRetry(() => import("./pages/WorkspacePreview"));
const Join = lazyWithRetry(() => import("./pages/Join"));
const LSFChatbotFullPage = lazyWithRetry(() => import("./components/shared/chatbot/LSFChatbotFullPage"));
const Connect = lazyWithRetry(() => import("./pages/Connect"));
const LinksManager = lazyWithRetry(() => import("./pages/admin/LinksManager"));
const SaraTrain = lazyWithRetry(() => import("./pages/SaraTrain"));
const EditorialDashboard = lazyWithRetry(() => import("./pages/EditorialDashboard"));
const LegalGuideReview = lazyWithRetry(() => import("./pages/LegalGuideReview"));
const AccessRequestReview = lazyWithRetry(() => import("./pages/AccessRequestReview"));
const ParalegalReviewQueue = lazyWithRetry(() => import("./pages/ParalegalReviewQueue"));
const ParalegalReviewDetail = lazyWithRetry(() => import("./pages/ParalegalReviewDetail"));
const SafeguardingDashboard = lazyWithRetry(() => import("./pages/SafeguardingDashboard"));

// Loading component
const PageLoader = () => <BrandLoading task="app" fullScreen/>;

// Auth sync wrapper - syncs Clerk users to Convex
const AuthSync = ({ children }: { children: React.ReactNode }) => {
  return <AccountSyncProvider><LanguagePreferenceSync />{children}</AccountSyncProvider>;
};

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthSync>
            <Router>
              <WorkspaceFrame>
              <div className="min-h-screen bg-white">
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {import.meta.env.DEV && <Route path="/workspace-preview" element={<WorkspacePreview />} />}
                      <Route path="/" element={<Index />} />
                      <Route path="/new-homepage" element={<NewHomepage />} />
                      <Route path="/new-homepage01" element={<HomepageConcept variant={1} />} />
                      <Route path="/new-homepage02" element={<HomepageConcept variant={2} />} />
                      <Route path="/new-homepage03" element={<HomepageThree />} />
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
                      <Route path="/dashboard/staff/cases/:id" element={<ProtectedRoute allowedRoles={["admin", "staff", "supervisor"]}><SupervisorCase /></ProtectedRoute>} />
                      <Route path="/dashboard/supervisor/cases/:id" element={<ProtectedRoute allowedRoles={["admin", "supervisor"]}><SupervisorCase /></ProtectedRoute>} />
                      <Route path="/dashboard/supervisor" element={<ProtectedRoute allowedRoles={["admin", "supervisor"]}><SupervisorDashboard /></ProtectedRoute>} />
                      <Route path="/dashboard/staff" element={
                        <ProtectedRoute allowedRoles={["admin", "supervisor", "staff"]}>
                          <StaffDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/access-requests/:id" element={
                        <ProtectedRoute allowedRoles={["admin"]}><AccessRequestReview /></ProtectedRoute>
                      } />
                      <Route path="/dashboard/paralegal-reviews" element={
                        <ProtectedRoute allowedRoles={["admin", "staff"]}><ParalegalReviewQueue /></ProtectedRoute>
                      } />
                      <Route path="/dashboard/paralegal-reviews/:id" element={
                        <ProtectedRoute allowedRoles={["admin", "staff"]}><ParalegalReviewDetail /></ProtectedRoute>
                      } />
                      <Route path="/dashboard/safeguarding" element={
                        <ProtectedRoute allowedRoles={["admin", "supervisor", "staff", "safeguarding_officer"]}>
                          <SafeguardingDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/reporting" element={
                        <ProtectedRoute allowedRoles={["admin", "supervisor", "staff"]}>
                          <ReportingWorkspace />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/training-management" element={
                        <ProtectedRoute allowedRoles={["admin", "staff"]}>
                          <TrainingManagement />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/saada-evaluations" element={
                        <ProtectedRoute allowedRoles={["admin", "staff"]}>
                          <SaadaEvaluations />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/editorial" element={
                        <ProtectedRoute allowedRoles={["admin", "content_editor"]}>
                          <EditorialDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/editorial/review/:id" element={
                        <ProtectedRoute allowedRoles={["admin", "content_editor"]}>
                          <LegalGuideReview />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/provider" element={<ProtectedRoute allowedRoles={["provider_staff"]}><ParalegalDashboard /></ProtectedRoute>} />
                      <Route path="/dashboard/paralegal" element={
                        <ProtectedRoute allowedRoles={["paralegal", "provider_staff"]}>
                          <ParalegalDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/paralegal/onboarding" element={<ProtectedRoute allowedRoles={["paralegal"]}><ParalegalSetup /></ProtectedRoute>} />
                      <Route path="/dashboard/paralegal/learning" element={
                        <ProtectedRoute allowedRoles={["paralegal"]}>
                          <ParalegalLearning />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/provider/organisation" element={
                        <ProtectedRoute allowedRoles={["paralegal", "provider_staff"]}>
                          <ProviderOrganisation />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/stakeholder" element={
                        <ProtectedRoute allowedRoles={["stakeholder", "donor"]}>
                          <StakeholderDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/user/cases/:id" element={<ProtectedRoute allowedRoles={["user", "paralegal", "provider_staff"]}><BeneficiaryCase /></ProtectedRoute>} />
                      <Route path="/dashboard/user/requests/:id" element={<ProtectedRoute allowedRoles={["user", "paralegal", "provider_staff"]}><BeneficiaryRequest /></ProtectedRoute>} />
                      <Route path="/dashboard/user/saved-help" element={<ProtectedRoute allowedRoles={["user", "paralegal", "provider_staff"]}><SavedHelp /></ProtectedRoute>} />
                      <Route path="/dashboard/user/documents" element={<ProtectedRoute allowedRoles={["user", "paralegal", "provider_staff"]}><BeneficiaryDocuments /></ProtectedRoute>} />
                      <Route path="/dashboard/user" element={
                        <ProtectedRoute allowedRoles={["user", "paralegal", "provider_staff"]}>
                          <UserDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
                      <Route path="/notifications" element={<ProtectedRoute><NotificationCenter /></ProtectedRoute>} />
                      <Route path="/bookmarks" element={<Bookmarks />} />
                      <Route path="/become-a-paralegal" element={<ParalegalSignup />} />
                      <Route path="/whistleblower" element={<Whistleblower />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/haki-yangu" element={<HakiYangu />} />
                      <Route path="/haki-yangu/how-it-works" element={<PlatformExplainer />} />
                      <Route path="/find-help" element={<FindHelp />} />
                      <Route path="/find-help/:id" element={<ServiceDetail />} />
                      <Route path="/know-your-rights" element={<KnowYourRights />} />
                      <Route path="/know-your-rights/:id" element={<KnowYourRights />} />
                      <Route path="/request-help" element={<RequestHelp />} />
                      <Route path="/sara-ai" element={<SaraAI />} />
                      <Route path="/sara" element={<SaraAI />} />
                      <Route path="/sara/train" element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                          <SaraTrain />
                        </ProtectedRoute>
                      } />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/account-deletion" element={<AccountDeletion />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/cookies" element={<Cookies />} />
                      <Route path="/accessibility" element={<Accessibility />} />
                      <Route path="/signup/*" element={<Signup />} />
                      <Route path="/join" element={<ProtectedRoute><Join /></ProtectedRoute>} />
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
              </WorkspaceFrame>
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
