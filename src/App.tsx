import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import WhatWeDo from "./pages/WhatWeDo";
import Programs from "./pages/Programs";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Team from "./pages/Team";
import Partners from "./pages/Partners";
import Opportunities from "./pages/Opportunities";
import Donate from "./pages/Donate";
import Heroes from "./pages/Heroes";
import News from "./pages/News";
import Publications from "./pages/Publications";
import Resources from "./pages/Resources";
import LegalHelp from "./pages/LegalHelp";
import Impact from "./pages/Impact";
import GrantMaking from "./pages/GrantMaking";
import CapacityBuilding from "./pages/CapacityBuilding";
import LearningResearch from "./pages/LearningResearch";
import PartnershipsNetworking from "./pages/PartnershipsNetworking";
import AccessibleLegalAid from "./pages/AccessibleLegalAid";
import EmpoweredCommunities from "./pages/EmpoweredCommunities";
import ConduciveEnvironment from "./pages/ConduciveEnvironment";
import InstitutionalDevelopment from "./pages/InstitutionalDevelopment";
import FocusAreaDetail from "./pages/FocusAreaDetail";
import ClimateJusticeResources from "./pages/ClimateJusticeResources";
import GenderJusticeResources from "./pages/GenderJusticeResources";
import LegalEmpowermentResources from "./pages/LegalEmpowermentResources";
import ClimateJustice from "./pages/ClimateJustice";
import DigitalTransformation from "./pages/DigitalTransformation";
import DirectImplementation from "./pages/DirectImplementation";
import AdvocacyPolicy from "./pages/AdvocacyPolicy";
import NewsDetail from "./pages/NewsDetail";
import PublicationDetail from "./pages/PublicationDetail";
import ProgramDetail from "./pages/ProgramDetail";
import OpportunityDetail from "./pages/OpportunityDetail";
import TeamDetail from "./pages/TeamDetail";
import HeroDetail from "./pages/HeroDetail";
import NotFound from "./pages/NotFound";
import StrategicFocuses from "./pages/StrategicFocuses";
import Approaches from "./pages/Approaches";
import Bookmarks from '@/pages/Bookmarks';
import ErrorBoundary from '@/components/ErrorBoundary';
import SuccessStories from './pages/SuccessStories';
import Whistleblower from './pages/Whistleblower';
import FAQ from './pages/FAQ';
import StaffDashboard from "./pages/StaffDashboard";
import ParalegalDashboard from "./pages/ParalegalDashboard";
import StakeholderDashboard from "./pages/StakeholderDashboard";
import Signup from "./pages/Signup";
import { RequireAuth } from "./utils/RequireAuth";
import { isAuthenticated, getUserRole, logout } from "./utils/authUtils";

// Set up axios base URL to use VITE_API_BASE_URL for all API calls
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || '';
import LSFChatbotFullPage from './components/shared/chatbot/LSFChatbotFullPage';

import Login from "./pages/Login";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Router>
            <div className="min-h-screen bg-white">
              <ErrorBoundary>
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
                    <RequireAuth allowedRoles={["admin"]}>
                      <Admin />
                    </RequireAuth>
                  } />
                  <Route path="/dashboard/staff" element={
                    <RequireAuth allowedRoles={["staff"]}>
                      <StaffDashboard />
                    </RequireAuth>
                  } />
                  <Route path="/dashboard/paralegal" element={
                    <RequireAuth allowedRoles={["paralegal"]}>
                      <ParalegalDashboard />
                    </RequireAuth>
                  } />
                  <Route path="/dashboard/stakeholder" element={
                    <RequireAuth allowedRoles={["stakeholder"]}>
                      <StakeholderDashboard />
                    </RequireAuth>
                  } />
                  <Route path="/bookmarks" element={<Bookmarks />} />
                  <Route path="/whistleblower" element={<Whistleblower />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/signup" element={<Signup />} />
                 <Route path="/login" element={<Login />} />
                  <Route path="/lsfchatbot" element={<LSFChatbotFullPage />} />
                  {/* Catch all route for 404 pages */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </div>
          </Router>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
