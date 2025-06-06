
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SearchDialog from '@/components/shared/SearchDialog';

// Simplified navigation structure - single column, essential links only
const navigationItems = [
  { 
    name: 'Impact', 
    href: '/impact',
    description: 'Our measurable difference in communities',
    links: [
      { name: 'Impact Stories', href: '/heroes' },
      { name: 'Annual Reports', href: '/publications' },
      { name: 'Statistics & Data', href: '/impact#statistics' },
      { name: 'Research & Evaluation', href: '/what-we-do/learning-research' },
    ]
  },
  { 
    name: 'About LSF', 
    href: '/about',
    description: 'Our mission and commitment to justice',
    links: [
      { name: 'Who We Are', href: '/about' },
      { name: 'Our Team', href: '/team' },
      { name: 'Partners', href: '/partners' },
      { name: 'Contact Us', href: '/contact' },
    ]
  },
  { 
    name: 'Our Work', 
    href: '/what-we-do',
    description: 'How we strengthen access to justice',
    links: [
      { name: 'Grant Making', href: '/what-we-do/grant-making' },
      { name: 'Capacity Building', href: '/what-we-do/capacity-building' },
      { name: 'Policy & Advocacy', href: '/what-we-do/policy-advocacy' },
      { name: 'Programs', href: '/programs' },
    ]
  },
  { 
    name: 'Resources', 
    href: '/resources',
    description: 'Legal resources and research',
    links: [
      { name: 'Latest News', href: '/news' },
      { name: 'Publications', href: '/publications' },
      { name: 'Legal Resources', href: '/resources' },
      { name: 'Training Materials', href: '/resources#training' },
    ]
  },
  { 
    name: 'Success Stories', 
    href: '/heroes',
    description: 'Real stories of justice transformation',
    links: [
      { name: 'All Stories', href: '/heroes' },
      { name: 'Women\'s Rights', href: '/heroes#womens-rights' },
      { name: 'Land Rights', href: '/heroes#land-rights' },
      { name: 'Community Justice', href: '/heroes#community-justice' },
    ]
  },
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || mobileMenuOpen
          ? "bg-white shadow-lg border-b border-gray-100"
          : "bg-white/95 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png" 
                alt="LSF Logo"
                className="h-12 w-auto"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                <button
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 font-heading",
                    location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                      ? "text-primary bg-primary/5"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  )}
                  onClick={() => toggleDropdown(item.name)}
                >
                  {item.name}
                  <ChevronDown size={16} className="ml-1 transition-transform group-hover:rotate-180" />
                </button>
                
                {/* Simplified Single Column Dropdown */}
                <div className="absolute left-0 mt-1 w-80 rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50">
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-primary mb-2 font-heading">{item.name}</h3>
                      <p className="text-sm text-gray-600 font-sans">{item.description}</p>
                    </div>
                    <ul className="space-y-2">
                      {item.links.map((link) => (
                        <li key={link.name}>
                          <Link
                            to={link.href}
                            className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group/link"
                          >
                            <div className="font-semibold text-gray-900 group-hover/link:text-primary transition-colors font-heading">
                              {link.name}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Action buttons */}
            <div className="flex items-center ml-6 space-x-3 border-l border-gray-200 pl-6">
              <SearchDialog />
              <Link to="/legal-help">
                <Button size="sm" className="font-medium bg-primary hover:bg-primary/90 font-heading">
                  Get Legal Help
                </Button>
              </Link>
              <Link to="/donate">
                <Button variant="outline" size="sm" className="font-medium font-heading">
                  Support Justice
                </Button>
              </Link>
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button 
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="container mx-auto px-4 py-4">
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <div key={item.name} className="py-1">
                  <div>
                    <button
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 text-base font-medium rounded-md font-heading",
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
                        <ul className="space-y-2">
                          {item.links.map((link) => (
                            <li key={link.name}>
                              <Link
                                to={link.href}
                                className={cn(
                                  "block px-3 py-2 text-sm rounded-md font-heading",
                                  location.pathname === link.href
                                    ? "text-primary bg-primary/5"
                                    : "text-gray-600 hover:bg-gray-50"
                                )}
                              >
                                {link.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Mobile action buttons */}
              <div className="pt-4 pb-2 flex flex-col space-y-2">
                <div className="mb-2">
                  <SearchDialog />
                </div>
                <Link to="/legal-help" className="w-full">
                  <Button className="w-full justify-center bg-primary hover:bg-primary/90 font-heading">
                    Get Legal Help
                  </Button>
                </Link>
                <Link to="/donate" className="w-full">
                  <Button variant="outline" className="w-full justify-center font-heading">
                    Support Justice
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
