
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
  label: string;
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
    
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      const path = '/' + pathSegments.slice(0, i + 1).join('/');
      const isLast = i === pathSegments.length - 1;
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        label,
        href: isLast ? undefined : path
      });
    }
    
    return breadcrumbs;
  };
  
  const breadcrumbItems = items || generateBreadcrumbs();
  
  if (breadcrumbItems.length === 0) return null;

  return (
    <ShadcnBreadcrumb className={cn('py-2', className)}>
      <BreadcrumbList className="animate-fade-in">
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
          <BreadcrumbItem key={index} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            <BreadcrumbSeparator>
              <ChevronRight className="h-3.5 w-3.5 text-neutral-gray/60" />
            </BreadcrumbSeparator>
            
            {item.href && index < breadcrumbItems.length - 1 ? (
              <BreadcrumbLink asChild>
                <Link 
                  to={item.href} 
                  className="text-neutral-gray hover:text-primary transition-colors duration-200"
                >
                  <Typography variant="bodySmall" className="truncate max-w-[200px] hover:text-primary transition-colors">
                    {item.label}
                  </Typography>
                </Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>
                <Typography 
                  variant="bodySmall" 
                  className="text-primary font-medium truncate max-w-[200px]"
                >
                  {item.label}
                </Typography>
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </ShadcnBreadcrumb>
  );
};

export default Breadcrumb;
