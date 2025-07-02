import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SearchDialog from '@/components/shared/SearchDialog';
import NavigationDropdown from './NavigationDropdown';
import { navigationItems } from './navigationData';

interface DesktopNavigationProps {
  activeDropdown: string | null;
  setActiveDropdown: (name: string | null) => void;
  setLegalAidDialogOpen: (open: boolean) => void;
}

const DesktopNavigation = ({ 
  activeDropdown, 
  setActiveDropdown, 
  setLegalAidDialogOpen 
}: DesktopNavigationProps) => {
  const location = useLocation();

  return (
    <nav className="hidden lg:flex items-center space-x-1">
      {navigationItems.map((item) => (
        <div key={item.name} className="relative group">
          {item.subItems.length > 0 ? (
            <button
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                  ? "text-primary bg-primary/10"
                  : "text-foreground hover:text-primary hover:bg-muted/50"
              )}
              onMouseEnter={() => setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {item.name}
              <ChevronDown 
                size={16} 
                className={cn(
                  "ml-1 transition-transform duration-200",
                  activeDropdown === item.name ? "rotate-180" : ""
                )}
              />
            </button>
          ) : (
            <Link
              to={item.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                location.pathname === item.href
                  ? "text-primary bg-primary/10"
                  : "text-foreground hover:text-primary hover:bg-muted/50"
              )}
            >
              {item.name}
            </Link>
          )}
          
          {item.subItems.length > 0 && (
            <NavigationDropdown
              item={item}
              isActive={activeDropdown === item.name}
              onMouseEnter={() => setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            />
          )}
        </div>
      ))}
      
      {/* Action buttons */}
      <div className="flex items-center ml-6 space-x-3 border-l border-border pl-6">
        <div className="transform hover:scale-110 transition-transform duration-200">
          <SearchDialog />
        </div>
        <Button 
          size="sm" 
          className="bg-primary hover:bg-primary/90 flex items-center space-x-2 transform hover:scale-105 transition-all duration-200 hover:shadow-lg rounded-lg px-4"
          onClick={() => setLegalAidDialogOpen(true)}
        >
          <Phone className="h-4 w-4" />
          <span>Get Legal Help</span>
        </Button>
        <Link to="/donate">
          <Button 
            variant="outline" 
            size="sm" 
            className="border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 rounded-lg px-4"
          >
            Donate
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default DesktopNavigation;