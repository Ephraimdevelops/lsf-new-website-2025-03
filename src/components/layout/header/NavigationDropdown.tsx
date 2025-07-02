import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  description: string;
  subItems: Array<{
    name: string;
    href: string;
    description: string;
  }>;
}

interface NavigationDropdownProps {
  item: NavigationItem;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const NavigationDropdown = ({ item, isActive, onMouseEnter, onMouseLeave }: NavigationDropdownProps) => {
  const location = useLocation();

  return (
    <div 
      className={cn(
        "absolute left-0 top-full mt-2 w-80 rounded-lg shadow-xl bg-white border border-gray-200 transition-all duration-200 z-[60]",
        isActive 
          ? "opacity-100 visible translate-y-0" 
          : "opacity-0 invisible -translate-y-2"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header with icon instead of image */}
      <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-t-lg border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-primary rounded-sm"></div>
          </div>
          <div>
            <div className="font-semibold text-sm text-gray-900">{item.name}</div>
            <div className="text-xs text-gray-600">{item.description}</div>
          </div>
        </div>
      </div>
      
      {/* Menu items */}
      <div className="p-3">
        {item.subItems.map((subItem) => (
          <Link
            key={subItem.name}
            to={subItem.href}
            className={cn(
              "flex items-start p-2 rounded-md transition-colors duration-200 hover:bg-muted group",
              location.pathname === subItem.href
                ? "text-primary bg-primary/10"
                : "text-foreground hover:text-primary"
            )}
          >
            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mr-2 mt-1.5 transition-colors duration-200 group-hover:bg-primary"></div>
            <div>
              <div className="font-medium text-sm">{subItem.name}</div>
              <div className="text-xs text-muted-foreground">{subItem.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavigationDropdown;