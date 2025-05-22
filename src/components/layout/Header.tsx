
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Navigation structure
const navigationItems = [
  { name: 'Home', href: '/' },
  { 
    name: 'About Us', 
    href: '/about',
    children: [
      { name: 'Our Story', href: '/about' },
      { name: 'Our Team', href: '/team' },
      { name: 'Our Partners', href: '/partners' },
    ] 
  },
  { 
    name: 'Programs', 
    href: '/programs',
    children: [
      { name: 'Legal Empowerment', href: '/programs/legal-empowerment' },
      { name: 'Gender Justice', href: '/programs/gender-justice' },
      { name: 'Climate Justice', href: '/programs/climate-justice' },
      { name: 'Digital Transformation', href: '/programs/digital-transformation' },
    ] 
  },
  { name: 'What We Do', href: '/what-we-do' },
  { 
    name: 'Resources', 
    href: '/resources',
    children: [
      { name: 'News', href: '/news' },
      { name: 'Publications', href: '/publications' },
      { name: 'Stories', href: '/heroes' },
    ] 
  },
  { name: 'Opportunities', href: '/opportunities' },
  { name: 'Contact', href: '/contact' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);
  
  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };
  
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 border-b",
        isScrolled || mobileMenuOpen
          ? "bg-white border-gray-200 shadow-sm"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/140e859b-26c6-4b1b-a99e-a8efaf084eb8.png" 
                alt="LSF Logo"
                className="h-12 w-auto"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.children ? (
                  <>
                    <button
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                          ? "text-primary"
                          : isScrolled
                          ? "text-gray-700 hover:text-primary"
                          : "text-white hover:bg-white/10"
                      )}
                      onClick={() => toggleDropdown(item.name)}
                    >
                      {item.name}
                      <ChevronDown size={16} className="ml-1" />
                    </button>
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 ease-in-out z-10">
                      <div className="py-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      location.pathname === item.href
                        ? "text-primary"
                        : isScrolled
                        ? "text-gray-700 hover:text-primary"
                        : "text-white hover:bg-white/10"
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Action buttons */}
            <div className="flex items-center ml-4 space-x-2">
              <Link to="/legal-help">
                <Button variant="outline" size="sm" className={cn(
                  "hidden md:flex",
                  !isScrolled && "border-white text-white hover:bg-white hover:text-primary"
                )}>
                  Get Legal Help
                </Button>
              </Link>
              <Link to="/donate">
                <Button size="sm">Donate</Button>
              </Link>
              <button 
                className={cn(
                  "p-2 rounded-full transition-colors",
                  isScrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/10"
                )}
              >
                <Search size={18} />
              </button>
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button 
              className={cn(
                "p-2 rounded-md transition-colors",
                isScrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/10"
              )}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 mt-3">
          <div className="container mx-auto px-4 py-3">
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <div key={item.name} className="py-1">
                  {item.children ? (
                    <div>
                      <button
                        className={cn(
                          "flex items-center justify-between w-full px-3 py-2 text-base font-medium rounded-md",
                          location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                            ? "text-primary bg-primary/5"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={() => toggleDropdown(item.name)}
                      >
                        {item.name}
                        <ChevronDown 
                          size={16} 
                          className={cn(
                            "transition-transform duration-200",
                            activeDropdown === item.name ? "transform rotate-180" : ""
                          )}
                        />
                      </button>
                      {activeDropdown === item.name && (
                        <div className="mt-1 pl-4 border-l-2 border-gray-100">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.href}
                              className={cn(
                                "block px-3 py-2 text-sm rounded-md",
                                location.pathname === child.href
                                  ? "text-primary bg-primary/5"
                                  : "text-gray-600 hover:bg-gray-50"
                              )}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn(
                        "block px-3 py-2 text-base font-medium rounded-md",
                        location.pathname === item.href
                          ? "text-primary bg-primary/5"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Mobile action buttons */}
              <div className="pt-4 pb-2 flex flex-col space-y-2">
                <Link to="/legal-help" className="w-full">
                  <Button variant="outline" className="w-full justify-center">
                    Get Legal Help
                  </Button>
                </Link>
                <Link to="/donate" className="w-full">
                  <Button className="w-full justify-center">
                    Donate
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
