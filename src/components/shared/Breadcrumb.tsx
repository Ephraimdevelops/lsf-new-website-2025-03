
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
}

const Breadcrumb = ({ items, showHome = true }: BreadcrumbProps) => {
  const location = useLocation();
  
  // Enhanced breadcrumb generation with better path mapping
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) {
      return showHome ? [{ name: 'Home', href: '/' }, ...items] : items;
    }
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    if (showHome) {
      breadcrumbs.push({ name: 'Home', href: '/' });
    }
    
    // Path mapping for better breadcrumb names
    const pathMapping: Record<string, string> = {
      'what-we-do': 'Our Work',
      'grant-making': 'Grant Making',
      'capacity-building': 'Capacity Building',
      'policy-advocacy': 'Policy & Advocacy',
      'learning-research': 'Learning & Research',
      'partnerships-networking': 'Partnerships & Networking',
      'focus-areas': 'Focus Areas',
      'accessible-legal-aid': 'Accessible Legal Aid',
      'empowered-communities': 'Empowered Communities',
      'conducive-environment': 'Conducive Environment',
      'institutional-development': 'Institutional Development',
      'climate-justice': 'Climate Justice',
      'digital-transformation': 'Digital Transformation',
      'legal-help': 'Get Legal Help',
    };
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Use mapping if available, otherwise format the segment
      const name = pathMapping[segment] || segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        name,
        href: isLast ? undefined : currentPath
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (location.pathname === '/' && !items) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index === 0 && showHome && (
              <Home className="h-4 w-4 mr-2 text-neutral-gray" />
            )}
            
            {item.href ? (
              <Link 
                to={item.href}
                className="text-neutral-gray hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ) : (
              <span className="text-neutral-dark font-semibold">
                {item.name}
              </span>
            )}
            
            {index < breadcrumbItems.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-2 text-neutral-gray" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
