import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Header from './Header';
import Footer from './Footer';
import LSFChatbot from '@/components/shared/LSFChatbot';
import SaraFloatingWidget from '@/components/SaraFloatingWidget';
import { useVisitorId } from '@/hooks/useVisitorId';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const logEvent = useMutation(api.analytics.logEvent);
  const visitorId = useVisitorId();

  useEffect(() => {
    // Determine resource type based on path
    let resourceType = 'page';
    if (location.pathname.startsWith('/news/')) resourceType = 'news_article';
    else if (location.pathname.startsWith('/publications/')) resourceType = 'publication_detail';
    else if (location.pathname === '/become-a-paralegal') resourceType = 'paralegal_recruitment';

    // Log the page view
    logEvent({
      type: "page_view",
      resourceId: location.pathname,
      resourceType: resourceType,
      visitorId: visitorId,
      meta: {
        path: location.pathname,
        search: location.search,
        title: document.title
      }
    });
  }, [location.pathname, location.search, logEvent, visitorId]);

  return (
    <div className="flex flex-col min-h-screen bg-white w-full">
      <Header />
      <main className="flex-grow pt-24 w-full overflow-x-hidden">
        {children}
      </main>
      <Footer />
      <SaraFloatingWidget />
    </div>
  );
};

export default Layout;
