
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '@/pages/Index';
import AlternativeIndex from '@/pages/AlternativeIndex';
import About from '@/pages/About';
import WhatWeDo from '@/pages/WhatWeDo';
import Contact from '@/pages/Contact';
import News from '@/pages/News';
import NewsDetail from '@/pages/NewsDetail';
import FocusAreaDetail from '@/pages/FocusAreaDetail';
import LegalHelp from '@/pages/LegalHelp';
import Resources from '@/pages/Resources';
import Publications from '@/pages/Publications';
import PublicationDetail from '@/pages/PublicationDetail';
import GrantMaking from '@/pages/GrantMaking';
import ApproachDetail from '@/pages/ApproachDetail';
import NotFound from '@/pages/NotFound';
import ErrorBoundary from '@/components/ErrorBoundary';

// Import existing pages
import Team from '@/pages/Team';
import Partners from '@/pages/Partners';
import Programs from '@/pages/Programs';
import Projects from '@/pages/Projects';
import Opportunities from '@/pages/Opportunities';
import Impact from '@/pages/Impact';
import Heroes from '@/pages/Heroes';
import Donate from '@/pages/Donate';
import Whistleblower from '@/pages/Whistleblower';

// Import approach-specific pages
import CapacityBuilding from '@/pages/CapacityBuilding';
import PolicyAdvocacy from '@/pages/PolicyAdvocacy';
import LearningResearch from '@/pages/LearningResearch';
import PartnershipsNetworking from '@/pages/PartnershipsNetworking';

// Import resource category pages
import GenderJusticeResources from '@/pages/GenderJusticeResources';
import LegalEmpowermentResources from '@/pages/LegalEmpowermentResources';
import ClimateJusticeResources from '@/pages/ClimateJusticeResources';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Home routes */}
            <Route path="/" element={<Index />} />
            <Route path="/alternative" element={<AlternativeIndex />} />
            
            {/* About section routes */}
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/team/:id" element={<Team />} />
            <Route path="/team#leadership" element={<Team />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/whistleblower" element={<Whistleblower />} />
            <Route path="/donate" element={<Donate />} />
            
            {/* Our Work section routes */}
            <Route path="/what-we-do" element={<WhatWeDo />} />
            <Route path="/what-we-do/grant-making" element={<GrantMaking />} />
            <Route path="/what-we-do/capacity-building" element={<CapacityBuilding />} />
            <Route path="/what-we-do/policy-advocacy" element={<PolicyAdvocacy />} />
            <Route path="/what-we-do/learning-research" element={<LearningResearch />} />
            <Route path="/what-we-do/partnerships-networking" element={<PartnershipsNetworking />} />
            
            {/* Approach detail routes */}
            <Route path="/approach/:approachId" element={<ApproachDetail />} />
            <Route path="/approach/direct-implementation" element={<ApproachDetail />} />
            <Route path="/approach/advocacy-policy" element={<ApproachDetail />} />
            <Route path="/approach/research-learning" element={<ApproachDetail />} />
            <Route path="/approach/partnerships-networking" element={<ApproachDetail />} />
            
            {/* Focus areas routes - Updated to match actual slugs */}
            <Route path="/focus-areas/:slug" element={<FocusAreaDetail />} />
            <Route path="/focus-areas/accessible-legal-aid" element={<FocusAreaDetail />} />
            <Route path="/focus-areas/empowered-communities" element={<FocusAreaDetail />} />
            <Route path="/focus-areas/conducive-environment" element={<FocusAreaDetail />} />
            <Route path="/focus-areas/institutional-development" element={<FocusAreaDetail />} />
            <Route path="/focus-areas/climate-justice" element={<FocusAreaDetail />} />
            <Route path="/focus-areas/digital-transformation" element={<FocusAreaDetail />} />
            
            {/* Programs section routes */}
            <Route path="/programs" element={<Programs />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/legal-help" element={<LegalHelp />} />
            
            {/* Our Impact section routes */}
            <Route path="/impact" element={<Impact />} />
            <Route path="/heroes" element={<Heroes />} />
            
            {/* Resources section routes */}
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/publications/:id" element={<PublicationDetail />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/gender-justice" element={<GenderJusticeResources />} />
            <Route path="/resources/legal-empowerment" element={<LegalEmpowermentResources />} />
            <Route path="/resources/climate-justice" element={<ClimateJusticeResources />} />
            <Route path="/resources#training" element={<Resources />} />
            
            {/* Catch all unmatched routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
