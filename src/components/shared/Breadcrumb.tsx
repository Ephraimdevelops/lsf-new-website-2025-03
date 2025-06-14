
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import Typography from './Typography';
import { cn } from '@/lib/utils';
import { 
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb = ({ items, className = "" }: BreadcrumbProps) => {
  const location = useLocation();
  
  // Generate automatic breadcrumbs if none provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Route mapping for better names
    const routeNames: Record<string, string> = {
      'what-we-do': 'What We Do',
      'focus-areas': 'Focus Areas',
      'accessible-legal-aid': 'Accessible Legal Aid',
      'empowered-communities': 'Empowered Communities',
      'conducive-environment': 'Conducive Environment',
      'policy-advocacy': 'Policy & Advocacy',
      'capacity-building': 'Capacity Building',
      'learning-research': 'Learning & Research',
      'about': 'About Us',
      'programs': 'Programs',
      'resources': 'Resources',
      'publications': 'Publications',
      'contact': 'Contact',
      'partners': 'Partners',
      'news': 'News',
      'opportunities': 'Opportunities',
      'team': 'Team',
      'admin': 'Admin',
      'legal-empowerment': 'Legal Empowerment',
      'gender-justice': 'Gender Justice',
      'climate-justice': 'Climate Justice',
      'digital-transformation': 'Digital Transformation',
      'policy-briefs': 'Policy Briefs'
    };
    
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      const path = '/' + pathSegments.slice(0, i + 1).join('/');
      const isLast = i === pathSegments.length - 1;
      
      // Use mapped name or convert segment to readable label
      const name = routeNames[segment] || segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        name,
        href: isLast ? undefined : path
      });
    }
    
    return breadcrumbs;
  };
  
  const breadcrumbItems = items || generateBreadcrumbs();
  
  if (breadcrumbItems.length === 0) return null;

  return (
    <div className={cn('mb-4', className)} aria-label="Breadcrumb">
      <ShadcnBreadcrumb>
        <BreadcrumbList className="text-sm">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link 
                to="/" 
                className="flex items-center text-neutral-gray hover:text-primary transition-colors duration-200"
                aria-label="Home"
              >
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {breadcrumbItems.map((item, index) => (
            <BreadcrumbItem key={index}>
              <BreadcrumbSeparator>
                <ChevronRight className="h-3.5 w-3.5 text-neutral-gray/60" />
              </BreadcrumbSeparator>
              
              {item.href && index < breadcrumbItems.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link 
                    to={item.href} 
                    className="text-neutral-gray hover:text-primary transition-colors duration-200"
                  >
                    <Typography variant="small" className="hover:text-primary transition-colors">
                      {item.name}
                    </Typography>
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>
                  <Typography 
                    variant="small" 
                    className="text-primary font-medium"
                  >
                    {item.name}
                  </Typography>
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </ShadcnBreadcrumb>
    </div>
  );
};

export default Breadcrumb;
