import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { navigationItems } from './navigationData';

interface MobileNavigationProps {
  mobileMenuOpen: boolean;
  activeDropdown: string | null;
  toggleDropdown: (name: string) => void;
  setLegalAidDialogOpen: (open: boolean) => void;
}

const MobileNavigation = ({ 
  mobileMenuOpen, 
  activeDropdown, 
  toggleDropdown, 
  setLegalAidDialogOpen 
}: MobileNavigationProps) => {
  const location = useLocation();

  return (
    <div className={cn(
      "lg:hidden bg-white border-t border-gray-100 shadow-lg transition-all duration-300 overflow-hidden",
      mobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
    )}>
      <div className="container mx-auto px-4 py-4">
        <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
          <Button 
            className="w-full justify-center bg-primary hover:bg-primary/90 transition-all duration-200 mb-3"
            onClick={() => setLegalAidDialogOpen(true)}
          >
            <Phone className="h-4 w-4 mr-2" />
            Get Legal Help
          </Button>
          <Link to="/donate" className="block">
            <Button 
              variant="outline" 
              className="w-full justify-center border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
            >
              Donate
            </Button>
          </Link>
        </div>
        
        <nav className="space-y-1 max-h-96 overflow-y-auto">
          {navigationItems.map((item) => (
            <div key={item.name} className="py-1">
              <div>
                {item.subItems.length > 0 ? (
                  <button
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 hover:bg-muted/50",
                      activeDropdown === item.name ? "text-primary bg-primary/10" : "text-foreground"
                    )}
                    onClick={() => toggleDropdown(item.name)}
                  >
                    <div className="flex items-center space-x-3">
                      {(item as any).icon && (
                        <img 
                          src={(item as any).icon} 
                          alt={item.name}
                          className="w-5 h-5 object-contain"
                        />
                      )}
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown 
                      size={16} 
                      className={cn(
                        "transition-transform duration-200",
                        activeDropdown === item.name ? "transform rotate-180" : ""
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 hover:bg-muted/50",
                      location.pathname === item.href ? "text-primary bg-primary/10" : "text-foreground"
                    )}
                  >
                    {(item as any).icon && (
                      <img 
                        src={(item as any).icon} 
                        alt={item.name}
                        className="w-5 h-5 object-contain"
                      />
                    )}
                    <span>{item.name}</span>
                  </Link>
                )}
                
                {/* Mobile Dropdown */}
                {item.subItems.length > 0 && activeDropdown === item.name && (
                  <div className="ml-6 mt-2 space-y-1 pb-2 border-l-2 border-gray-200 pl-4">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        className={cn(
                          "block px-3 py-2 text-sm rounded-lg transition-colors duration-200",
                          location.pathname === subItem.href
                            ? "text-primary bg-primary/10 font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileNavigation;