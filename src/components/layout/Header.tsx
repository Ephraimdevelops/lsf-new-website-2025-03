
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, Mail, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SearchDialog from '@/components/shared/SearchDialog';
import LegalAidDialog from '@/components/shared/LegalAidDialog';
import { TouchTarget } from '@/components/shared/TouchTarget';

const navigationItems = [
  { 
    name: 'Home', 
    href: '/',
    description: 'Welcome to LSF',
    image: '/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png',
    subItems: []
  },
  { 
    name: 'Our Impact', 
    href: '/impact',
    description: 'Measurable change and stories',
    image: '/lovable-uploads/b2226752-4a54-463b-af38-a1dd2b57350b.png',
    subItems: [
      { name: 'Impact Overview', href: '/impact', description: 'Data and outcomes' },
      { name: 'Success Stories', href: '/heroes', description: 'Real impact stories' },
    ]
  },
  { 
    name: 'Our Work', 
    href: '/what-we-do',
    description: 'Our comprehensive approach to justice',
    image: '/lovable-uploads/background with mother umage .png',
    subItems: [
      { name: 'What We Do', href: '/what-we-do', description: 'Complete picture of our work' },
      { name: 'Grant Making', href: '/what-we-do/grant-making', description: 'Strategic funding approach' },
      { name: 'Direct Implementation', href: '/what-we-do/direct-implementation', description: 'On-ground projects' },
      { name: 'Advocacy & Policy', href: '/what-we-do/advocacy-policy', description: 'System-level change' },
      { name: 'Capacity Building', href: '/what-we-do/capacity-building', description: 'Strengthening organizations' },
      { name: 'Learning & Research', href: '/what-we-do/learning-research', description: 'Evidence-based insights' },
      { name: 'Strategic Focus Areas', href: '/focus-areas', description: 'Key intervention areas' },
      { name: 'Accessible Legal Aid', href: '/focus-areas/accessible-legal-aid', description: 'Breaking barriers to justice' },
      { name: 'Empowered Communities', href: '/focus-areas/empowered-communities', description: 'Local capacity building' },
      { name: 'Conducive Environment', href: '/focus-areas/conducive-environment', description: 'Policy & framework' },
      { name: 'Institutional Development', href: '/focus-areas/institutional-development', description: 'Organizational growth' },
      { name: 'Climate Justice', href: '/focus-areas/climate-justice', description: 'Environmental rights protection' },
      { name: 'Digital Transformation', href: '/focus-areas/digital-transformation', description: 'Technology for justice' },
    ]
  },
  { 
    name: 'About Us', 
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
    name: 'Stories', 
    href: '/heroes',
    description: 'Real impact stories from communities',
    image: '/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png',
    subItems: [
      { name: 'All Stories', href: '/heroes', description: 'Browse all success stories' },
      { name: 'Programs', href: '/programs', description: 'Our active initiatives' },
    ]
  },
  { 
    name: "What's New", 
    href: '/news',
    description: 'Latest updates and publications',
    image: '/lovable-uploads/7718b32e-3138-4e78-a7a1-4d63935a2951.png',
    subItems: [
      { name: 'Latest News', href: '/news', description: 'Updates and announcements' },
      { name: 'Publications', href: '/publications', description: 'Research and reports' },
      { name: 'Resources', href: '/resources', description: 'Tools and guides' },
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
        {/* Contact Strip - Improved Mobile Behavior */}
        <div className={cn(
          "bg-primary text-primary-foreground transition-all duration-300",
          isScrolled ? "h-0 overflow-hidden opacity-0 py-0" : "py-2 opacity-100"
        )}>
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-4 md:space-x-6">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Legal Helpline: +255 870 119 363</span>
                </div>
                <div className="hidden sm:flex items-center space-x-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">info@legalservicesfacility.org</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  to="/contact" 
                  className="hover:text-secondary-orange transition-colors duration-200 whitespace-nowrap text-sm"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo - Improved Mobile Responsiveness */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
                <img 
                  src="/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png" 
                  alt="LSF Logo"
                  className="h-10 md:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                />
                <div className="hidden sm:block">
                  <div className="text-xs md:text-sm font-bold text-primary transition-colors duration-200 group-hover:text-primary-dark leading-tight">
                    Legal Services Facility
                  </div>
                  <div className="text-[10px] md:text-xs text-neutral-gray leading-tight">
                    Empowering Justice Since 2011
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
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
                  
                  {/* Dropdown menu */}
                  {item.subItems.length > 0 && (
                    <div 
                      className={cn(
                        "absolute left-0 top-full mt-2 w-72 rounded-lg shadow-xl bg-background border border-border transition-all duration-200 z-50",
                        activeDropdown === item.name 
                          ? "opacity-100 visible translate-y-0" 
                          : "opacity-0 invisible -translate-y-2"
                      )}
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {/* Header with image */}
                      <div className="relative h-24 rounded-t-lg overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-2 left-3 text-white">
                          <div className="font-semibold text-sm">{item.name}</div>
                          <div className="text-xs text-white/90">{item.description}</div>
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
            
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden space-x-3">
              <div className="transform hover:scale-110 transition-transform duration-200">
                <SearchDialog />
              </div>
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 transition-all duration-200"
                onClick={() => setLegalAidDialogOpen(true)}
              >
                <Phone className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Get Help</span>
              </Button>
              <TouchTarget
                size="lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  "rounded-md text-neutral-600 hover:bg-neutral-100 transition-all duration-200",
                  mobileMenuOpen && "bg-neutral-100"
                )}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </TouchTarget>
            </div>
          </div>
        </div>
        
        {/* Enhanced Mobile Navigation */}
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
                        <span>{item.name}</span>
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
                          "flex items-center w-full px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 hover:bg-muted/50",
                          location.pathname === item.href ? "text-primary bg-primary/10" : "text-foreground"
                        )}
                      >
                        <span>{item.name}</span>
                      </Link>
                    )}
                    
                    {item.subItems.length > 0 && (
                      <div className={cn(
                        "transition-all duration-200 overflow-hidden",
                        activeDropdown === item.name ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      )}>
                        <div className="mt-2 pl-4 border-l-2 border-primary/20 bg-muted/30 rounded-r-lg">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className={cn(
                                "flex items-center gap-3 py-3 text-sm rounded-md transition-all duration-200 hover:bg-muted/50 min-h-[44px]",
                                location.pathname === subItem.href
                                  ? "text-primary bg-primary/10 font-medium px-3"
                                  : "text-muted-foreground px-3"
                              )}
                            >
                              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full transition-all duration-200 flex-shrink-0"></span>
                              <div className="font-medium">{subItem.name}</div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
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
