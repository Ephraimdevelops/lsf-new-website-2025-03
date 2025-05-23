
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProgramDetail from "./pages/ProgramDetail";
import NotFound from "./pages/NotFound";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Publications from "./pages/Publications";
import PublicationDetail from "./pages/PublicationDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Team from "./pages/Team";
import Partners from "./pages/Partners";
import Resources from "./pages/Resources";
import Programs from "./pages/Programs";
import Projects from "./pages/Projects";
import Donate from "./pages/Donate";
import WhatWeDo from "./pages/WhatWeDo";
import Heroes from "./pages/Heroes";
import HeroDetail from "./pages/HeroDetail";
import Opportunities from "./pages/Opportunities";
import Whistleblower from "./pages/Whistleblower";
import Admin from "./pages/Admin";
import LegalHelp from "./pages/LegalHelp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:newsId" element={<NewsDetail />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/publications/:publicationId" element={<PublicationDetail />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:programId" element={<ProgramDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/what-we-do" element={<WhatWeDo />} />
          <Route path="/heroes" element={<Heroes />} />
          <Route path="/heroes/:heroId" element={<HeroDetail />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/whistleblower" element={<Whistleblower />} />
          <Route path="/legal-help" element={<LegalHelp />} />
          <Route path="/admin/*" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
