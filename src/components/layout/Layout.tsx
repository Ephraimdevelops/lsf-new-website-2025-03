import { ReactNode, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Header from './Header';
import Footer from './Footer';
import LSFChatbot from '@/components/shared/LSFChatbot';
import SaraFloatingWidget from '@/components/SaraFloatingWidget';
import { useVisitorId } from '@/hooks/useVisitorId';
import { isWorkspacePath } from '@/components/dashboard/workspacePaths';

interface LayoutProps {
  children: ReactNode;
}

// Paths that have their own dedicated event trackers (to avoid double-counting)
const DETAIL_PAGE_PREFIXES = ['/news/', '/publications/', '/stories/', '/opportunities/'];
const PRIVATE_PAGE_PREFIXES = ['/admin', '/dashboard', '/profile', '/notifications', '/login', '/signup', '/request-help', '/sara', '/join', '/my-'];

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const logEvent = useMutation(api.analytics.logEvent);
  const visitorId = useVisitorId();
  const lastLoggedPath = useRef<string>('');

  useEffect(() => {
    // Guard: Don't fire until visitorId is initialized
    if (!visitorId) return;

    // Guard: Don't fire again for the same path (prevents React strict mode double-fire)
    if (lastLoggedPath.current === location.pathname) return;
    lastLoggedPath.current = location.pathname;

    // Skip paths that have their own dedicated trackers to prevent double-counting
    const isDetailPage = DETAIL_PAGE_PREFIXES.some(prefix => location.pathname.startsWith(prefix));
    if (isDetailPage || PRIVATE_PAGE_PREFIXES.some(prefix => location.pathname.startsWith(prefix))) return;

    // Determine resource type based on path
    let resourceType = 'page';
    if (location.pathname === '/become-a-paralegal') resourceType = 'paralegal_recruitment';

    // Capture real browser metadata for traffic source & device analytics
    const referrerHost = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : '';
    const sourceClass = !referrerHost || referrerHost === window.location.hostname ? 'direct'
      : /google|bing|yahoo|duckduckgo/.test(referrerHost) ? 'search'
      : /facebook|instagram|linkedin|twitter|t\.co/.test(referrerHost) ? 'social' : 'other';
    const deviceClass = /mobile|android|iphone|ipad/i.test(navigator.userAgent) ? 'mobile' : 'desktop';

    // Log the page view — once per unique path
    logEvent({
      type: "page_view",
      resourceId: location.pathname,
      resourceType: resourceType,
      visitorId: visitorId,
      meta: {
        path: location.pathname,
        sourceClass,
        deviceClass,
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search, visitorId]);

  const isHomePage = location.pathname === '/';

  if (isWorkspacePath(location.pathname)) return <>{children}</>;

  return (
    <div className="flex flex-col min-h-screen bg-white w-full">
      <Header />
      <main className={`flex-grow w-full overflow-x-hidden ${!isHomePage ? 'pt-40 sm:pt-36' : ''}`}>
        {children}
      </main>
      <Footer />
      <SaraFloatingWidget />
    </div>
  );
};

export default Layout;
