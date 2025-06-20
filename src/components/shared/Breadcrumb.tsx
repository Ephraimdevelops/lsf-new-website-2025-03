
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const location = useLocation();
  
  // Generate breadcrumb items from current path if not provided
  const generateBreadcrumbs = () => {
    if (items) return items;
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Add home
    breadcrumbs.push({ name: 'Home', href: '/' });
    
    // Add path segments
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Format segment name
      const name = segment
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

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {index === 0 && (
            <Home className="h-4 w-4 mr-2 text-neutral-gray" />
          )}
          
          {item.href ? (
            <Link 
              to={item.href}
              className="text-neutral-gray hover:text-primary transition-colors duration-200"
            >
              {item.name}
            </Link>
          ) : (
            <span className="text-neutral-dark font-medium">
              {item.name}
            </span>
          )}
          
          {index < breadcrumbItems.length - 1 && (
            <ChevronRight className="h-4 w-4 mx-2 text-neutral-gray" />
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
