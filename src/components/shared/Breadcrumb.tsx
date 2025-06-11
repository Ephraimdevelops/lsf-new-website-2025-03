
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import Typography from './Typography';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb = ({ items, className = "" }: BreadcrumbProps) => {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <Link 
        to="/" 
        className="flex items-center text-neutral-gray hover:text-primary transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-neutral-gray/60" />
          {item.href && index < items.length - 1 ? (
            <Link 
              to={item.href} 
              className="text-neutral-gray hover:text-primary transition-colors"
            >
              <Typography variant="bodySmall" className="truncate max-w-[200px]">
                {item.label}
              </Typography>
            </Link>
          ) : (
            <Typography 
              variant="bodySmall" 
              className="text-primary font-medium truncate max-w-[200px]"
            >
              {item.label}
            </Typography>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
