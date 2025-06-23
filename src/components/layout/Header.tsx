
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, Mail, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SearchDialog from '@/components/shared/SearchDialog';
import LegalAidDialog from '@/components/shared/LegalAidDialog';

// Enhanced navigation structure with visual elements
const navigationItems = [
  { 
    name: 'About', 
    href: '/about',
    description: 'Learn about our mission and team',
    image: '/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png',
    subItems: [
      { name: 'About LSF', href: '/about', description: 'Our story and mission' },
      { name: 'Our Team', href: '/team', description: 'Meet our leadership' },
      { name: 'Partners', href: '/partners', description: 'Strategic collaborations' },
      { name: 'Contact Us', href: '/contact', description: 'Get in touch' },
      { name: 'Opportunities', href: '/opportunities', description: 'Join our team' },
    ]
  },
  { 
    name: 'What We Do', 
    href: '/what-we-do',
    description: 'Our comprehensive approach to justice',
    image: '/lovable-uploads/background with mother umage .png',
    subItems: [
      { name: 'Overview', href: '/what-we-do', description: 'Complete picture of our work' },
      { name: 'Grant Making', href: '/what-we-do/grant-making', description: 'Strategic funding approach' },
      { name: 'Capacity Building', href: '/what-we-do/capacity-building', description: 'Strengthening organizations' },
      { name: 'Policy & Advocacy', href: '/what-we-do/policy-advocacy', description: 'System-level change' },
      { name: 'Partnerships & Networking', href: '/partnerships-networking', description: 'Building alliances' },
      { name: 'Learning & Research', href: '/learning-research', description: 'Evidence-based insights' },
      { name: 'Institutional Development', href: '/institutional-development', description: 'Organizational growth' },
    ]
  },
  { 
    name: 'Focus Areas', 
    href: '/focus-areas',
    description: 'Strategic intervention areas',
    image: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png',
    subItems: [
      { name: 'Accessible Legal Aid', href: '/focus-areas/accessible-legal-aid', description: 'Breaking barriers to justice' },
      { name: 'Empowered Communities', href: '/focus-areas/empowered-communities', description: 'Local capacity building' },
      { name: 'Climate Justice', href: '/focus-areas/climate-justice', description: 'Environmental rights protection' },
      { name: 'Digital Transformation', href: '/focus-areas/digital-transformation', description: 'Technology for justice' },
    ]
  },
  { 
    name: 'Programs', 
    href: '/programs',
    description: 'Our active initiatives',
    image: '/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png',
    subItems: [
      { name: 'All Programs', href: '/programs', description: 'Browse all initiatives' },
      { name: 'Get Legal Help', href: '/legal-help', description: 'Find assistance' },
    ]
  },
  { 
    name: 'Impact', 
    href: '/impact',
    description: 'Measurable change and stories',
    image: '/lovable-uploads/b2226752-4a54-463b-af38-a1dd2b57350b.png',
    subItems: [
      { name: 'Success Stories', href: '/heroes', description: 'Real impact stories' },
      { name: 'Impact Metrics', href: '/impact', description: 'Data and outcomes' },
    ]
  },
  { 
    name: 'Resources', 
    href: '/resources',
    description: 'Publications and tools',
    image: '/lovable-uploads/7718b32e-3138-4e78-a7a1-4d63935a2951.png',
    subItems: [
      { name: 'Latest News', href: '/news', description: 'Updates and announcements' },
      { name: 'Publications', href: '/publications', description: 'Research and reports' },
      { name: 'Legal Resources', href: '/resources', description: 'Tools and guides' },
    ]
  },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [legalAidDialogOpen, setLegalAidDialogOpen] = useState(false);
  const location = useLocation();
  
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
                      "flex items-center px-6 py-4 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent",
                      location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                        ? "text-primary bg-gradient-to-r from-primary/10 to-secondary-teal/10 border-primary/20 shadow-lg"
                        : "text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary-teal/5 hover:border-primary/10 hover:shadow-md"
                    )}
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.name}
                    <ChevronDown 
                      size={16} 
                      className={cn(
                        "ml-2 transition-all duration-300",
                        activeDropdown === item.name ? "rotate-180 text-primary" : "group-hover:text-primary"
                      )}
                    />
                  </button>
                  
                  {/* Enhanced Visual Dropdown */}
                  <div 
                    className={cn(
                      "absolute left-0 top-full mt-4 w-80 rounded-2xl shadow-2xl bg-white ring-1 ring-black/5 transition-all duration-300 transform origin-top border border-gray-100/50 backdrop-blur-sm",
                      activeDropdown === item.name 
                        ? "opacity-100 visible scale-100 translate-y-0" 
                        : "opacity-0 invisible scale-95 -translate-y-4"
                    )}
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {/* Header with image */}
                    <div className="relative h-32 rounded-t-2xl overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="font-bold text-lg">{item.name}</div>
                        <div className="text-sm text-white/90">{item.description}</div>
                      </div>
                    </div>
                    
                    {/* Menu items */}
                    <div className="p-4">
                      {item.subItems?.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className={cn(
                            "flex items-start p-3 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary-teal/5 hover:translate-x-1 group",
                            location.pathname === subItem.href
                              ? "text-primary bg-gradient-to-r from-primary/5 to-secondary-teal/5 font-medium border border-primary/10"
                              : "text-gray-700 hover:text-primary"
                          )}
                        >
                          <div className="w-2 h-2 bg-primary/30 rounded-full mr-3 mt-2 transition-all duration-200 group-hover:bg-primary group-hover:scale-125"></div>
                          <div>
                            <div className="font-medium text-sm">{subItem.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{subItem.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Action buttons */}
              <div className="flex items-center ml-6 space-x-3 border-l border-gray-200 pl-6">
                <div className="transform hover:scale-110 transition-transform duration-200">
                  <SearchDialog />
                </div>
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90 flex items-center space-x-2 transform hover:scale-105 transition-all duration-200 hover:shadow-lg rounded-xl px-6"
                  onClick={() => setLegalAidDialogOpen(true)}
                >
                  <Phone className="h-4 w-4" />
                  <span>Get Help</span>
                </Button>
                <Link to="/donate">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg rounded-xl px-6"
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
              <Button 
                className="w-full justify-center bg-primary hover:bg-primary/90 transition-all duration-200"
                onClick={() => setLegalAidDialogOpen(true)}
              >
                <Phone className="h-4 w-4 mr-2" />
                Get Help
              </Button>
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
