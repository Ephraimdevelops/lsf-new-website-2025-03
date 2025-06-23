
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, Mail, Search, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SearchDialog from '@/components/shared/SearchDialog';
import LegalAidDialog from '@/components/shared/LegalAidDialog';
import { useBookmarks } from '@/hooks/useBookmarks';

// Comprehensive navigation structure without mega menus
const navigationItems = [
  { 
    name: 'About', 
    href: '/about',
    subItems: [
      { name: 'About LSF', href: '/about' },
      { name: 'Our Team', href: '/team' },
      { name: 'Partners', href: '/partners' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Opportunities', href: '/opportunities' },
    ]
  },
  { 
    name: 'What We Do', 
    href: '/what-we-do',
    subItems: [
      { name: 'Overview', href: '/what-we-do' },
      { name: 'Grant Making', href: '/what-we-do/grant-making' },
      { name: 'Capacity Building', href: '/what-we-do/capacity-building' },
      { name: 'Policy & Advocacy', href: '/what-we-do/policy-advocacy' },
      { name: 'Partnerships & Networking', href: '/partnerships-networking' },
      { name: 'Learning & Research', href: '/learning-research' },
      { name: 'Institutional Development', href: '/institutional-development' },
    ]
  },
  { 
    name: 'Focus Areas', 
    href: '/focus-areas',
    subItems: [
      { name: 'Accessible Legal Aid', href: '/focus-areas/accessible-legal-aid' },
      { name: 'Empowered Communities', href: '/focus-areas/empowered-communities' },
      { name: 'Climate Justice', href: '/focus-areas/climate-justice' },
      { name: 'Digital Transformation', href: '/focus-areas/digital-transformation' },
    ]
  },
  { 
    name: 'Programs', 
    href: '/programs',
    subItems: [
      { name: 'All Programs', href: '/programs' },
      { name: 'Get Legal Help', href: '/legal-help' },
    ]
  },
  { 
    name: 'Impact', 
    href: '/impact',
    subItems: [
      { name: 'Success Stories', href: '/heroes' },
      { name: 'Impact Metrics', href: '/impact' },
    ]
  },
  { 
    name: 'Resources', 
    href: '/resources',
    subItems: [
      { name: 'Latest News', href: '/news' },
      { name: 'Publications', href: '/publications' },
      { name: 'Legal Resources', href: '/resources' },
    ]
  },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [legalAidDialogOpen, setLegalAidDialogOpen] = useState(false);
  const location = useLocation();
  const { count } = useBookmarks();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);
  
  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };
  
  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled || mobileMenuOpen
            ? "bg-white shadow-lg border-b border-gray-100"
            : "bg-white/95 backdrop-blur-sm"
        )}
      >
        {/* Contact Strip */}
        <div className={cn(
          "bg-primary text-white py-2 transition-all duration-300",
          isScrolled ? "h-0 overflow-hidden opacity-0" : "h-auto opacity-100"
        )}>
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Legal Helpline: +255 870 119 363</span>
                </div>
                <div className="hidden md:flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@legalservicesfacility.org</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/contact" className="hover:text-secondary-orange transition-colors duration-200">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-3 group">
                <img 
                  src="/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png" 
                  alt="LSF Logo"
                  className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                />
                <div className="hidden md:block">
                  <div className="text-sm font-bold text-primary transition-colors duration-200 group-hover:text-primary/80">
                    Legal Services Facility
                  </div>
                  <div className="text-xs text-neutral-gray">Empowering Justice Since 2011</div>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  <button
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105",
                      location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                        ? "text-primary bg-primary/10 shadow-sm"
                        : "text-gray-700 hover:text-primary hover:bg-primary/5"
                    )}
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.name}
                    <ChevronDown 
                      size={16} 
                      className={cn(
                        "ml-1 transition-all duration-300",
                        activeDropdown === item.name ? "rotate-180 text-primary" : "group-hover:text-primary"
                      )}
                    />
                  </button>
                  
                  {/* Animated Dropdown */}
                  <div 
                    className={cn(
                      "absolute left-0 top-full mt-2 w-64 rounded-xl shadow-xl bg-white ring-1 ring-black/5 transition-all duration-300 transform origin-top",
                      activeDropdown === item.name 
                        ? "opacity-100 visible scale-100 translate-y-0" 
                        : "opacity-0 invisible scale-95 -translate-y-2"
                    )}
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="p-2">
                      {item.subItems?.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className={cn(
                            "flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:translate-x-1",
                            location.pathname === subItem.href
                              ? "text-primary bg-primary/5 font-medium"
                              : "text-gray-700"
                          )}
                        >
                          <span className="w-2 h-2 bg-primary/20 rounded-full mr-3 transition-all duration-200 hover:bg-primary"></span>
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Bookmarks link with animation */}
              <Link
                to="/bookmarks"
                className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-primary transition-all duration-200 relative transform hover:scale-105"
              >
                <Bookmark size={18} className="transition-transform duration-200 hover:rotate-12" />
                <span>Bookmarks</span>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </Link>
              
              {/* Action buttons with enhanced animations */}
              <div className="flex items-center ml-6 space-x-3 border-l border-gray-200 pl-6">
                <div className="transform hover:scale-110 transition-transform duration-200">
                  <SearchDialog />
                </div>
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90 flex items-center space-x-2 transform hover:scale-105 transition-all duration-200 hover:shadow-lg"
                  onClick={() => setLegalAidDialogOpen(true)}
                >
                  <Phone className="h-4 w-4" />
                  <span>Get Help</span>
                </Button>
                <Link to="/donate">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    Donate
                  </Button>
                </Link>
              </div>
            </nav>
            
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden space-x-3">
              <div className="transform hover:scale-110 transition-transform duration-200">
                <SearchDialog />
              </div>
              <Link to="/donate">
                <Button size="sm" className="bg-primary hover:bg-primary/90 transition-all duration-200">
                  Donate
                </Button>
              </Link>
              <button 
                className={cn(
                  "p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-all duration-200 transform hover:scale-110",
                  mobileMenuOpen && "bg-gray-100"
                )}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Mobile Navigation */}
        <div className={cn(
          "lg:hidden bg-white border-t border-gray-100 shadow-lg transition-all duration-300 overflow-hidden",
          mobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="container mx-auto px-4 py-4">
            <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-secondary-teal/5 rounded-xl">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="w-full justify-center bg-primary hover:bg-primary/90 transition-all duration-200"
                  onClick={() => setLegalAidDialogOpen(true)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Get Help
                </Button>
                <Link to="/bookmarks" className="w-full relative">
                  <Button variant="outline" className="w-full justify-center border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Bookmarks
                    {count > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {count > 99 ? '99+' : count}
                      </span>
                    )}
                  </Button>
                </Link>
              </div>
            </div>
            
            <nav className="space-y-1 max-h-96 overflow-y-auto">
              {navigationItems.map((item) => (
                <div key={item.name} className="py-1">
                  <div>
                    <button
                      className={cn(
                        "flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 hover:bg-primary/5",
                        activeDropdown === item.name ? "text-primary bg-primary/10" : "text-gray-700"
                      )}
                      onClick={() => toggleDropdown(item.name)}
                    >
                      <span>{item.name}</span>
                      <ChevronDown 
                        size={16} 
                        className={cn(
                          "transition-transform duration-300",
                          activeDropdown === item.name ? "transform rotate-180" : ""
                        )}
                      />
                    </button>
                    
                    <div className={cn(
                      "transition-all duration-300 overflow-hidden",
                      activeDropdown === item.name ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}>
                      <div className="mt-2 pl-4 border-l-2 border-primary/20 bg-gray-50/50 rounded-r-lg">
                        {item.subItems?.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={cn(
                              "flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-all duration-200 hover:bg-white hover:translate-x-1",
                              location.pathname === subItem.href
                                ? "text-primary bg-white font-medium shadow-sm"
                                : "text-gray-600"
                            )}
                          >
                            <span className="w-2 h-2 bg-primary/30 rounded-full transition-all duration-200"></span>
                            <div className="font-medium">{subItem.name}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <LegalAidDialog 
        open={legalAidDialogOpen} 
        onOpenChange={setLegalAidDialogOpen} 
      />
    </>
  );
};

export default Header;
