
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
import NotFound from '@/pages/NotFound';
import ErrorBoundary from '@/components/ErrorBoundary';

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
            <Route path="/" element={<Index />} />
            <Route path="/alternative" element={<AlternativeIndex />} />
            <Route path="/about" element={<About />} />
            <Route path="/what-we-do" element={<WhatWeDo />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/focus-areas/:slug" element={<FocusAreaDetail />} />
            <Route path="/legal-help" element={<LegalHelp />} />
            <Route path="/resources" element={<Resources />} />
            {/* Catch all unmatched routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
