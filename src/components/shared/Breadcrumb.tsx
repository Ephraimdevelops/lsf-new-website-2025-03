
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  const location = useLocation();

  // Generate breadcrumb items from current path if none provided
  const defaultItems = React.useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    // Always start with home
    const breadcrumbs: BreadcrumbItem[] = [{ name: 'Home', href: '/' }];

    // Handle special cases and build breadcrumb path
    pathSegments.forEach((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      
      // Clean up segment names for better display
      let name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Handle special route names
      const routeNameMap: Record<string, string> = {
        'what-we-do': 'What We Do',
        'focus-areas': 'Focus Areas',
        'grant-making': 'Grant Making',
        'capacity-building': 'Capacity Building',
        'partnerships-networking': 'Partnerships & Networking',
        'learning-research': 'Learning & Research',
        'policy-advocacy': 'Policy & Advocacy',
        'institutional-development': 'Institutional Development',
        'legal-help': 'Legal Help',
        'news-detail': 'News',
        'publication-detail': 'Publications'
      };

      if (routeNameMap[segment]) {
        name = routeNameMap[segment];
      }
      
      // Don't make the last item clickable
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbs.push({
        name,
        href: isLast ? undefined : path
      });
    });

    return breadcrumbs;
  }, [location.pathname]);

  const breadcrumbItems = items || defaultItems;

  // Don't render if only home item
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav 
      className={cn(
        "flex items-center space-x-2 text-sm text-neutral-600 font-sans",
        className
      )}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={`${item.name}-${index}`} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-neutral-400 mx-2 flex-shrink-0" />
            )}
            {item.href ? (
              <Link 
                to={item.href} 
                className="hover:text-primary transition-colors duration-200 flex items-center font-medium"
              >
                {index === 0 && <Home className="h-4 w-4 mr-1 flex-shrink-0" />}
                <span className="truncate">{item.name}</span>
              </Link>
            ) : (
              <span className="text-neutral-800 font-semibold flex items-center">
                {index === 0 && <Home className="h-4 w-4 mr-1 flex-shrink-0" />}
                <span className="truncate">{item.name}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
